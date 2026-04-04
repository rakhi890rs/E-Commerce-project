const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createOrder } = require('../controllers/order.controller');

router.post("/", authMiddleware(["user","seller"]), createOrder);

module.exports = router;
    