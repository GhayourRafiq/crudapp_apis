const User = require('../models/userModel');
const sendEmail = require('../utils/emailsend');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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

    // Set reset token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the updated user
    await user.save();

    // Send the reset password email
    const resetUrl = `http://your-frontend-domain/reset-password/${resetPasswordToken}`;
    const message = `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ success: true, msg: 'Password reset email sent', resetPasswordToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Decode the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, 'your_jwt_secret');
    } catch (err) {
      return res.status(400).json({ success: false, msg: 'Invalid or expired token' });
    }

    // Find the user by the reset token and check if it's expired
    const user = await User.findOne({
      resetPasswordToken: decoded.resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.json({ success: true, msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
