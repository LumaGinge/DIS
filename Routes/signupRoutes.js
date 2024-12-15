const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();
const db = new sqlite3.Database('./DB/users.db');
const secretKey = process.env.JWT_SECRET;

router.get('/user', authenticateToken, (req, res) => { //Denne router bruges til at hente brugerens informationer fra JWT token og returnere dem som JSON
  res.json({
    user: req.user,
  });
});

router.post('/signup', async (req, res) => { //Denne router bruges til at oprette en ny bruger i databasen
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      //Først hasher vi passwordet
      const hashedPassword = await bcrypt.hash(password, 10);

      // derefter indsætter vi brugeren i databasen
      const query = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [firstName, lastName, email, phoneNumber, hashedPassword], function (err) {
          if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                  return res.status(400).json({ error: 'Email or phone number already in use' });
              }
              console.error(`Database error: ${err.message}`);
              return res.status(500).json({ error: 'Failed to register user' });
          }

          // så laves der et JWT token
          const user = {
              id: this.lastID,
              firstName,
              lastName,
              email,
              phoneNumber,
          };

          const token = jwt.sign(user, secretKey, { expiresIn: '1h' }); // den signeres med secretKey og udløber efter 1 time

          // JWT gemmes i en cookie
          res.cookie('jwtToken', token, {
              httpOnly: true, // stopper JavaScript fra at læse cookien
              secure: true, // gør at cookien kun sendes over HTTPS
              sameSite: 'Strict', //forebygger CSRF angreb
              maxAge: 60 * 60 * 1000, // varer i 1 time 
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
