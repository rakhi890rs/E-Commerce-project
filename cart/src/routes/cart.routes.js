const express = require('express');
const authMiddleware = require('../../auth/middleware/auth.middleware');
const router = express.Router();
const {addItemToCart} = require('../controller/cart.controller');



router.post('/items', authMiddleware(["user"]), addItemToCart);

module.exports = router;