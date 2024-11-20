const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/users.db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.cookie(
      'user',
      JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }), // Serialize the object to a JSON string
      {
        httpOnly: false, // Ensure the cookie is accessible by JavaScript
        maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
        path: '/', // Ensure the cookie is available across all routes
      }
    );

    // Respond with success
    res.json({ success: true });
  });
});

module.exports = router;
