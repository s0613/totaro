import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER as string;
const smtpPass = process.env.SMTP_PASS as string;
const smtpFrom = (process.env.SMTP_FROM as string) || smtpUser;

if (!smtpUser || !smtpPass) {
  // Intentionally not throwing at import time to allow build; runtime checks below
  console.warn("[Mailer] SMTP_USER/SMTP_PASS is not set. Email sending will fail at runtime.");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for others
  auth: { user: smtpUser, pass: smtpPass },
});

export async function sendMail({ to, subject, html }: { to: string[]; subject: string; html: string }) {
  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP credentials are not configured");
  }
  
  console.log("[Mailer] Attempting to send email", {
    to: to.join(","),
    subject,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpFrom,
  });
  
  try {
    const result = await transporter.sendMail({
      from: smtpFrom,
      to: to.join(","),
      subject,
      html,
    });
    
    console.log("[Mailer] Email sent successfully", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
    });
    
    return result;
  } catch (error) {
    console.error("[Mailer] Email sending failed", {
      error: error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorCode: (error as any)?.code,
    });
    throw error;
  }
}


