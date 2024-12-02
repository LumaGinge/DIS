const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const router = express.Router();
const db = new sqlite3.Database('./DB/users.db'); // Path to user database
const secretKey = process.env.JWT_SECRET; // Secret key for JWT

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  // Log the request body to debug
  console.log('Request body:', req.body);

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [firstName, lastName, email, phoneNumber, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: 'Email already in use' });
        }
        console.error('Error inserting user into database:', err.message);
        return res.status(500).json({ error: 'Error registering user' });
      }

      console.log('User inserted with ID:', this.lastID); // Log user ID for debugging

      // Generate JWT
      const token = jwt.sign(
        {
          id: this.lastID,
          email,
          firstName,
        },
        secretKey,
        { expiresIn: '1h' } // Token valid for 1 hour
      );

      console.log('JWT generated:', token); // Log the generated token

      // Respond with success message and token
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
