// validators/productValidation.js
const { body } = require('express-validator');

const productValidationRules = () => {
    return [
        body('title').isString().withMessage('Title is required and should be a string'),
        body('description').isString().withMessage('Description is required and should be a string'),
        body('price').isNumeric().withMessage('Price is required and should be a number'),
        body('image_url').isURL().withMessage('Image URL is required and should be a valid URL')
    ];
};

module.exports = {
    productValidationRules
};
