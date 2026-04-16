const express = require('express');
const sellerDashboardMiddleware = require('../middleware/sellerDashboard.middleware');
const { getSellerMetrics, getOrders, getProducts} = require('../controllers/seller.controller');

const router = express.Router();

router.get('/metrics', sellerDashboardMiddleware, getSellerMetrics);
router.get("/orders", sellerDashboardMiddleware, getOrders);
router.get("/products", sellerDashboardMiddleware, getProducts);

module.exports = router;