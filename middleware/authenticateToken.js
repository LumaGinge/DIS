const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.cookies?.jwtToken;

  if (!token) {
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });

    if (req.originalUrl.startsWith('/api')) {
      // Send JSON error for API routes
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.redirect('/static/signup.html');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });

    if (req.originalUrl.startsWith('/api')) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    return res.redirect('/static/signup.html');
  }
}

module.exports = authenticateToken;
