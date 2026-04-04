const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createOrder } = require('../controllers/order.controller');
const { shippingAddressValidator } = require("../middlewares/validation.middleware");

router.post("/", authMiddleware(["user","seller","admin"]), shippingAddressValidator, createOrder);

module.exports = router;
    