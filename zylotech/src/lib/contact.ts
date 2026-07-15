// Contact details assembled at RUNTIME so the raw business number never appears as a
// plain, harvestable string in the built HTML/JS. The number is stored obfuscated as
// base64-of-reversed and decoded in the browser. Automated scrapers/spam harvesters that
// grep the static output for phone patterns won't find it (they don't run this decode).
//
// To keep the number out of the source entirely, set VITE_CONTACT_PHONE (your plain local
// number) in a git-ignored .env — it overrides the embedded token below.

// base64 of the reversed local number; decoded in-browser only.
const ENC = "NTIwNjI0NTQyMA==";

function deob(enc: string): string {
  try {
    return atob(enc).split("").reverse().join("");
  } catch {
    return "";
  }
}

function localNumber(): string {
  const override = (import.meta as { env?: Record<string, string> }).env?.VITE_CONTACT_PHONE;
  return (override && override.trim()) || deob(ENC);
}

/** Ghana international format without the plus, e.g. "233245426025". */
export function phoneIntl(): string {
  const n = localNumber();
  return n ? "233" + n.slice(1) : "";
}

/** Pretty local display, e.g. "024 542 6025". */
export function phoneDisplay(): string {
  return localNumber().replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}

/** WhatsApp deep link, optionally pre-filled with a message. */
export function whatsappUrl(text?: string): string {
  const base = "https://wa.me/" + phoneIntl();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Dialable tel: link. */
export function telUrl(): string {
  return "tel:+" + phoneIntl();
}
