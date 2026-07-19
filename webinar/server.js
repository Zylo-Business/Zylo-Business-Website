import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

import { config, publicConfig } from "./src/config.js";
import * as store from "./src/store.js";
import { initiateCheckout, checkPaymentStatus, hubtelEnabled } from "./src/hubtel.js";
import { sendThankYou, sendReminder, buildThankYouHtml, buildReminderHtml } from "./src/email.js";
import {
  createRegistration,
  updateRegistration,
  findByReference as airtableFindByReference,
  airtableEnabled,
} from "./src/airtable.js";

// Wrap an async route so a rejected promise becomes a clean JSON error instead of a hung
// request. Express 4 does not await handlers, so without this an unhandled rejection (e.g.
// a read-only filesystem on serverless) leaves the client stuck on "Reserving…" forever.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Find a registration by reference. Falls back to Airtable when the local store misses,
// which is always the case on serverless (the callback / status request runs in a fresh
// instance that never saw the original /api/register). Airtable is the source of record.
async function lookupRegistration(reference) {
  return (await store.findByReference(reference)) || (await airtableFindByReference(reference));
}

// Mark a registration paid exactly once: mirror to Airtable, send the confirmation email,
// and best-effort update the local store. Idempotent — if it's already paid we return
// without re-sending. Works with a reg sourced from either the store or Airtable. The
// caller is responsible for having established that the payment succeeded.
async function finalizePaid(reg, { channel, paidAt, simulated } = {}) {
  if (reg.status === "paid") {
    return { confirmed: true, alreadyProcessed: true, emailSent: reg.emailSent };
  }
  const paid = {
    ...reg,
    status: "paid",
    paidAt: paidAt || new Date().toISOString(),
    channel: channel || null,
    simulated: !!simulated,
  };

  // Mirror "Paid" into Airtable (durable), then send the email. Update the local store
  // best-effort (a no-op on serverless, where the cache is empty in this instance).
  await store.updateByReference(reg.reference, {
    status: "paid", paidAt: paid.paidAt, channel: paid.channel, simulated: paid.simulated,
  });
  if (reg.airtableId) await updateRegistration(reg.airtableId, paid);

  const email = await sendThankYou(paid);
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
app.post("/api/register", wrap(async (req, res) => {
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

  // Record the lead in Airtable and (in paid mode) start the Hubtel checkout IN PARALLEL.
  // Both calls are timeout-bounded and never throw, and we AWAIT them: on serverless, work
  // left running after the response is not guaranteed to finish, so nothing is fire-and-forget.
  const [at, checkout] = await Promise.all([
    createRegistration(reg),
    config.paymentsEnabled ? initiateCheckout(reg) : Promise.resolve(null),
  ]);
  if (at?.id) await store.updateByReference(reference, { airtableId: at.id });

  // Free / lead-gen mode: no payment, confirm immediately and send the email.
  if (!config.paymentsEnabled) {
    const mail = await sendThankYou(reg);
    await store.updateByReference(reference, { emailSent: mail.sent });
    return res.json({ reference, paymentsEnabled: false, confirmed: true, emailSent: mail.sent });
  }

  // Paid mode: hand the hosted Hubtel checkout URL back so the browser can redirect the
  // customer there to pay (Mobile Money or card).
  if (!checkout.ok) {
    await store.updateByReference(reference, { lastError: checkout.error });
    return res.status(502).json({ error: checkout.error || "Could not start payment." });
  }
  await store.updateByReference(reference, { checkoutId: checkout.checkoutId || null });

  return res.json({ reference, paymentsEnabled: true, checkoutUrl: checkout.checkoutUrl });
}));

// ---- Step 2a: Hubtel's server-to-server callback (the source of truth for "paid") ----
// Hubtel POSTs here once the customer finishes on the hosted checkout page. This fires
// even if the customer never makes it back to the return page (e.g. closes the tab).
// The callback payload IS Hubtel's authoritative result, so we trust it here (verifying the
// amount) rather than depending on the Status Check API, which requires IP whitelisting.
app.post("/api/hubtel/callback", wrap(async (req, res) => {
  const b = req.body || {};
  const d = b.Data || b.data || {};
  const reference = String(d.ClientReference || d.clientReference || b.clientReference || "").trim();
  const statusStr = String(d.Status || b.Status || "").toLowerCase();
  const responseCode = String(b.ResponseCode || b.responseCode || d.ResponseCode || "");
  const amount = Number(d.Amount ?? d.AmountPaid ?? d.amount ?? 0);

  try {
    if (reference) {
      const reg = await lookupRegistration(reference);
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
}));

// ---- Step 2b: the return page polls this to learn whether the payment went through ----
// Fast path: the callback has already marked it paid → confirm from the store. Otherwise
// try the Status Check API as a fallback (may be unavailable if the server IP isn't
// whitelisted); if so, report "pending" so the page keeps waiting for the callback.
app.get("/api/pay/status", wrap(async (req, res) => {
  const reference = String(req.query.reference || "").trim();
  if (!reference) return res.status(400).json({ error: "Missing payment reference." });

  const reg = await lookupRegistration(reference);
  if (!reg) return res.status(404).json({ error: "Registration not found." });
  // Fast path: the callback already marked it paid (in Airtable on serverless) → confirm.
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
}));

// ---- Admin: view / export the leads list (protected by ADMIN_TOKEN) ----
function requireAdmin(req, res, next) {
  const token = req.query.token || req.get("x-admin-token");
  if (!config.adminToken || token !== config.adminToken) {
    return res.status(401).json({ error: "Unauthorized. Pass ?token=ADMIN_TOKEN." });
  }
  next();
}

app.get("/admin/registrations", requireAdmin, wrap(async (_req, res) => {
  res.json({ stats: await store.stats(), registrations: await store.allRegistrations() });
}));

app.get("/admin/registrations.csv", requireAdmin, wrap(async (_req, res) => {
  const rows = await store.allRegistrations();
  const cols = ["createdAt", "name", "email", "phone", "status", "priceGhs", "reference", "paidAt", "channel", "emailSent"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="zylotech-webinar-leads.csv"');
  res.send(csv);
}));

// ---- Admin: send the "24 hours to go" reminder to every confirmed registrant ----
// Handy if you're NOT using a scheduled Zap. Point a cron/uptime pinger at this the day
// before, or trigger it manually. Idempotency is on you (don't call it twice).
app.post("/admin/send-reminders", requireAdmin, wrap(async (_req, res) => {
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
}));

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

// Last-resort error handler: turn any unhandled route rejection into a clean JSON 500
// so a request never hangs (which is what left the browser stuck on "Reserving…").
app.use((err, _req, res, _next) => {
  console.error("[server] unhandled route error:", err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

// On serverless (Vercel) the platform invokes the exported app per request — do NOT bind a
// port there. Only listen when running as a normal long-lived server (local dev, VPS, etc.).
const onServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
if (!onServerless) {
  app.listen(config.port, () => {
    console.log(`\n  Zylo Tech Webinar server running → ${config.publicBaseUrl}`);
    console.log(`  Price: ${config.paymentsEnabled ? config.currency + " " + config.priceGhs : "FREE (lead-gen mode)"}`);
    console.log(`  Hubtel: ${hubtelEnabled ? "configured" : "NOT configured"}${config.fakePayments ? " (DEV_FAKE_PAYMENTS on)" : ""}`);
    console.log(`  Resend: ${config.resendApiKey ? "configured" : "NOT configured (emails will be logged)"}`);
    console.log(`  Airtable: ${airtableEnabled ? `configured → table "${config.airtable.table}"` : "NOT configured (skipped)"}`);
    console.log(`  Email delivery: backend (Resend)`);
    console.log(`  Admin leads: ${config.publicBaseUrl}/admin/registrations?token=YOUR_ADMIN_TOKEN\n`);
  });
}

// Exported so Vercel's @vercel/node runtime can use the Express app as the request handler.
export default app;
