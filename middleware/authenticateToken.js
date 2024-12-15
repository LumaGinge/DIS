const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // secret key fra .env filen som bruges til at signere JWT tokens

function authenticateToken(req, res, next) { //middleware til at tjekke om brugeren har en gyldig JWT token
  console.log('--- Authenticating Token Middleware ---');
  console.log('Headers:', req.headers);


  const authHeader = req.headers.authorization; //henter authorization header fra request
  const token = authHeader
    ? authHeader.split(' ')[1] // henter token fra headeren
    : req.cookies?.jwtToken; //hvis der ikke er en authorization header, henter den token fra cookien

  if (!token) {
    console.log('No token found. Redirecting to signup.');
    res.clearCookie('jwtToken', { path: '/' });// fjerner cookien hvis der ikke er en token
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html'); // hvis der ikke er en token, sendes brugeren til signup siden
  }

  try {
    const decoded = jwt.verify(token, secretKey); // tjekker om token er gyldig
    console.log('Token verified successfully:', decoded);
    req.user = decoded; // gemmer brugeren i request objektet
    next(); // sender brugeren videre til næste middleware eller route
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    res.clearCookie('jwtToken', { path: '/' }); // fjerner cookien hvis token er ugyldig eller udløbet
    res.clearCookie('user', { path: '/' });
    return res.redirect('/static/signup.html');
  }
}

module.exports = authenticateToken;
