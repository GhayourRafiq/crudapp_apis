// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoute');
const userroutes = require('./routes/userRouts');
const resetPassword = require('./routes/resetpasswordroute');
dotenv.config();

const app = express();

// Use express.json() to parse JSON bodies into JS objects
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});

// Use product routes
app.use('/api', productRoutes);
app.use('/api/auth', userroutes);
app.use('/api/resetpassword', resetPassword);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
