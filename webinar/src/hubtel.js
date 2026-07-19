import { config } from "./config.js";

// Hubtel Online Checkout — server-initiated, redirect-based checkout (Mobile Money + cards).
//
// Flow:
//   1. initiateCheckout() → POST /items/initiate → Hubtel returns a hosted `checkoutUrl`.
//   2. The browser is redirected there and the customer pays.
//   3. Hubtel POSTs a server-to-server callback to our callbackUrl (the source of truth for
//      "paid") AND redirects the browser back to our returnUrl.
//   4. checkPaymentStatus() confirms a transaction server-side via the Status Check API.
//
// Auth is HTTP Basic: API ID = username, API Key = password.

const CHECKOUT_URL = "https://payproxyapi.hubtel.com/items/initiate";
const STATUS_BASE = "https://api-txnstatus.hubtel.com/transactions";

// Never let a slow/unreachable Hubtel hang an incoming request. If the call doesn't
// complete in time it aborts and we surface a clear error instead of stalling forever.
const HUBTEL_TIMEOUT_MS = 15000;

export const hubtelEnabled = Boolean(
  config.hubtel.apiId && config.hubtel.apiKey && config.hubtel.merchantAccount
);

function authHeader() {
  const token = Buffer.from(`${config.hubtel.apiId}:${config.hubtel.apiKey}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

function returnUrl(reference, outcome) {
  return `${config.publicBaseUrl}/?ref=${encodeURIComponent(reference)}&pay=${outcome}`;
}

// Ask Hubtel to create a checkout and give us a URL to send the customer to.
// Returns { ok, checkoutUrl, error, simulated }.
export async function initiateCheckout(reg) {
  // Local testing shortcut — skip Hubtel and send the browser straight back as if it paid.
  if (config.fakePayments) {
    return { ok: true, simulated: true, checkoutUrl: returnUrl(reg.reference, "return") };
  }

  if (!hubtelEnabled) {
    return {
      ok: false,
      error:
        "Hubtel is not configured. Set HUBTEL_API_ID, HUBTEL_API_KEY and HUBTEL_MERCHANT_ACCOUNT.",
    };
  }

  const payload = {
    totalAmount: config.priceGhs, // Hubtel expects major units (GHS)
    description: config.webinar.title,
    callbackUrl: `${config.publicBaseUrl}/api/hubtel/callback`,
    returnUrl: returnUrl(reg.reference, "return"),
    cancellationUrl: returnUrl(reg.reference, "cancel"),
    merchantAccountNumber: config.hubtel.merchantAccount,
    clientReference: reg.reference,
  };

  try {
    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(HUBTEL_TIMEOUT_MS),
    });
    const body = await res.json().catch(() => ({}));
    const checkoutUrl = body?.data?.checkoutUrl || body?.data?.checkoutDirectUrl;

    if (!res.ok || !checkoutUrl) {
      return { ok: false, error: body?.message || `Hubtel returned ${res.status}` };
    }
    return { ok: true, checkoutUrl, checkoutId: body?.data?.checkoutId };
  } catch (err) {
    return { ok: false, error: `Could not reach Hubtel: ${err.message}` };
  }
}

// Normalize Hubtel's various status spellings to a boolean "paid".
function isPaid(status) {
  return String(status || "").toLowerCase() === "paid";
}

// Verify a transaction server-side via the Status Check API (POS Sales ID = merchant account).
// Returns { ok, status, data, error, simulated }.
export async function checkPaymentStatus(reference) {
  if (config.fakePayments) {
    return {
      ok: true,
      simulated: true,
      status: "Paid",
      data: {
        clientReference: reference,
        status: "Paid",
        amount: config.priceGhs,
        channel: "test",
        date: new Date().toISOString(),
      },
    };
  }

  if (!hubtelEnabled) {
    return { ok: false, error: "Hubtel is not configured on the server." };
  }

  try {
    const url = `${STATUS_BASE}/${encodeURIComponent(config.hubtel.merchantAccount)}/status?clientReference=${encodeURIComponent(reference)}`;
    const res = await fetch(url, {
      headers: { Authorization: authHeader(), Accept: "application/json" },
      signal: AbortSignal.timeout(HUBTEL_TIMEOUT_MS),
    });
    const body = await res.json().catch(() => ({}));
    const data = body?.data;

    if (!res.ok || !data) {
      return { ok: false, error: body?.message || `Hubtel returned ${res.status}` };
    }

    const paid = isPaid(data.status);
    const amountOk = Number(data.amount) >= config.priceGhs; // guard against tampering
    return {
      ok: paid && amountOk,
      status: data.status,
      amountOk,
      data,
      error: paid
        ? amountOk
          ? null
          : "Amount paid does not match the ticket price."
        : `Transaction status: ${data.status}`,
    };
  } catch (err) {
    return { ok: false, error: `Could not reach Hubtel: ${err.message}` };
  }
}
