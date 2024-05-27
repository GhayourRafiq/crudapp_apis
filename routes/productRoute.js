
// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productmiddleware = require('../middleware/authverify');
const { productValidationRules } = require('../validators/productValidator');

router.post('/product',productmiddleware, productValidationRules(), productController.createProduct);
router.get('/products',productmiddleware, productController.getProducts);
router.delete('/product/:id', productmiddleware,productController.deleteProduct);

module.exports = router;

