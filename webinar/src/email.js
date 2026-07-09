import { Resend } from "resend";
import { config } from "./config.js";

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

function buildHtml(reg) {
  const w = config.webinar;
  const paid = reg.status === "paid";
  return `<!doctype html>
<html>
  <body style="margin:0;background:#0a1533;font-family:Segoe UI,Arial,sans-serif;color:#e8edff;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="text-align:center;margin-bottom:8px;font-weight:800;letter-spacing:2px;color:#F5B301;">
        ZYLO&nbsp;TECH&nbsp;SOLUTIONS
      </div>
      <div style="background:#0f1f4d;border:1px solid #24356f;border-radius:16px;padding:28px;">
        <h1 style="margin:0 0 6px;font-size:22px;color:#ffffff;">You're in, ${escape(reg.name.split(" ")[0])}! 🎉</h1>
        <p style="margin:0 0 18px;color:#aab6e6;font-size:15px;line-height:1.6;">
          ${paid
            ? "Your seat for the <strong style='color:#fff'>" + escape(w.title) + "</strong> is confirmed and your payment was received."
            : "Thanks for registering for the <strong style='color:#fff'>" + escape(w.title) + "</strong>."}
        </p>

        <table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px;">
          <tr><td style="padding:8px 0;color:#8ea0dd;">📅 Date</td><td style="padding:8px 0;text-align:right;color:#fff;">${escape(w.dateLabel)}</td></tr>
          <tr><td style="padding:8px 0;color:#8ea0dd;">⏰ Time</td><td style="padding:8px 0;text-align:right;color:#fff;">${escape(w.timeLabel)}</td></tr>
          <tr><td style="padding:8px 0;color:#8ea0dd;">📍 Where</td><td style="padding:8px 0;text-align:right;color:#fff;">${escape(w.location)}</td></tr>
          ${paid ? `<tr><td style="padding:8px 0;color:#8ea0dd;">🧾 Reference</td><td style="padding:8px 0;text-align:right;color:#fff;">${escape(reg.reference)}</td></tr>` : ""}
        </table>

        <a href="${escape(w.zoomLink)}"
           style="display:block;text-align:center;background:#F5B301;color:#0a1533;font-weight:800;
                  padding:14px;border-radius:10px;text-decoration:none;font-size:15px;">
          Join the Master Class →
        </a>
        <p style="margin:14px 0 0;color:#8ea0dd;font-size:12px;line-height:1.6;">
          Save this email — it contains your join link. We'll also send a reminder before we go live.
          Questions? Reply to this email or WhatsApp us on ${escape(w.phone)}.
        </p>
      </div>
      <p style="text-align:center;color:#5b6aa0;font-size:12px;margin-top:20px;">
        Zylo Tech Solutions · Registered in Ghana
      </p>
    </div>
  </body>
</html>`;
}

// Exported for previewing/testing the template without sending a real email.
export { buildHtml as buildThankYouHtml };

function escape(s = "") {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// Sends the thank-you / confirmation email. If Resend isn't configured, it logs the
// email so the flow still completes during development, and returns { sent: false }.
export async function sendThankYou(reg) {
  const subject = `You're registered — ${config.webinar.title}`;
  if (!resend) {
    console.log(`[email] (skipped, RESEND_API_KEY not set) → would email ${reg.email}: "${subject}"`);
    return { sent: false, reason: "resend_not_configured" };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to: reg.email,
      replyTo: config.replyToEmail,
      subject,
      html: buildHtml(reg),
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return { sent: false, reason: error.message || "resend_error" };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { sent: false, reason: err.message };
  }
}
