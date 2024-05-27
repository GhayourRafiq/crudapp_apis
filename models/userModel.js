const mongoose = require('mongoose');

// Define the User schema with necessary fields and data types
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,  // Ensure email is unique
    lowercase: true // Store email in lowercase
  },
  password: String,
  userType: {
    type: String,
    enum: ['user', 'admin'],  // Restrict userType to 'user' or 'admin'
    default: 'user'  // Default userType is 'user'
  }
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
