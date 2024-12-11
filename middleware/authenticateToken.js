const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  console.log('--- Authenticating Token Middleware ---');
  console.log('Headers:', req.headers);

  // Check for JWT in Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader
    ? authHeader.split(' ')[1] // Extract token from Authorization header
    : req.cookies?.jwtToken; // Fallback to cookies

  if (!token) {
    console.log('No token found. Redirecting to signup.');
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html'); // Redirect to login page
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify the JWT
    console.log('Token verified successfully:', decoded);
    req.user = decoded; // Attach decoded user info to the request
    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    res.clearCookie('jwtToken', { path: '/' });
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html'); // Redirect to login page
  }
}

module.exports = authenticateToken;
