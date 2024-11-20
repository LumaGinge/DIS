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

    res.json({ success: true, userId: user.id });
  });
});

module.exports = router;
