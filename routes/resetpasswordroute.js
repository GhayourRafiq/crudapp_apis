const express = require('express');
const { check } = require('express-validator');
const { requestPasswordReset, resetPassword } = require('../controllers/resetpassword');

const router = express.Router();

router.post('/request-password-reset', [
  check('email', 'Please include a valid email').isEmail(),
], requestPasswordReset);

router.post('/reset-password/:token', [
  check('password', 'Password is required').isLength({ min: 6 }),
], resetPassword);

module.exports = router;
