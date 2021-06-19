const jwt = require('jsonwebtoken');

function decodeToken(authHeader, key) {
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decodedToken;
}

exports.isLoggedIn = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Authorization failed', errors: { auth: 'Authorization failed' } });
  const decodedToken = decodeToken(authHeader, process.env.JWT_KEY);
  if (!decodedToken) return res.status(401).json({ message: 'Authorization failed', errors: { auth: 'Authorization failed' } });
  return next();
};
