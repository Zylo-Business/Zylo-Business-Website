import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

import { config, publicConfig } from "./src/config.js";
import * as store from "./src/store.js";
import { initiateCheckout, checkPaymentStatus, hubtelEnabled } from "./src/hubtel.js";
import { sendThankYou, sendReminder, buildThankYouHtml, buildReminderHtml } from "./src/email.js";
import { createRegistration, updateRegistration, airtableEnabled } from "./src/airtable.js";

// Mark a registration paid exactly once: update the store, mirror to Airtable, send the
// confirmation email. Idempotent — if it's already paid we return without re-sending.
// The caller is responsible for having established that the payment succeeded.
async function finalizePaid(reg, { channel, paidAt, simulated } = {}) {
  if (reg.status === "paid") {
    return { confirmed: true, alreadyProcessed: true, emailSent: reg.emailSent };
  }
  await store.updateByReference(reg.reference, {
    status: "paid",
    paidAt: paidAt || new Date().toISOString(),
    channel: channel || null,
    simulated: !!simulated,
  });
  const updated = await store.findByReference(reg.reference);

  // Mirror the "Paid" status into Airtable (the CRM / source of record).
  if (updated.airtableId) await updateRegistration(updated.airtableId, updated);

  const email = await sendThankYou(updated);
  await store.updateByReference(reg.reference, { emailSent: email.sent, emailError: email.reason || null });
  return { confirmed: true, emailSent: email.sent };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeReference() {
  return `ZYLO-WMC26-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

// ---- Public config for the landing page ----
app.get("/api/config", (_req, res) => res.json(publicConfig()));

// ---- Step 1: capture the lead, create a pending registration ----
app.post("/api/register", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const phone = String(req.body?.phone || "").trim();

  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (phone.replace(/\D/g, "").length < 9) return res.status(400).json({ error: "Please enter a valid phone number." });

  const reference = makeReference();
  const reg = {
    reference,
    name,
    email,
    phone,
    priceGhs: config.priceGhs,
    currency: config.currency,
    status: config.paymentsEnabled ? "pending" : "registered",
    emailSent: false,
    createdAt: new Date().toISOString(),
    source: "landing-page",
    utm: req.body?.utm || null,
  };
  await store.addRegistration(reg);

  // Push the lead into Airtable (the CRM / source of record). This is a non-critical
  // side channel, so fire it off WITHOUT awaiting: a slow, blocked, or misconfigured
  // Airtable must never delay — let alone hang — the payment redirect. We store the
  // returned record id when it resolves so the later "Paid" mirror can find the row.
  createRegistration(reg)
    .then((at) => (at?.id ? store.updateByReference(reference, { airtableId: at.id }) : null))
    .catch((err) => console.error("[airtable] background create failed:", err));

  // Free / lead-gen mode: no payment, confirm immediately and send the email.
  if (!config.paymentsEnabled) {
    const email = await sendThankYou(reg);
    await store.updateByReference(reference, { emailSent: email.sent });
    return res.json({ reference, paymentsEnabled: false, confirmed: true, emailSent: email.sent });
  }

  // Paid mode: create a Hubtel checkout and hand the hosted URL back so the browser
  // can redirect the customer there to pay (Mobile Money or card).
  const checkout = await initiateCheckout(reg);
  if (!checkout.ok) {
    await store.updateByReference(reference, { lastError: checkout.error });
    return res.status(502).json({ error: checkout.error || "Could not start payment." });
  }
  await store.updateByReference(reference, { checkoutId: checkout.checkoutId || null });

  return res.json({ reference, paymentsEnabled: true, checkoutUrl: checkout.checkoutUrl });
});

// ---- Step 2a: Hubtel's server-to-server callback (the source of truth for "paid") ----
// Hubtel POSTs here once the customer finishes on the hosted checkout page. This fires
// even if the customer never makes it back to the return page (e.g. closes the tab).
// The callback payload IS Hubtel's authoritative result, so we trust it here (verifying the
// amount) rather than depending on the Status Check API, which requires IP whitelisting.
app.post("/api/hubtel/callback", async (req, res) => {
  const b = req.body || {};
  const d = b.Data || b.data || {};
  const reference = String(d.ClientReference || d.clientReference || b.clientReference || "").trim();
  const statusStr = String(d.Status || b.Status || "").toLowerCase();
  const responseCode = String(b.ResponseCode || b.responseCode || d.ResponseCode || "");
  const amount = Number(d.Amount ?? d.AmountPaid ?? d.amount ?? 0);

  try {
    if (reference) {
      const reg = await store.findByReference(reference);
      if (reg && reg.status !== "paid") {
        const paid = statusStr === "success" || responseCode === "0000";
        const amountOk = !amount || amount >= reg.priceGhs; // amount is sometimes omitted
        if (paid && amountOk) {
          await finalizePaid(reg, { channel: d.Channel || d.PaymentDetails?.Channel, paidAt: d.Date });
        } else {
          await store.updateByReference(reference, {
            lastError: `callback not paid (status=${d.Status || b.Status}, code=${responseCode}, amount=${amount})`,
          });
        }
      }
    }
  } catch (err) {
    console.error("[hubtel] callback error:", err);
  }
  // Always ack with 200 so Hubtel doesn't retry endlessly; the return page reconciles too.
  res.json({ received: true });
});

// ---- Step 2b: the return page polls this to learn whether the payment went through ----
// Fast path: the callback has already marked it paid → confirm from the store. Otherwise
// try the Status Check API as a fallback (may be unavailable if the server IP isn't
// whitelisted); if so, report "pending" so the page keeps waiting for the callback.
app.get("/api/pay/status", async (req, res) => {
  const reference = String(req.query.reference || "").trim();
  if (!reference) return res.status(400).json({ error: "Missing payment reference." });

  const reg = await store.findByReference(reference);
  if (!reg) return res.status(404).json({ error: "Registration not found." });
  if (reg.status === "paid") return res.json({ confirmed: true, emailSent: reg.emailSent });

  const result = await checkPaymentStatus(reference);
  if (result.ok) {
    const r = await finalizePaid(reg, {
      channel: result.data?.channel,
      paidAt: result.data?.date,
      simulated: result.simulated,
    });
    return res.json(r);
  }
  return res.json({ confirmed: false, pending: true });
});

// ---- Admin: view / export the leads list (protected by ADMIN_TOKEN) ----
function requireAdmin(req, res, next) {
  const token = req.query.token || req.get("x-admin-token");
  if (!config.adminToken || token !== config.adminToken) {
    return res.status(401).json({ error: "Unauthorized. Pass ?token=ADMIN_TOKEN." });
  }
  next();
}

app.get("/admin/registrations", requireAdmin, async (_req, res) => {
  res.json({ stats: await store.stats(), registrations: await store.allRegistrations() });
});

app.get("/admin/registrations.csv", requireAdmin, async (_req, res) => {
  const rows = await store.allRegistrations();
  const cols = ["createdAt", "name", "email", "phone", "status", "priceGhs", "reference", "paidAt", "channel", "emailSent"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="zylotech-webinar-leads.csv"');
  res.send(csv);
});

// ---- Admin: send the "24 hours to go" reminder to every confirmed registrant ----
// Handy if you're NOT using a scheduled Zap. Point a cron/uptime pinger at this the day
// before, or trigger it manually. Idempotency is on you (don't call it twice).
app.post("/admin/send-reminders", requireAdmin, async (_req, res) => {
  const all = await store.allRegistrations();
  const recipients = all.filter((r) => r.status === "paid" || r.status === "registered");
  let sent = 0;
  const failures = [];
  for (const reg of recipients) {
    const r = await sendReminder(reg);
    if (r.sent) sent++;
    else failures.push({ email: reg.email, reason: r.reason });
    await store.updateByReference(reg.reference, { reminderSentAt: r.sent ? new Date().toISOString() : reg.reminderSentAt });
  }
  res.json({ total: recipients.length, sent, failed: failures.length, failures });
});

// ---- Preview the emails in your browser (renders sample data, sends nothing) ----
// Confirmation:  /preview/confirmation   (add ?status=registered for the free-mode variant)
// Reminder:      /preview/reminder
const sampleReg = () => ({
  name: "Kwame Mensah",
  email: "kwame@example.com",
  phone: config.webinar.phone,
  reference: "ZYLO-WMC26-DEMO-123456",
  priceGhs: config.priceGhs,
  status: "paid",
  createdAt: new Date().toISOString(),
});
app.get("/preview/confirmation", (req, res) => {
  const reg = { ...sampleReg(), status: req.query.status === "registered" ? "registered" : "paid" };
  res.type("html").send(buildThankYouHtml(reg));
});
app.get("/preview/reminder", (_req, res) => {
  res.type("html").send(buildReminderHtml(sampleReg()));
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`\n  Zylo Tech Webinar server running → ${config.publicBaseUrl}`);
  console.log(`  Price: ${config.paymentsEnabled ? config.currency + " " + config.priceGhs : "FREE (lead-gen mode)"}`);
  console.log(`  Hubtel: ${hubtelEnabled ? "configured" : "NOT configured"}${config.fakePayments ? " (DEV_FAKE_PAYMENTS on)" : ""}`);
  console.log(`  Resend: ${config.resendApiKey ? "configured" : "NOT configured (emails will be logged)"}`);
  console.log(`  Airtable: ${airtableEnabled ? `configured → table "${config.airtable.table}"` : "NOT configured (skipped)"}`);
  console.log(`  Email delivery: backend (Resend)`);
  console.log(`  Admin leads: ${config.publicBaseUrl}/admin/registrations?token=YOUR_ADMIN_TOKEN\n`);
});
