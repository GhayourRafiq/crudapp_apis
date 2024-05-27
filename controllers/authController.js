const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract user data from request body
    const { firstName, lastName, email, password, userType } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with hashed password
    user = new User({ firstName, lastName, email, password: hashedPassword, userType });

    // Save the user to the database
    await user.save();

    res.status(201).json({ success: true, msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract login data from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid Email Please enter valid email' });
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Incorrect Password please enter correct password' });
    }

    // Create a JWT payload with only userId
    const payload = { user: { id: user.id } };

    // Sign and return the JWT
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 });
    res.json({ token, id: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    res.json({ success: true, message: "All user data", users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Controller to delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user is an admin
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Delete the admin
    await User.findByIdAndDelete(id);
    res.json({ success: true, msg: ' deleted Suceesfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


