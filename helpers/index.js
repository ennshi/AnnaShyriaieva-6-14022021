const fs = require('fs');
const path = require('path');

exports.createError = (status, message, errors = { server: message }) => {
  const newErr = new Error(message);
  newErr.statusCode = status;
  newErr.errors = errors;
  return newErr;
};

exports.isLength = (trimmedText, { min = null, max = null }) => {
  const trimmedTextLength = trimmedText.length;
  let isValid = min ? (trimmedTextLength >= min) : true;
  isValid = max ? ((trimmedTextLength < max) && isValid) : isValid;
  return isValid;
};

exports.isValidEmail = (trimmedEmail) => {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(trimmedEmail);
};

exports.isValidPassword = (trimmedPassword) => {
  const regexp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  return regexp.test(trimmedPassword);
};

exports.clearImage = (filePath) => {
  fs.unlink(path.join(__dirname, '..', filePath.replace('http://localhost:3000', '')), (err) => {
    console.log(err);
  });
};
