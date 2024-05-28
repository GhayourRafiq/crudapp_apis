const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authmiddleware = require('../middleware/authverify');
const { signupValidator, loginValidator } = require('../validators/userValidator');

// Route for user signup
router.post('/signup', signupValidator, authController.signup);

// Route for user login
router.post('/login', loginValidator, authController.login);

// Route to get all users
router.get('/users',authmiddleware ,authController.getCurrentUser);

// Route to delete an admin by ID
router.delete('/admin/:id',authmiddleware , authController.deleteAdmin);

module.exports = router;
