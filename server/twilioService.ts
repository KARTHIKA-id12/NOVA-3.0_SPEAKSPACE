import twilio from "twilio";
import { getRecipientEmails } from "./emailService";

// Interface for Twilio configuration
interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
    toNumber: string; // For testing/MVP, usually we'd have a user profile service
}

let client: twilio.Twilio | null = null;
let config: TwilioConfig | null = null;

// Mock recipients for SMS - in a real app these would come from the database
const EMERGENCY_CONTACTS = [
    "+1234567890", // Example number
];

export function initializeTwilio(): void {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const toNumber = process.env.TWILIO_TO_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !toNumber ||
        accountSid.includes("your_sid") || authToken.includes("your_token")) {
        console.warn("[TwilioService] Credentials not configured. Twilio will be in MOCK mode (logging to file).");
        return;
    }

    try {
        client = twilio(accountSid, authToken);
        config = { accountSid, authToken, fromNumber, toNumber };
        console.log("[TwilioService] Twilio initialized successfully");
    } catch (error) {
        console.error("[TwilioService] Failed to initialize Twilio:", error);
    }
}

async function logMockCommunication(type: "SMS" | "CALL", message: string): Promise<void> {
    const logContent = `
========================================
[MOCK TWILIO ${type}]
Timestamp: ${new Date().toISOString()}
To: ${process.env.TWILIO_TO_NUMBER || "Not Configured (Defaulting to user contacts)"}
From: ${process.env.TWILIO_FROM_NUMBER || "Mock System"}
Message/Script:
${message}
========================================
`;
    console.log(logContent);

    try {
        const fs = await import("fs");
        const path = await import("path");
        const logDir = path.join(process.cwd(), "logs");

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        fs.appendFileSync(path.join(logDir, "mock_communications.txt"), logContent);
    } catch (err) {
        console.error(`[TwilioService] Failed to log mock ${type}:`, err);
    }
}

export async function sendEmergencySMS(message: string): Promise<boolean> {
    // Truncate message for SMS if needed, though modern gateways handle segmentation
    const smsBody = `[URGENT SAFETY ALERT] ${message}`;

    if (!client || !config) {
        await logMockCommunication("SMS", smsBody);
        return true;
    }

    try {
        await client.messages.create({
            body: smsBody,
            from: config.fromNumber,
            to: config.toNumber
        });
        console.log(`[TwilioService] Emergency SMS sent to ${config.toNumber}`);
        return true;
    } catch (error) {
        console.error("[TwilioService] Failed to send SMS:", error);
        return false;
    }
}

export async function makeEmergencyCall(script: string): Promise<boolean> {
    // Twilio TwiML for the call
    const twiml = `
    <Response>
      <Say voice="alice">This is an emergency alert from Safety Net AI.</Say>
      <Pause length="1"/>
      <Say voice="alice">${script}</Say>
      <Pause length="1"/>
      <Say voice="alice">Please take immediate action.</Say>
    </Response>
  `;

    if (!client || !config) {
        await logMockCommunication("CALL", `[Voice Script]: ${script}`);
        return true;
    }

    try {
        await client.calls.create({
            twiml,
            to: config.toNumber,
            from: config.fromNumber
        });
        console.log(`[TwilioService] Emergency Call initiated to ${config.toNumber}`);
        return true;
    } catch (error) {
        console.error("[TwilioService] Failed to make call:", error);
        return false;
    }
}
