const orderModel = require('../models/order.model');
const axios = require('axios');

async function createOrder(req, res) {
    try {
        const user = req.user;

        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // Fetch the user's cart from Cart Service
        const cartResponse = await axios.get('http://localhost:3002/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(cartResponse.data);

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: cartResponse.data
        });

    } catch (error) {
        console.error('Error creating order:', error.message);

        return res.status(500).json({
            message: 'Failed to create order'
        });
    }
}

module.exports = {
    createOrder
};