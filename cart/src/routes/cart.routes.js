const express = require('express');
const authMiddleware = require('../../auth/middleware/auth.middleware');
const router = express.Router();
const {addItemToCart, updateCartItem, getCart, deleteCartItem,clearCart} = require('../controller/cart.controller');
const {validateAddItemToCart} = require('../middleware/validation.middleware');


router.get('/', authMiddleware(["user"]), getCart);

router.post('/items', authMiddleware(["user"]), validateAddItemToCart, addItemToCart);

router.patch('/items/:productId', authMiddleware(["user"]), validateUpdateCartItem, updateCartItem);

router.delete('/items/:productId', authMiddleware(["user"]), deleteCartItem);

// clear cart
router.delete('/', authMiddleware(["user"]), clearCart);


module.exports = router;