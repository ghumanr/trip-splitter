const { Resend } = require("resend");

const APP_URL = process.env.CLIENT_URL || "http://localhost:5174";
const FROM_ADDRESS = "TripSplitter <onboarding@resend.dev>";

async function sendTripInviteEmail({ toEmail, toName, tripTitle, destination, addedByName }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY is not set — skipping email to", toEmail);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const destinationLine = destination ? `<p style="margin:0 0 8px">📍 <strong>${destination}</strong></p>` : "";

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: `You've been added to "${tripTitle}" on TripSplitter`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
          <h1 style="font-size:24px;font-weight:900;margin:0 0 8px">Hey ${toName} 👋</h1>
          <p style="margin:0 0 24px;color:#475569">
            <strong>${addedByName}</strong> has added you to a trip on TripSplitter.
          </p>

          <div style="background:#f1f5f9;border-radius:16px;padding:20px 24px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:20px;font-weight:900">${tripTitle}</p>
            ${destinationLine}
            <p style="margin:0;font-size:13px;color:#64748b">
              You can view expenses, track balances, and settle up with the group.
            </p>
          </div>

          <a
            href="${APP_URL}"
            style="display:inline-block;background:#0891b2;color:#fff;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:15px"
          >
            Open TripSplitter →
          </a>

          <p style="margin-top:32px;font-size:12px;color:#94a3b8">
            If you don't have an account yet, create one using this email address and you'll see the trip automatically.
          </p>
        </div>
      `,
    });

    console.log(`[email] Invite sent to ${toEmail} for trip "${tripTitle}"`);
  } catch (error) {
    console.error(`[email] Failed to send invite to ${toEmail}:`, error?.message || error);
  }
}

module.exports = { sendTripInviteEmail };
