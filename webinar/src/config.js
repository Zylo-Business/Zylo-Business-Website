import "dotenv/config";

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const priceGhs = num(process.env.PRICE_GHS, 200);

// Treat leftover ".env.example" placeholders (e.g. pk_test_xxxx, re_xxxx) as "not set"
// so a fresh checkout runs cleanly instead of erroring against fake keys.
const real = (v) => (v && !/x{4,}/i.test(v) ? v : "");

export const config = {
  port: num(process.env.PORT, 4000),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${num(process.env.PORT, 4000)}`,

  webinar: {
    title: process.env.WEBINAR_TITLE || "Wealth & Opportunity Master Class 2026",
    dateISO: process.env.WEBINAR_DATE_ISO || "2026-07-17T19:00:00Z",
    dateLabel: process.env.WEBINAR_DATE_LABEL || "July 17–20, 2026 (Fri–Mon)",
    timeLabel: process.env.WEBINAR_TIME_LABEL || "7:00 PM GMT daily",
    location: process.env.WEBINAR_LOCATION || "Online via Zoom",
    zoomLink: process.env.WEBINAR_ZOOM_LINK || "https://zoom.us/j/PLACEHOLDER",
    // Raw number is used ONLY server-side (e.g. the confirmation email). It is never
    // sent to the browser as plain text — see publicConfig() which emits an encoded token.
    phone: process.env.REGISTER_PHONE || "0000000000",
  },

  // Pricing
  priceGhs,
  currency: process.env.CURRENCY || "GHS",
  // Paystack charges in the minor unit (pesewas for GHS)
  amountMinor: Math.round(priceGhs * 100),
  paymentsEnabled: priceGhs > 0,

  // Paystack
  paystackPublicKey: real(process.env.PAYSTACK_PUBLIC_KEY),
  paystackSecretKey: real(process.env.PAYSTACK_SECRET_KEY),

  // Resend
  resendApiKey: real(process.env.RESEND_API_KEY),
  fromEmail: process.env.FROM_EMAIL || "Zylo Tech Solutions <onboarding@resend.dev>",
  replyToEmail: process.env.REPLY_TO_EMAIL || "hello@zylotech.com",

  // Airtable — the CRM / source of record that Zapier watches.
  // Pipeline: Checkout/Registration → Airtable → Zapier → Mailchimp / Resend.
  airtable: {
    apiKey: real(process.env.AIRTABLE_API_KEY), // Personal Access Token (pat...)
    baseId: real(process.env.AIRTABLE_BASE_ID), // app...
    table: process.env.AIRTABLE_TABLE_NAME || "Registrations",
  },

  // Who sends the confirmation email?
  //  - true  (default): the backend sends it directly via Resend (works with no Zapier).
  //  - false: leave email to the Airtable → Zapier → Mailchimp/Resend pipeline so you
  //           don't get duplicate emails. Flip this once your Zap is live.
  backendSendsEmail: String(process.env.BACKEND_SENDS_EMAIL ?? "true").toLowerCase() !== "false",

  // Admin
  adminToken: process.env.ADMIN_TOKEN || "",

  // Dev
  fakePayments: String(process.env.DEV_FAKE_PAYMENTS).toLowerCase() === "true",
};

// Obfuscate the phone so it is not present as a plain string in API responses or the
// page source. The browser reverses this at runtime. Defeats automated scrapers/harvesters
// that grep static HTML/JSON for phone patterns (they never execute this decode step).
function encodePhone(n) {
  return Buffer.from(String(n).split("").reverse().join(""), "utf8").toString("base64");
}

// A safe subset that is OK to expose to the browser.
export function publicConfig() {
  return {
    title: config.webinar.title,
    dateISO: config.webinar.dateISO,
    dateLabel: config.webinar.dateLabel,
    timeLabel: config.webinar.timeLabel,
    location: config.webinar.location,
    phoneEnc: encodePhone(config.webinar.phone),
    priceGhs: config.priceGhs,
    currency: config.currency,
    paymentsEnabled: config.paymentsEnabled,
    paystackPublicKey: config.paystackPublicKey,
  };
}
