const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();


const router = express.Router();
const secretKey = process.env.JWT_SECRET; // Secret key for signing JWTs
const db = new sqlite3.Database('./DB/users.db');

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const verifiedUsers = {}; // Temporary in-memory store for OTP-verified users

router.post('/login', async (req, res) => {
  const { email, password, otpVerified } = req.body;

  if (!otpVerified) {
    // Step 1: Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const user = await new Promise((resolve, reject) =>
        db.get(query, [email], (err, row) => (err ? reject(err) : resolve(row)))
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      // Store user details temporarily for OTP verification
      verifiedUsers[email] = {
        phoneNumber: user.phoneNumber,
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      res.status(200).json({
        message: 'Password verified. Please verify OTP.',
        phoneNumber: user.phoneNumber,
      });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    // Step 2: Issue JWT after OTP verification
    const user = verifiedUsers[email];
    if (!user) {
      return res.status(400).json({ error: 'OTP not verified or session expired.' });
    }

    delete verifiedUsers[email]; // Clear session after issuing JWT

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful.', token });
  }
});

router.post('/logout', (req, res) => {
  console.log('Received logout request'); // Debug log for logout
  res.clearCookie('user', {
    path: '/', // Clear the cookie for all paths
    sameSite: 'Lax',
  });
  console.log('Cleared user cookie'); // Log user cookie clearance

  res.clearCookie('jwtToken', {
    path: '/', // Clear the cookie for all paths
    sameSite: 'Strict',
    httpOnly: true, // Matches the initial cookie settings
  });
  console.log('Cleared JWT cookie'); // Log JWT cookie clearance

  res.status(200).json({ message: 'Logged out successfully' });
  console.log('User logged out successfully'); // Log successful logout
});

module.exports = router;
