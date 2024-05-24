// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image_url: String,
});

module.exports = mongoose.model('Product', productSchema);