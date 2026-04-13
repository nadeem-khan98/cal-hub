import { Resend } from "resend";

// Initialize lazily to avoid errors when RESEND_API_KEY is not set at build time
let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set.");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendContactNotificationEmail({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  // If no API key, silently skip (dev / before setup)
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn("Email not sent: RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not configured.");
    return;
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "CalcHub <noreply@yourdomain.com>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `New Contact Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1e3a5f; margin-bottom: 4px;">📬 New Contact Message</h2>
          <p style="color: #64748b; margin-bottom: 24px; font-size: 14px;">Received via CalcHub contact form</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="color: #1e293b; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/messages" 
               style="display: inline-block; background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              View in Admin Panel →
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    // Don't fail the request if email fails — just log it
    console.error("Failed to send notification email:", err);
  }
}
