const { check } = require('express-validator');

// Validator for signup route
exports.signupValidator = [
  check('firstName').notEmpty().withMessage('First name is required'),  // Check that firstName is not empty
  check('email').isEmail().withMessage('Valid email is required'),  // Check that email is a valid email address
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long')  // Check that password is at least 6 characters long
];

// Validator for login route
exports.loginValidator = [
  check('email').isEmail().withMessage('Valid email is required'),  // Check that email is a valid email address
  check('password').notEmpty().withMessage('Password is required')  // Check that password is not empty
];
