// controllers/productController.js
const Product = require('../models/productModels');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, price, image_url } = req.body;
        const product = new Product({ title, description, price, image_url });
        const result = await product.save();
        return res.status(201).json({ success: true, message:"product added succesfully",data: result });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message, message: "Error saving product" });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ success: true, data: products });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Products not found", error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Product.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message:"internal server error", error: err.message });
    }
};
