const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const twilio = require('twilio');
require('dotenv').config();

const db = new sqlite3.Database('./DB/users.db');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSms = (to, body) => {
  client.messages.create({
    body: body,
    from: fromPhoneNumber,
    to: to,
  })
  .then(message => console.log(`Message sent: ${message.sid}`))
  .catch(error => console.error(`Failed to send message: ${error}`));
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      // Compare the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Send SMS to the user's phone number upon successful login
      const loginMessage = `Hello ${user.firstName}, you have successfully logged in to your account.`;
      sendSms(user.phoneNumber, loginMessage);

      // Set cookie with user information
      res.cookie(
        'user',
        JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }), 
        {
          httpOnly: false,
          maxAge: 24 * 60 * 60 * 1000,
          path: '/',
        }
      );

      // Respond with success
      res.json({ success: true });
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = router;

