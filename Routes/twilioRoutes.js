const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const bcrypt = require("bcrypt");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);


router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required.' });
  }

  console.log('Sending OTP to:', phoneNumber);

  try {
      const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to: phoneNumber, channel: 'sms' });

      console.log('Twilio verification initiated:', verification);
      res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
      console.error('Error sending OTP:', error.message);
      res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required.' });
  }

  console.log('Verifying OTP for:', phoneNumber);

  try {
      const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: phoneNumber, code: otp });

      if (verificationCheck.status === 'approved') {
          console.log('OTP verified successfully.');
          return res.status(200).json({ message: 'OTP verified successfully.' });
      } else {
          console.log('Invalid OTP:', verificationCheck);
          return res.status(400).json({ error: 'Invalid OTP.' });
      }
  } catch (error) {
      console.error('Error verifying OTP:', error.message);
      res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

module.exports = router;