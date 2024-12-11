const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET; // Secret key for signing JWTs
const db = new sqlite3.Database('./DB/users.db');

// Login route
router.post('/api/login', (req, res) => {//skal stå/api på droplet
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
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        }),
        {
          httpOnly: true, // Allow JavaScript access to the cookie
          secure: true, // Use false if testing locally without HTTPS
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          path: '/', // Make cookie available across all routes
          sameSite: 'Lax', // Prevent cross-site access
        }
      );
      console.log('User cookie set:', JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }));

      // Setting the JWT token as a cookie
      console.log('Setting JWT cookie'); // Debug before setting the cookie
      res.cookie('jwtToken', token, {
        httpOnly: true, // Prevent JavaScript access for better security
        secure: true, // Use true if deployed over HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
        path: '/', // Make cookie available across all routes
        sameSite: 'Strict', // Ensure token is not sent with cross-site requests
      });
      console.log('JWT cookie set:', token);

      // Debugging the cookie headers
      console.log('Set-Cookie headers:', res.getHeaders()['set-cookie']);

      // Respond with token
      res.status(200).json({ token });
      console.log('Login successful for user:', email); // Log successful login
    } catch (error) {
      console.error('Error during login process:', error.message); // Log unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  });
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
