const jwt = require('jsonwebtoken');

// Signs a JWT containing the user's id, using the app-wide secret and expiry.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
