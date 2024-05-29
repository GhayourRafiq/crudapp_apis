const { body, validationResult } = require('express-validator');

// Validator for add to cart route
exports.addtocartValidator = [
    body('userId').isString().withMessage('User ID must be a string'),
    body('productId').isString().withMessage('Product ID must be a string'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Validator for remove from cart route
exports.removetocartValidator = [
    body('productId').isString().withMessage('Product ID must be a string'),
    body('userId').isString().withMessage('User ID must be a string')
];

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
