const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createOrder, getMyOrders,cancelOrderById,getOrderById, } = require('../controllers/order.controller');
const { shippingAddressValidator, updateShippingAddressValidator } = require("../middlewares/validation.middleware");
// Create a new order
router.post("/", authMiddleware(["user","seller","admin"]), shippingAddressValidator, createOrder);
// Get orders for the logged-in user
router.get("/me", authMiddleware(["user","seller","admin"]),getMyOrders); 

// get order by id
router.get("/:id", authMiddleware(["user","seller","admin"]), getOrderById);

// buyer - iniated cancel while pending/paid rules apply
router.post("/:id/cancel", authMiddleware(["user","seller"]), cancelOrderById);    // user only

// seller - update order status to shipped/delivered
router.post("/:id/status", authMiddleware(["seller"]), updateOrderStatus);

router.patch("/:id/address", authMiddleware(["user"]), shippingAddressValidator, updateShippingAddress);



    

module.exports = router;
    