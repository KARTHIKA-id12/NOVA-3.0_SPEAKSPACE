
import twilio from "twilio";
import path from "path";

// Env vars loaded via node --env-file=.env flag


async function testTwilioSMS() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const toNumber = process.env.TWILIO_TO_NUMBER;

    console.log("----------------------------------------");
    console.log("Twilio SMS Configuration Test");
    console.log("----------------------------------------");
    console.log(`Account SID: ${accountSid ? accountSid.substring(0, 6) + "..." : "MISSING"}`);
    console.log(`Auth Token:  ${authToken ? "PRESENT" : "MISSING"}`);
    console.log(`From Number: ${fromNumber || "MISSING"}`);
    console.log(`To Number:   ${toNumber || "MISSING"}`);
    console.log("----------------------------------------");

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
        console.error("ERROR: Missing required credentials in .env file.");
        return;
    }

    const client = twilio(accountSid, authToken);

    console.log("Attempting to send test SMS...");

    try {
        const message = await client.messages.create({
            body: "Safety Net AI - Test SMS Verification. If you receive this, the integration is working!",
            from: fromNumber,
            to: toNumber
        });

        console.log("SUCCESS: SMS Request Sent!");
        console.log(`Message SID: ${message.sid}`);
        console.log(`Status:      ${message.status}`);
        console.log(`To:          ${message.to}`);
        console.log(`From:        ${message.from}`);

        if (message.errorCode) {
            console.warn(`WARNING: Twilio returned an error code: ${message.errorCode} - ${message.errorMessage}`);
        }

    } catch (error: any) {
        console.error("FAILED to send SMS.");
        console.error("Error Code: " + error.code);
        console.error("Message:    " + error.message);

        if (error.code === 21608) {
            console.error("\n[DIAGNOSIS]: This is a 'Verified Caller ID' error. On a Twilio Trial account, you can ONLY send SMS to verified numbers.");
            console.error("Please go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified and verify the TO number.");
        } else if (error.code === 21211) {
            console.error("\n[DIAGNOSIS]: The 'To' number is invalid. Ensure it includes the country code (e.g., +1 for US, +91 for India).");
        } else if (error.code === 20003) {
            console.error("\n[DIAGNOSIS]: Authentication Error. Check your Account SID and Auth Token.");
        }
    }
}

testTwilioSMS();
