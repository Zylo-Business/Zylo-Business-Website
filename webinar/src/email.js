import { Resend } from "resend";
import { config } from "./config.js";

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

function escape(s = "") {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function detailRow(label, value, last) {
  const border = last ? "" : "border-bottom:1px solid #EAE6D8;";
  return `<tr>
    <td style="padding:12px 0;${border}font-size:14px;color:#8A806E;">${label}</td>
    <td align="right" style="padding:12px 0;${border}font-size:14px;color:#191915;font-weight:bold;">${value}</td>
  </tr>`;
}

function detailsTable(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EAE6D8;margin:0 0 26px;">${rows}</table>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:27px;line-height:1.2;color:#191915;">${text}</h1>`;
}

function joinButton(url) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="${escape(url)}" style="display:inline-block;background:#CC785C;color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none;padding:15px 30px;border-radius:10px;">Join the Master Class &rarr;</a>
    </td></tr></table>`;
}

// Shared branded shell — ivory canvas, brand wordmark, white card, footer.
// `cardInner` is the HTML that goes inside the white card.
function emailShell(cardInner) {
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
            ${cardInner}
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

// ---- Confirmation / thank-you email (sent on registration/payment) ----
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

  return emailShell(
    heading(`You're in, ${firstName}! <span style="color:#CC785C;">🎉</span>`) +
      `<p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#6E675A;">${intro}</p>` +
      detailsTable(rows) +
      joinButton(w.zoomLink) +
      `<p style="margin:24px 0 0;font-size:12px;line-height:1.65;color:#8A806E;">Save this email — it has your join link. We'll send a reminder before we go live. Questions? Reply to this email or WhatsApp us on ${escape(w.phone)}.</p>`
  );
}

// ---- Reminder email (sent ~24 hours before the class) ----
function buildReminderHtml(reg) {
  const w = config.webinar;
  const firstName = escape(reg.name.split(" ")[0]);
  const rows =
    detailRow("Date", escape(w.dateLabel)) +
    detailRow("Time", escape(w.timeLabel)) +
    detailRow("Where", escape(w.location), true);

  return emailShell(
    `<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#CC785C;font-weight:bold;margin:0 0 10px;">&#9200; Starting soon</div>` +
      heading(`Almost time, ${firstName}!`) +
      `<p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#6E675A;">This is your reminder that the <strong style="color:#191915;">${escape(w.title)}</strong> begins in about 24 hours. Add it to your calendar and join a few minutes early.</p>` +
      detailsTable(rows) +
      joinButton(w.zoomLink) +
      `<p style="margin:24px 0 0;font-size:12px;line-height:1.65;color:#8A806E;">See you there! Questions? Reply to this email or WhatsApp us on ${escape(w.phone)}.</p>`
  );
}

// Exported for previewing/testing the templates without sending a real email.
export { buildHtml as buildThankYouHtml, buildReminderHtml };

// Generic sender with a no-config fallback that logs instead of throwing.
async function sendEmail(reg, subject, html) {
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
      html,
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

export function sendThankYou(reg) {
  return sendEmail(reg, `You're registered — ${config.webinar.title}`, buildHtml(reg));
}

export function sendReminder(reg) {
  return sendEmail(reg, `Starts tomorrow — ${config.webinar.title}`, buildReminderHtml(reg));
}
