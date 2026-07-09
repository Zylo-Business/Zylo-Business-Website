import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

import { config, publicConfig } from "./src/config.js";
import * as store from "./src/store.js";
import { verifyTransaction } from "./src/paystack.js";
import { sendThankYou } from "./src/email.js";

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
    amountMinor: config.amountMinor,
    priceGhs: config.priceGhs,
    currency: config.currency,
    status: config.paymentsEnabled ? "pending" : "registered",
    emailSent: false,
    createdAt: new Date().toISOString(),
    source: "landing-page",
    utm: req.body?.utm || null,
  };
  await store.addRegistration(reg);

  // Free / lead-gen mode: no payment, confirm immediately and send the email.
  if (!config.paymentsEnabled) {
    const email = await sendThankYou(reg);
    await store.updateByReference(reference, { emailSent: email.sent });
    return res.json({ reference, paymentsEnabled: false, confirmed: true, emailSent: email.sent });
  }

  return res.json({
    reference,
    paymentsEnabled: true,
    email,
    amountMinor: config.amountMinor,
    currency: config.currency,
    paystackPublicKey: config.paystackPublicKey,
  });
});

// ---- Step 2: verify the Paystack payment, confirm the seat, send the email ----
app.post("/api/pay/verify", async (req, res) => {
  const reference = String(req.body?.reference || "").trim();
  if (!reference) return res.status(400).json({ error: "Missing payment reference." });

  const reg = await store.findByReference(reference);
  if (!reg) return res.status(404).json({ error: "Registration not found." });

  // Idempotent: if we've already confirmed and emailed, don't charge/send twice.
  if (reg.status === "paid") {
    return res.json({ confirmed: true, alreadyProcessed: true, emailSent: reg.emailSent });
  }

  const result = await verifyTransaction(reference);
  if (!result.ok) {
    await store.updateByReference(reference, { lastError: result.error });
    return res.status(402).json({ error: result.error || "Payment could not be verified." });
  }

  await store.updateByReference(reference, {
    status: "paid",
    paidAt: result.data?.paid_at || new Date().toISOString(),
    channel: result.data?.channel || null,
    simulated: !!result.simulated,
  });

  const updated = await store.findByReference(reference);
  const email = await sendThankYou(updated);
  await store.updateByReference(reference, { emailSent: email.sent, emailError: email.reason || null });

  return res.json({ confirmed: true, emailSent: email.sent });
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

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`\n  Zylo Tech Webinar server running → ${config.publicBaseUrl}`);
  console.log(`  Price: ${config.paymentsEnabled ? config.currency + " " + config.priceGhs : "FREE (lead-gen mode)"}`);
  console.log(`  Paystack: ${config.paystackSecretKey ? "configured" : "NOT configured"}${config.fakePayments ? " (DEV_FAKE_PAYMENTS on)" : ""}`);
  console.log(`  Resend: ${config.resendApiKey ? "configured" : "NOT configured (emails will be logged)"}`);
  console.log(`  Admin leads: ${config.publicBaseUrl}/admin/registrations?token=YOUR_ADMIN_TOKEN\n`);
});
