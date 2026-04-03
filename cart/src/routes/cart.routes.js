const express = require('express');
const authMiddleware = require('../../auth/middleware/auth.middleware');
const router = express.Router();
const {addItemToCart} = require('../controller/cart.controller');
const {validateAddItemToCart} = require('../middleware/validation.middleware');



router.post('/items', authMiddleware(["user"]), validateAddItemToCart, addItemToCart);

module.exports = router;