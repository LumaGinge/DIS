const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const twilio = require('twilio');
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET; // Secret key for signing JWTs
const db = new sqlite3.Database('./DB/users.db');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSms = (to, body) => {
  console.log(`Sending SMS to ${to}: ${body}`); // Debug log for SMS sending
  client.messages
    .create({
      body: body,
      from: fromPhoneNumber,
      to: to,
    })
    .then(message => console.log(`Message sent successfully: ${message.sid}`))
    .catch(error => console.error(`Failed to send message: ${error.message}`));
};

// Login route
router.post('/login', (req, res) => {
  console.log('Received login request with body:', req.body); // Log the request body

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password'); // Debug missing fields
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  console.log('Executing SQL query to find user by email:', email); // Log SQL execution

  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error('Database error:', err.message); // Log database error
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      console.log('User not found for email:', email); // Log user not found
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user); // Log retrieved user data (excluding sensitive info)

    try {
      console.log('Comparing provided password with stored hash'); // Log password comparison start
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password mismatch for user:', email); // Log password mismatch
        return res.status(401).json({ error: 'Invalid password' });
      }

      console.log('Password match. Generating JWT'); // Log successful password match

      const token = jwt.sign(
        { id: user.id, email: user.email, firstName: user.firstName },
        secretKey,
        { expiresIn: '1h' } // Token valid for 1 hour
      );

      console.log('JWT generated:', token); // Log the generated token

      // Setting the user cookie
      console.log('Setting user cookie'); // Debug before setting the cookie
      res.cookie(
        'user',
        JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }),
        {
          httpOnly: false, // Allow JavaScript access to the cookie
          secure: false, // Use false if testing locally without HTTPS
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          path: '/', // Make cookie available across all routes
        }
      );

      // Debugging the cookie header
      console.log('Set-Cookie header:', res.getHeaders()['set-cookie']);

      // Sending SMS notification
      const loginMessage = `Hello ${user.firstName}, you have successfully logged in to your account.`;
      console.log('Preparing to send SMS notification'); // Debug SMS preparation
      sendSms(user.phoneNumber, loginMessage);

      // Respond with token
      res.status(200).json({ token });
      console.log('Login successful for user:', email); // Log successful login
    } catch (error) {
      console.error('Error during login process:', error.message); // Log unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

module.exports = router;
