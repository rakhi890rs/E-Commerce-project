const paymentModel = require('../models/payment.model');
const axios = require('axios');
const { publishToQueue } = require('../borker/borker');
require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try {
        const orderId = req.params.orderId;

        const orderResponse = await axios.get(
            `http://localhost:3003/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const price = orderResponse.data.order.totalPrice;

        const order = await razorpay.orders.create({
            amount: price.amount * 100,
            currency: price.currency
        });

        const payment = await paymentModel.create({
            order: orderId,
            razorpayOrderId: order.id,
            user: req.user.id,
            status: 'INITIATED',
            price: {
                amount: price.amount,
                currency: price.currency
            }
        });

        await Promise.all([
            publishToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_INITIATED", payment),
            publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_INITIATED", {
                ...payment.toObject(),
                email: req.user.email
            })
        ]);

        return res.status(201).json({
            message: 'Payment initiated',
            payment
        });

    } catch (err) {
        console.log('ERROR:', err.response?.data || err.message || err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

async function verifyPayment(req, res) {
    const { razorpayOrderId, paymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpayOrderId}|${paymentId}`)
            .digest('hex');

        const isValid = generatedSignature === signature;

        const payment = await paymentModel.findOne({ razorpayOrderId });

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        if (!isValid) {
            await publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", {
                email: req.user.email,
                orderId: payment.order,
                paymentId,
                amount: payment.price.amount,
                currency: payment.price.currency,
                status: "FAILED"
            });

            return res.status(400).json({
                message: 'Invalid signature'
            });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'COMPLETED';

        await payment.save();

        await Promise.all([
            publishToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", {
                email: req.user.email,
                orderId: payment.order,
                paymentId: payment.paymentId,
                amount: payment.price.amount,
                currency: payment.price.currency,
                status: payment.status
            }),
            publishToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_COMPLETED", payment)
        ]);

        return res.status(200).json({
            message: 'Payment verified successfully',
            payment
        });

    } catch (err) {
        console.log('ERROR:', err.response?.data || err.message || err);

        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    createPayment,
    verifyPayment
};