const orderModel = require('../models/order.model');
const axios = require('axios');

async function createOrder(req, res) {
    try {
        const user = req.user;
        const { shippingAddress } = req.body;

        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cartResponse = await axios.get('http://localhost:3002/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const cartItems = cartResponse.data.cart?.items;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const products = await Promise.all(
            cartItems.map(async (item) => {
                const productResponse = await axios.get(
                    `http://localhost:3001/api/products/${item.productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    product: productResponse.data.product || productResponse.data
                };
            })
        );

        const orderItems = products.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: {
                amount: item.product.price.amount,
                currency: item.product.price.currency || "INR"
            }
        }));

        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + item.price.amount * item.quantity;
        }, 0);

        const order = await orderModel.create({
            user: user.id,
            items: orderItems,
            totalPrice: {
                amount: totalAmount,
                currency: "INR"
            },
            shippingAddress,
            status: "pending"
        });

        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);

        return res.status(500).json({
            message: 'Failed to create order',
            error: error.response?.data || error.message
        });
    }
}


async function getMyOrders(req, res) {
    try {
        const userId = req.user.id;

        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];

        const orders = await orderModel.find({ user: userId });

        const ordersWithProducts = await Promise.all(
            orders.map(async (order) => {
                const updatedItems = await Promise.all(
                    order.items.map(async (item) => {
                        try {
                            const productResponse = await axios.get(
                                `http://localhost:3001/api/products/${item.product}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            return {
                                ...item.toObject(),
                                product: productResponse.data.product || productResponse.data
                            };
                        } catch (error) {
                            return {
                                ...item.toObject(),
                                product: null
                            };
                        }
                    })
                );

                return {
                    ...order.toObject(),
                    items: updatedItems
                };
            })
        );

        return res.status(200).json({
            orders: ordersWithProducts
        });
    } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);

        return res.status(500).json({
            message: "Failed to fetch orders",
            error: error.response?.data || error.message
        });
    }
}

async function getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        if (order.user.toString() !== req.user.id && !["seller", "admin"].includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: You don't have access to this order"
            });
        }
        const updatedItems = await Promise.all(
            order.items.map(async (item) => {
                try {
                    const productResponse = await axios.get(
                        `http://localhost:3001/api/products/${item.product}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    return {
                        ...item.toObject(),
                        product: productResponse.data.product || productResponse.data
                    };
                }
                catch (error) {
                    return {
                        ...item.toObject(),
                        product: null
                    };
                }
            })
        );
        return res.status(200).json({
            order: {
                ...order.toObject(),
                items: updatedItems
            }
        });
    }
    catch (error) {
        console.error("Error fetching order:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to fetch order",
            error: error.response?.data || error.message
        });
    }
}

async function cancelOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden: You don't have access to this order"
            });
        }
        if (!["pending", "paid"].includes(order.status)) {
            return res.status(400).json({
                message: `Cannot cancel order in '${order.status}' status`
            });
        }
        order.status = "cancelled";
        await order.save();
        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        });
    }
    catch (error) {
        console.error("Error cancelling order:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to cancel order",
            error: error.response?.data || error.message
        });
    }
}

// update user address
async function updateShippingAddress(req, res) {
    try {
        const orderId = req.params.id;
        const { street, city, state, zip, country } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden: You don't have access to this order"
            });
        }
        if (order.status !== "pending") {
            return res.status(400).json({
                message: `Cannot update address for order in '${order.status}' status`
            });
        }
        order.shippingAddress = {
            street: street || order.shippingAddress.street,
            city: city || order.shippingAddress.city,
            state: state || order.shippingAddress.state,
            zip: zip || order.shippingAddress.zip,
            country: country || order.shippingAddress.country
        };
        await order.save();
        return res.status(200).json({
            message: "Shipping address updated successfully",
            order
        });
    }
    catch (error) {
        console.error("Error updating shipping address:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to update shipping address",
            error: error.response?.data || error.message
        });
    }
}
async function updateOrderStatus(req, res) {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Only seller/admin can update
        if (!["seller", "admin"].includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: Only seller can update status"
            });
        }

        order.status = status || order.status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Error updating order status:", error.message);

        return res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
}









    
module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrderById,
    updateShippingAddress,
    updateOrderStatus
};