const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  console.log('--- Authenticating Token Middleware ---');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);

  if (!req.cookies || !req.cookies.jwtToken) {
    console.log('No token found in cookies. Redirecting to login.');
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html'); // Redirect to login page
  }

  const token = req.cookies.jwtToken;
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Token verified successfully:', decoded);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html'); // Redirect to login page
  }
}

module.exports = authenticateToken;
