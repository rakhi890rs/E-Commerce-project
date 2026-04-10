const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const { 
  createOrder, 
  getMyOrders,
  cancelOrderById,
  getOrderById,
  updateOrderStatus,
  updateShippingAddress
} = require('../controllers/order.controller');

const { 
  shippingAddressValidator, 
  updateShippingAddressValidator 
} = require("../middlewares/validation.middleware");

// Create a new order
router.post("/", authMiddleware(["user","seller","admin"]), shippingAddressValidator, createOrder);

// Get orders for the logged-in user
router.get("/me", authMiddleware(["user","seller","admin"]), getMyOrders);

// Get order by id
router.get("/:id", authMiddleware(["user","seller","admin"]), getOrderById);

// Buyer initiated cancel
router.post("/:id/cancel", authMiddleware(["user","seller"]), cancelOrderById);

// Seller updates order status
router.post("/:id/status", authMiddleware(["seller"]), updateOrderStatus);

// Update shipping address
router.patch("/:id/address", authMiddleware(["user"]), updateShippingAddressValidator, updateShippingAddress);

module.exports = router;