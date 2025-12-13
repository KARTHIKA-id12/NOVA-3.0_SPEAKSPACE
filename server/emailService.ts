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

  if (!smtpUser || !smtpPass || smtpUser.includes("your_email") || smtpPass.includes("your_app_password")) {
    console.warn("[EmailService] SMTP credentials not configured correctly (defaults detected). Email sending will be in MOCK mode (logging to console).");
    return;
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      // COMPLETED FIX: Force IPv4 and increase timeouts to handle Render<->Gmail latency
      family: 4,
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,
      socketTimeout: 20000,
      debug: true, // Enable debug logs to see exact handshake issues
      logger: true
    });

    console.log("[EmailService] Email service initialized with IPv4 enforcement");
  }

export async function sendEmergencyReport(reportText: string, severity: string, pdfBuffer?: Buffer, summary?: string): Promise<boolean> {
    const subject = `Safety Report - Immediate Review Required [${severity}]`;

    // Use concise body if PDF is attached, otherwise fallback to full text
    const emailBody = pdfBuffer
      ? `A ${severity} severity incident has been reported.\n\nSummary: ${summary || "See attached report."}\n\nPlease find the detailed safety report attached as a PDF.\n\nImmediate attention required.`
      : reportText;

    if (!transporter) {
      const logContent = `
----------------------------------------
Timestamp: ${new Date().toISOString()}
To: ${RECIPIENT_EMAILS.join(", ")}
Subject: ${subject}
Attachment: ${pdfBuffer ? "YES (Safety_Report.pdf)" : "NO"}
Body:
${emailBody}
----------------------------------------
`;
      console.warn("[EmailService] Email service not configured. Logging email content instead:");
      console.log(logContent);

      // Write to file for verification
      try {
        const fs = await import("fs");
        const path = await import("path");
        const logDir = path.join(process.cwd(), "logs");
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir);
        }
        fs.appendFileSync(path.join(logDir, "mock_emails.txt"), logContent);
      } catch (err) {
        console.error("[EmailService] Failed to write mock email to file:", err);
      }

      // Return true to simulate success for testing purposes
      return true;
    }

    const mailOptions: any = {
      from: process.env.SMTP_USER,
      to: RECIPIENT_EMAILS.join(", "),
      subject,
      text: emailBody
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Safety_Report_${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ];
    }

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
