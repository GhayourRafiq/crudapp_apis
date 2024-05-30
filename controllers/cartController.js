const User = require('../models/userModel');
const Product = require('../models/productModels');
const Cart = require('../models/cartModels');

const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const productIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (productIndex > -1) {
            // Product exists in the cart, update quantity and total price
            cart.items[productIndex].quantity += quantity;
            cart.items[productIndex].totalPrice = cart.items[productIndex].quantity * product.price;
        } else {
            // Product does not exist in the cart, add new product
            cart.items.push({
                productId,
                quantity,
                totalPrice: quantity * product.price
            });
        }

        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const decreaseQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (productIndex > -1) {
            // Product exists in the cart, decrease quantity
            cart.items[productIndex].quantity -= quantity;
            if (cart.items[productIndex].quantity <= 0) {
                // Remove the item from the cart if quantity is zero or less
                cart.items.splice(productIndex, 1);
            } else {
                // Update the total price if the item is still in the cart
                cart.items[productIndex].totalPrice = cart.items[productIndex].quantity * product.price;
            }
        } else {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        await cart.save();

        res.status(200).json({ message: 'Product quantity decreased in cart', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => !item.productId.equals(productId));

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserCart = async (req, res) => {
    const { userId } = req.params; // Correctly retrieve userId from req.params
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json({ cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { addToCart, removeFromCart, getUserCart , decreaseQuantity};
