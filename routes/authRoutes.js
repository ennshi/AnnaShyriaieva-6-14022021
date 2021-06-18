const express = require('express');
const { signUp, logIn } = require('../controllers/authController');
const isValidUser = require('../middlewares/validation');

const router = express.Router();

router.post('/signup', isValidUser, signUp);
router.post('/login', logIn);

module.exports = router;
