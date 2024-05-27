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
      return res.status(400).json({ message:"please fill required fields",errors: errors.array() });
    }

    // Extract user data from request body
    const { firstName, lastName, email, password, userType } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({sucess:false, msg: 'User already exists' });
    }

    // Create a new user
    user = new User({ firstName, lastName, email, password, userType });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a JWT payload
    const payload = { user: { id: user.id, userType: user.userType } };

    // Sign and return the JWT
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 });
    res.status(201).json({ success:true, mesaage:`${user.userType} added successfully`, token });
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
      return res.status(400).json({ success:false , msg: 'Invalid Email Please enter valid email' });
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success:false,  msg: 'Incorrect Password please enter correct password' });
    }

    // Create a JWT payload
    const payload = { user: { id: user.id, userType: user.userType } };

    // Sign and return the JWT
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 });
    res.json({ token });
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
    res.json({success: true , message: "all user data ", users});
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
    if (!user || user.userType !== 'admin') {
      return res.status(404).json({ success:false ,  msg: 'Admin not found' });
    }

    // Delete the admin
    await User.findByIdAndDelete(id);
    res.json({success: true , msg: 'Admin deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


