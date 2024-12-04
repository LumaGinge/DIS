const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    console.log(`One time password sent to ${phoneNumber}`);
    res.status(200).json("One time password sent successfully");
  } catch (error) {
    console.error(`Failed to send OTP: ${error}`);
    res.status(500).json("Failed to send OTP");
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const verification_check = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: otp });
    if (verification_check.status === "approved") {
      res.status(200).json("Two-factor authentication successful");
    } else {
      res.status(400).json("Invalid two-factor authentication code");
    }
  } catch (error) {
    console.error(`Failed attempt to verify One time password: ${error}`);
    res.status(500).json("Failed to verify one time password");
  }
});

module.exports = router;