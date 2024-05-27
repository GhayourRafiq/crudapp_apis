const User = require('../models/userModel');
const sendEmail = require('../utils/emailsend');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Controller for requesting a password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = jwt.sign({ resetToken }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send the reset password email
    const resetUrl = `http://your-frontend-domain/reset-password/${resetPasswordToken}`;
    const message = `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ success: true, msg: 'Password reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Controller for resetting the password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, 'your_jwt_secret');
    } catch (err) {
      return res.status(400).json({ success: false, msg: 'Invalid or expired token' });
    }

    // Find the user by the reset token
    const user = await User.findOne({ resetToken: decoded.resetToken });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token
    user.resetToken = undefined;

    // Save the updated user
    await user.save();

    res.json({ success: true, msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
