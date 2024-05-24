
// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidationRules } = require('../validators/productValidator');

router.post('/product', productValidationRules(), productController.createProduct);
router.get('/products', productController.getProducts);
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;

