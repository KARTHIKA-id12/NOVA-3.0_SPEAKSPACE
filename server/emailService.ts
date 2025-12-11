import nodemailer from "nodemailer";

const RECIPIENT_EMAILS = [
  "kenn62612@gmail.com",
  "bharathimuthusamy2023@gmail.com",
  "karthivv929@gmail.com",
  "vink90926@gmail.com",
  "vincentkennyken123@gmail.com"
];

interface EmailConfig {
  smtpUser: string;
  smtpPass: string;
}

let transporter: nodemailer.Transporter | null = null;

export function initializeEmailService(): void {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpUser || !smtpPass) {
    console.warn("[EmailService] SMTP credentials not configured. Email sending will be disabled.");
    return;
  }
  
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  
  console.log("[EmailService] Email service initialized successfully");
}

export async function sendEmergencyReport(reportText: string, severity: string): Promise<boolean> {
  if (!transporter) {
    console.warn("[EmailService] Email service not configured. Skipping email send.");
    return false;
  }
  
  const subject = `Safety Report - Immediate Review Required [${severity}]`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: RECIPIENT_EMAILS.join(", "),
    subject,
    text: reportText
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Emergency report sent to ${RECIPIENT_EMAILS.length} recipients`);
    return true;
  } catch (error) {
    console.error("[EmailService] Failed to send email:", error);
    return false;
  }
}

export function getRecipientEmails(): string[] {
  return [...RECIPIENT_EMAILS];
}
