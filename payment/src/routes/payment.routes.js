
const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment } = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create/:orderId', authMiddleware(['user', 'seller']), createPayment);
router.post('/verify', authMiddleware(['user', 'seller']), verifyPayment);

module.exports = router;