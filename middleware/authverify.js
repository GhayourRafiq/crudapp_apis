const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if token is in the Bearer format
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format invalid, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded.id;

    // Fetch user from database
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
