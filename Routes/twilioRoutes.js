//IKKE IMPLEMENTERET I FRONT END - VIRKER I POSTMAN
const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

// Twilio API nøgler
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
// Twilio client
const client = twilio(accountSid, authToken);

// Route til at sende OTP
router.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        console.log(`OTP sent to ${phoneNumber}`);
        res.status(200).send("OTP sent successfully");
    } catch (error) {
        console.error(`Failed to send OTP: ${error}`);
        res.status(500).send("Failed to send OTP");
    }
});

// Route til at verificere OTP
router.post("/verify-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const verification_check = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phoneNumber, code: otp });
        if (verification_check.status === "approved") {
            res.status(200).send("OTP verified successfully");
        } else {
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.error(`Failed to verify OTP: ${error}`);
        res.status(500).send("Failed to verify OTP");
    }
});
module.exports = router;

