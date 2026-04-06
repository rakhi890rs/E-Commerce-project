const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

const {
  addItemToCart,
  updateCartItem,
  getCart,
  deleteCartItem,
  clearCart
} = require('../controller/cart.controller');

const {
  validateAddItemToCart,
  validateUpdateCartItem
} = require('../middleware/validation.middleware');

router.get('/', authMiddleware(["user", "seller"]), getCart);

router.post('/items', authMiddleware(["user", "seller"]), validateAddItemToCart, addItemToCart);

router.patch('/items/:productId', authMiddleware(["user", "seller"]), validateUpdateCartItem, updateCartItem);

router.delete('/items/:productId', authMiddleware(["user", "seller"]), deleteCartItem);

router.delete('/', authMiddleware(["user", "seller"]), clearCart);

module.exports = router;