const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const authenticateToken = require('../middleware/authenticateToken'); // Import the authentication middleware

const router = express.Router();
const db = new sqlite3.Database('./DB/users.db'); // Path to user database
const secretKey = process.env.JWT_SECRET; // Secret key for JWT

router.get('/user', authenticateToken, (req, res) => {
  // Use `req.user` to return the decoded token data
  res.json({
    user: req.user, // Decoded user data
  });
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      // Step 1: Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 2: Insert user into the database
      const query = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [firstName, lastName, email, phoneNumber, hashedPassword], function (err) {
          if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                  return res.status(400).json({ error: 'Email or phone number already in use' });
              }
              console.error(`Database error: ${err.message}`);
              return res.status(500).json({ error: 'Failed to register user' });
          }

          // Step 3: Generate JWT token
          const user = {
              id: this.lastID,
              firstName,
              lastName,
              email,
              phoneNumber,
          };

          const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

          // Step 4: Set the token as an HttpOnly cookie
          res.cookie('jwtToken', token, {
              httpOnly: true, // Prevent JavaScript access
              secure: process.env.NODE_ENV === 'production', // Use true if HTTPS is enabled
              sameSite: 'Strict', // Prevent CSRF
              maxAge: 60 * 60 * 1000, // 1 hour
          });

          console.log(`User registered with ID: ${user.id}`);
          res.status(201).json({ message: 'Signup successful' });
      });
  } catch (error) {
      console.error(`Error during signup: ${error.message}`);
      res.status(500).json({ error: 'Failed to register user' });
  }
});
module.exports = router;
