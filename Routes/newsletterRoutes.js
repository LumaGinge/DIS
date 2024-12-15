// Routes/newsletterRoutes.js
const express = require('express');
const router = express.Router();
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

// Funktion til at generere en tilfældig coupon-kode der sendes i mailen
function generateCouponCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';
    for (let i = 0; i < length; i++) {
      coupon += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return coupon;
  }

// Connect til SQLite database filen newsletterDB.db
const dbPath = path.join(__dirname, '../DB/newsletterDB.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// function til at sende mailen
const transporter = nodemailer.createTransport({
  service: 'gmail', // Provider der benyttes til at sende mailen
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rute til at tilmelde sig nyhedsbrevet
router.post('/subscribe', (req, res) => {
  const { email } = req.body;

  // Indsæt emailen i subscribers tabellen
  const query = `INSERT INTO subscribers (email) VALUES (?)`;
  db.run(query, [email], (err) => {
    if (err) {
      return res.status(400).json({ message: 'Subscription failed. Email may already be subscribed.' });
    }

    // Kalder funktion til at lave en coupon-kode
const couponCode = generateCouponCode(); 

     // opretter objekt med mail indstillinger og indhold til mailen
     const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: `<p>Welcome to our newsletter! We're excited to have you on board.</p>
               <p>As a token of our appreciation, here's a coupon code for a free juice:</p>
               <h3 style="color: green;">${couponCode}</h3>
               <p>Use this code at any of our locations.</p>
               <p>Thank you for subscribing!</p>`
      };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Subscription successful, but failed to send confirmation email.' });
      }
      res.status(200).json({ message: 'Subscription successful and confirmation email sent!' });
    });
  });
});

module.exports = router;
