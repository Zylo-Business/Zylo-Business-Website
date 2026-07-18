import { config } from "./config.js";

// Pushes registrations into Airtable, which acts as the CRM / source of record.
// Zapier then watches the table and drives Resend (transactional emails).
// If Airtable isn't configured, every call no-ops gracefully so the local flow still works.

const { apiKey, baseId, table } = config.airtable;
export const airtableEnabled = Boolean(apiKey && baseId);

const apiUrl = () =>
  `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;

// Maps our internal registration object to Airtable column names.
// These field names must match the columns in your Airtable table (see README).
function toFields(reg) {
  return {
    Name: reg.name,
    Email: reg.email,
    Phone: reg.phone,
    Status: reg.status === "paid" ? "Paid" : "Registered",
    "Price (GHS)": reg.priceGhs,
    Reference: reg.reference,
    "Registered At": reg.createdAt,
    "Paid At": reg.paidAt || null,
    Channel: reg.channel || null,
    Source: reg.source || "landing-page",
  };
}

async function request(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.error?.type || `Airtable ${res.status}`);
  }
  return data;
}

// Create a record for a new registration. Returns the Airtable record id (or null).
export async function createRegistration(reg) {
  if (!airtableEnabled) return { ok: false, skipped: true };
  try {
    // typecast:true lets Airtable create single-select options (e.g. Status) on the fly.
    const data = await request("POST", apiUrl(), { fields: toFields(reg), typecast: true });
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[airtable] create failed:", err.message);
    return { ok: false, error: err.message };
  }
}

// Update an existing record (e.g. mark Paid after payment verification).
export async function updateRegistration(recordId, reg) {
  if (!airtableEnabled || !recordId) return { ok: false, skipped: true };
  try {
    await request("PATCH", `${apiUrl()}/${recordId}`, { fields: toFields(reg), typecast: true });
    return { ok: true };
  } catch (err) {
    console.error("[airtable] update failed:", err.message);
    return { ok: false, error: err.message };
  }
}
