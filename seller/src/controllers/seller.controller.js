const userModel = require('../models/user.model');
const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');
const paymentModel = require('../models/payment.model');
const mongoose = require('mongoose');

async function getSellerMetrics(req, res) {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);

        const totalUsers = await userModel.countDocuments();

        const sellerProducts = await productModel.find({ seller: sellerId })
            .select('_id title stock price images');

        const productIds = sellerProducts.map(product => product._id);

        const totalProducts = sellerProducts.length;

        const sellerOrders = await orderModel.find({
            'items.product': { $in: productIds }
        });

        const totalOrders = sellerOrders.length;

        const orderIds = sellerOrders.map(order => order._id);

        const sellerPayments = await paymentModel.find({
            order: { $in: orderIds },
            status: 'paid'
        });

        const totalPayments = sellerPayments.length;

        let totalRevenue = 0;

        for (const order of sellerOrders) {
            for (const item of order.items) {
                if (productIds.some(id => id.toString() === item.product.toString())) {
                    totalRevenue += item.price.amount * item.quantity;
                }
            }
        }

        const productSalesMap = {};

        for (const product of sellerProducts) {
            productSalesMap[product._id.toString()] = {
                productId: product._id,
                title: product.title,
                soldQuantity: 0,
                revenue: 0,
                stock: product.stock,
                price: product.price?.amount || 0,
                images: product.images || []
            };
        }

        for (const order of sellerOrders) {
            for (const item of order.items) {
                const productId = item.product.toString();

                if (productSalesMap[productId]) {
                    productSalesMap[productId].soldQuantity += item.quantity;
                    productSalesMap[productId].revenue += item.price.amount * item.quantity;
                }
            }
        }

        const salesData = Object.values(productSalesMap);

        const topProducts = [...salesData]
            .sort((a, b) => b.soldQuantity - a.soldQuantity)
            .slice(0, 5);

        return res.status(200).json({
            message: 'Seller dashboard metrics fetched successfully',
            metrics: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalPayments,
                totalRevenue
            },
            salesData,
            topProducts
        });

    } catch (error) {
        console.error('Error fetching seller metrics:', error);
        return res.status(500).json({
            message: 'Failed to fetch seller dashboard metrics',
            error: error.message
        });
    }
}

async function getOrders(req, res) {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);

        const sellerProducts = await productModel.find({ seller: sellerId }).select('_id');
        const productIds = sellerProducts.map(product => product._id);

        const sellerOrders = await orderModel.find({
            'items.product': { $in: productIds }
        })
        .populate('items.product', 'title price images')
        .populate('user', 'username email fullname');

        const filterOrders = sellerOrders.map(order => {
            const items = order.items.filter(item =>
                item.product && productIds.some(id => id.toString() === item.product._id.toString())
            );

            return {
                _id: order._id,
                user: order.user,
                items,
                totalAmount: items.reduce(
                    (sum, item) => sum + (item.price.amount * item.quantity),
                    0
                ),
                status: order.status,
                createdAt: order.createdAt
            };
        });

        return res.status(200).json({
            message: 'Seller orders fetched successfully',
            orders: filterOrders
        });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        return res.status(500).json({
            message: 'Failed to fetch seller orders',
            error: error.message
        });
    }
}
async function getProducts(req, res) {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const products = await productModel.find({ seller: sellerId })
            .select('_id title description price stock images createdAt');

        return res.status(200).json({
            message: 'Seller products fetched successfully',
            products
        });
    }
    catch (error) {
        console.error('Error fetching seller products:', error);
        return res.status(500).json({
            message: 'Failed to fetch seller products',
            error: error.message
        });
    }
}
async function getProducts(req, res) {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const products = await productModel.find({ seller: sellerId })
            .select('_id title description price stock images createdAt');

        return res.status(200).json({
            message: 'Seller products fetched successfully',
            products
        });
    }
    catch (error) {
        console.error('Error fetching seller products:', error);
        return res.status(500).json({
            message: 'Failed to fetch seller products',
            error: error.message
        });
    }
}

module.exports = {
    getSellerMetrics,
    getOrders,
    getProducts

};