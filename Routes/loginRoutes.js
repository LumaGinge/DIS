const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();


const router = express.Router();
const secretKey = process.env.JWT_SECRET; // secret key fra .env filen som bruges til at signere JWT tokens
const db = new sqlite3.Database('./DB/users.db');

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const verifiedUsers = {}; //bruges til at gemme brugere som har verificeret deres OTP og er klar til at logge ind

router.post('/login', async (req, res) => {
  const { email, password, otpVerified } = req.body;

  if (!otpVerified) {
    // tjekker om email og password er udfyldt hvis brugeren ikke har verificeret sin OTP endnu
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try { // tjekker om email findes i databasen og om passwordet er korrekt
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

      //hvis brugeren findes og passwordet er korrekt, gemmes brugeren i verifiedUsers og sendes videre til OTP verifikation
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
    // når brugeren så har verificeret sin OTP, udstedes en JWT token
    const user = verifiedUsers[email];
    if (!user) {
      return res.status(400).json({ error: 'OTP not verified or session expired.' });
    }

    delete verifiedUsers[email]; // fjerner brugeren fra verifiedUsers efter at JWT er udstedt

    const token = jwt.sign( // udsteder JWT token med brugerens informationer
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET, // signerer med secretKey fra .env filen
      { expiresIn: '1h' }
    );

    res.cookie('jwtToken', token, { // gemmer JWT token i en cookie
      httpOnly: true, // forhindrer JavaScript i at læse cookien
      secure: true, // gør at cookien kun sendes over HTTPS
      sameSite: 'Strict', // forhindrer CSRF angreb, Strict er den mest restriktive værdi
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful.', token });
  }
});

router.post('/logout', (req, res) => {
  console.log('Received logout request'); // logud detected

  res.clearCookie('jwtToken', { // fjerner JWT cookien fra browseren
    path: '/', 
    sameSite: 'Strict',
    httpOnly: true, 
  });
  console.log('Cleared JWT cookie');

  res.status(200).json({ message: 'Logged out successfully' });
  console.log('User logged out successfully');
});

module.exports = router;
