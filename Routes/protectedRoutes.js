const express = require('express');
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/orders', authenticateToken, (req, res) => {
  console.log(req.user ? `Authenticated user: ${req.user.email}` : 'Unauthenticated access');
  res.sendFile(path.join(__dirname, '../public/orders.html'));
});

router.get('/locations', authenticateToken, (req, res) => {
  console.log(req.user ? `Authenticated user: ${req.user.email}` : 'Unauthenticated access');
  res.sendFile(path.join(__dirname, '../public/locations.html'));
});

router.get('/menu', authenticateToken, (req, res) => {
  console.log(req.user ? `Authenticated user: ${req.user.email}` : 'Unauthenticated access');
  res.sendFile(path.join(__dirname, '../public/menu.html'));
});

router.get('/newsletter', authenticateToken, (req, res) => {
  console.log(req.user ? `Authenticated user: ${req.user.email}` : 'Unauthenticated access');
  res.sendFile(path.join(__dirname, '../public/newsletter.html'));
});

router.get('/profile', authenticateToken, (req, res) => { 
  console.log(req.user ? `Authenticated user: ${req.user.email}` : 'Unauthenticated access');
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

module.exports = router;
