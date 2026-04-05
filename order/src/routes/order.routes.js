const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createOrder, getMyOrders } = require('../controllers/order.controller');
const { shippingAddressValidator } = require("../middlewares/validation.middleware");
// Create a new order
router.post("/", authMiddleware(["user","seller","admin"]), shippingAddressValidator, createOrder);
// Get orders for the logged-in user
router.get("/me", authMiddleware(["user","seller","admin"]),getMyOrders); 



    

module.exports = router;
    