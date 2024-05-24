
// controllers/productController.js
const Product = require('../models/productModels');
const { body, validationResult } = require('express-validator');

exports.createProduct = [
    body('title').isString().withMessage('Title is required and should be a string'),
    body('description').isString().withMessage('Description is required and should be a string'),
    body('price').isNumeric().withMessage('Price is required and should be a number'),
    body('image_url').isURL().withMessage('Image URL is required and should be a valid URL'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = new Product(req.body);
        product.save()
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json({ error: err.message }));
    }
];

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
};