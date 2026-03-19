import nodemailer from "nodemailer";
import { CLIENT } from "@/config/client";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Gmail App Password (not account password)
  },
});

export async function sendBookingNotification(opts: {
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  roomId: string;
}) {
  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;
  if (!notifyEmail || !process.env.EMAIL_USER) {
    console.log("[Email] No EMAIL_USER set — skipping email. Booking details:", opts);
    return;
  }

  const callUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/call/${opts.roomId}`;
  const dateFormatted = new Date(`${opts.date}T${opts.time}`).toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // Notify Tisha
  await transporter.sendMail({
    from: `"${CLIENT.brandName}" <${process.env.EMAIL_USER}>`,
    to: notifyEmail,
    subject: `📅 New Consultation — ${opts.clientName} on ${opts.date}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;color:#111">
        <h2 style="color:#8B1930">New Virtual Consultation Booked</h2>
        <p><strong>Client:</strong> ${opts.clientName} (${opts.clientEmail})</p>
        <p><strong>Date & Time:</strong> ${dateFormatted}</p>
        <p><strong>Duration:</strong> 30 minutes</p>
        <hr style="border-color:#eee"/>
        <p>Join the call when your client arrives:</p>
        <a href="${callUrl}" style="display:inline-block;background:#8B1930;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px">
          Join Video Call →
        </a>
        <p style="color:#999;font-size:12px;margin-top:16px">Call link: ${callUrl}</p>
      </div>
    `,
  });

  // Confirm to client
  await transporter.sendMail({
    from: `"${CLIENT.brandName}" <${process.env.EMAIL_USER}>`,
    to: opts.clientEmail,
    subject: `Your consultation with ${CLIENT.artistName} is confirmed ✨`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;color:#111">
        <h2 style="color:#8B1930">Your Consultation is Confirmed!</h2>
        <p>Hi ${opts.clientName},</p>
        <p>Your 30-minute virtual nail consultation with ${CLIENT.artistName} is booked for:</p>
        <p style="font-size:18px;font-weight:bold">${dateFormatted}</p>
        <hr style="border-color:#eee"/>
        <p>At the time of your appointment, click the link below to join the video call:</p>
        <a href="${callUrl}" style="display:inline-block;background:#8B1930;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-size:14px">
          Join Your Consultation →
        </a>
        <p style="color:#999;font-size:12px;margin-top:16px">
          Please save this link — you'll need it to join your call.<br/>
          ${callUrl}
        </p>
        <p style="margin-top:24px">See you soon! 💅<br/><em>${CLIENT.artistName}</em></p>
      </div>
    `,
  });
}
