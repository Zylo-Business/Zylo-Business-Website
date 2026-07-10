import { Resend } from "resend";
import { config } from "./config.js";

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

function detailRow(label, value, last) {
  const border = last ? "" : "border-bottom:1px solid #EAE6D8;";
  return `<tr>
    <td style="padding:12px 0;${border}font-size:14px;color:#8A806E;">${label}</td>
    <td align="right" style="padding:12px 0;${border}font-size:14px;color:#191915;font-weight:bold;">${value}</td>
  </tr>`;
}

function buildHtml(reg) {
  const w = config.webinar;
  const paid = reg.status === "paid";
  const firstName = escape(reg.name.split(" ")[0]);
  const intro = paid
    ? `Your seat for the <strong style="color:#191915;">${escape(w.title)}</strong> is confirmed and your payment was received.`
    : `Thanks for registering for the <strong style="color:#191915;">${escape(w.title)}</strong>.`;

  const rows =
    detailRow("Date", escape(w.dateLabel)) +
    detailRow("Time", escape(w.timeLabel)) +
    detailRow("Where", escape(w.location), !paid) +
    (paid ? detailRow("Reference", escape(reg.reference), true) : "");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F0EEE6;font-family:Arial,Helvetica,sans-serif;color:#191915;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0EEE6;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr><td align="center" style="padding-bottom:18px;font-size:12px;letter-spacing:3px;font-weight:bold;color:#CC785C;">
            ZYLO&nbsp;TECH&nbsp;SOLUTIONS
          </td></tr>
          <tr><td style="background:#FAF9F5;border:1px solid #DDD8C8;border-radius:16px;padding:34px;">
            <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:27px;line-height:1.2;color:#191915;">
              You're in, ${firstName}! <span style="color:#CC785C;">🎉</span>
            </h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#6E675A;">${intro}</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EAE6D8;margin:0 0 26px;">
              ${rows}
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
              <a href="${escape(w.zoomLink)}"
                 style="display:inline-block;background:#CC785C;color:#ffffff;font-weight:bold;font-size:15px;
                        text-decoration:none;padding:15px 30px;border-radius:10px;">
                Join the Master Class &rarr;
              </a>
            </td></tr></table>

            <p style="margin:24px 0 0;font-size:12px;line-height:1.65;color:#8A806E;">
              Save this email — it has your join link. We'll send a reminder before we go live.
              Questions? Reply to this email or WhatsApp us on ${escape(w.phone)}.
            </p>
          </td></tr>
          <tr><td align="center" style="padding-top:20px;font-size:12px;color:#9A917E;">
            Zylo Tech Solutions &middot; Registered in Ghana
          </td></tr>
        </table>
      </td></tr>
    </table>
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
