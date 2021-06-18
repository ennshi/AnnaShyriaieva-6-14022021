/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createError } = require('../helpers');
const User = require('../models/User');

exports.signUp = (req, res, next) => {
  if (Object.keys(req.errors).length) throw createError(422, 'Validation failed', req.errors);

  const { email, password } = req.body;
  return User.findOne({ email })
    .then((userInDB) => {
      if (userInDB) throw createError(422, 'Validation failed', { email: 'Email address already exists' });
      return bcrypt.hash(password.trim(), 12);
    })
    .then((hashedPass) => {
      const user = new User({
        email,
        password: hashedPass,
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: 'User is successfully created' });
    })
    .catch((err) => {
      next(err);
    });
};

exports.logIn = (req, res, next) => {
  const { email, password } = req.body;
  let currentUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: {
            auth: "Email isn't registered or password is incorrect",
          },
        });
      }
      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        return res.status(404).json({
          errors: {
            auth: "Email isn't registered or password is incorrect",
          },
        });
      }
      const key = process.env.JWT_KEY;
      const token = jwt.sign({
        userId: currentUser._id.toString(),
        email: currentUser.email,
      },
      key,
      { expiresIn: '1h' });
      return res.status(200).json({ token, userId: currentUser._id });
    })
    .catch((err) => {
      next(err);
    });
};
