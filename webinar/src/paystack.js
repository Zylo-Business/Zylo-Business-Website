import { config } from "./config.js";

// Verify a transaction with Paystack using the SECRET key (server-side only).
// Returns { ok, status, data, error }.
export async function verifyTransaction(reference) {
  // Local testing shortcut — pretend the payment succeeded without calling Paystack.
  if (config.fakePayments) {
    return {
      ok: true,
      simulated: true,
      data: {
        reference,
        status: "success",
        amount: config.amountMinor,
        currency: config.currency,
        channel: "test",
        paid_at: new Date().toISOString(),
      },
    };
  }

  if (!config.paystackSecretKey) {
    return { ok: false, error: "PAYSTACK_SECRET_KEY is not configured on the server." };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const body = await res.json();

    if (!res.ok || !body.status) {
      return { ok: false, error: body.message || `Paystack returned ${res.status}` };
    }

    const data = body.data;
    const success = data?.status === "success";
    const amountOk = Number(data?.amount) >= config.amountMinor; // guard against tampering
    return {
      ok: success && amountOk,
      status: data?.status,
      amountOk,
      data,
      error: success
        ? amountOk
          ? null
          : "Amount paid does not match the ticket price."
        : `Transaction status: ${data?.status}`,
    };
  } catch (err) {
    return { ok: false, error: `Could not reach Paystack: ${err.message}` };
  }
}
