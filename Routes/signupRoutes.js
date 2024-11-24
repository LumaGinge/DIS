// Routes/signupRoutes.js
const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/users.db'); // Path to user database

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  // Log the request body to debug
  console.log('Request body:', req.body);

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [firstName, lastName, email, phoneNumber, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.json({ error: 'Email already in use' });
        }
        return res.json({ error: 'Error registering user' });
      }
      res.json({ success: true, userId: this.lastID });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
