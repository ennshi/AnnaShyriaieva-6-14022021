const { isValidEmail, isValidPassword } = require('../helpers');

const isValidUser = (req, _, next) => {
  const errors = {};
  const { email, password } = req.body;
  if (!isValidEmail(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }
  if (password && !isValidPassword(password.trim())) {
    errors.password = 'Password must be between 7 to 15 characters and contain at least one numeric digit and a special character(!@#$%^&*)';
  }
  req.errors = errors;
  next();
};

module.exports = isValidUser;
