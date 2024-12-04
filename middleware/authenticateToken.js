const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  console.log('--- Authenticating Token Middleware ---');
  console.log('Headers:', req.headers); // Log headers
  console.log('Cookies:', req.cookies); // Log cookies

  if (!req.cookies || !req.cookies.jwtToken) {
    console.log('No token found in cookies.');
    req.user = null;
    return res.status(401).json({ error: 'Unauthenticated access' }); // Return error for missing token
  }

  const token = req.cookies.jwtToken;
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Token verified successfully:', decoded);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    req.user = null;
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}

module.exports = authenticateToken;
