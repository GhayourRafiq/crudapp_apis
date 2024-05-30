const express = require('express');
const { addToCart, removeFromCart, getUserCart ,decreaseQuantity } = require('../controllers/cartController');
const cartmiddleware = require('../middleware/authverify');
const { addtocartValidator, removetocartValidator, validate } = require('../validators/cartvalidator');

const router = express.Router();

// Add to cart route
router.post('/add',cartmiddleware, addtocartValidator, validate, addToCart);

// Add to cart route
router.post('/decrease',cartmiddleware, addtocartValidator, validate, decreaseQuantity);

// Remove from cart route
router.post('/remove',cartmiddleware, removetocartValidator, validate, removeFromCart);

// Get user cart route
router.get('/cartdata/:userId',cartmiddleware, getUserCart);

module.exports = router;
