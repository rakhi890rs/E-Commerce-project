const cartModel = require('../models/cart.model');

async function addItemToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({
                productId,
                quantity: Number(quantity)
            });
        }

        await cart.save();

        res.status(200).json({
            message: 'Item added to cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add item to cart',
            error: error.message
        });
    }
}

async function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = Number(quantity);

        await cart.save();

        res.status(200).json({
            message: 'Cart item updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update cart item',
            error: error.message
        });
    }
}

async function getCart(req, res) {
    try {
        const userId = req.user.id;

        const cart = await cartModel
            .findOne({ user: userId })
            .populate('items.productId');

        if (!cart) {
            return res.status(200).json({
                message: 'Cart is empty',
                cart: { user: userId, items: [] }
            });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch cart',
            error: error.message
        });
    }
}

async function deleteCartItem(req, res) {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to remove item from cart',
            error: error.message
        });
    }
}

async function clearCart(req, res) {
    try {
        const userId = req.user.id;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to clear cart',
            error: error.message
        });
    }
}

module.exports = {
    addItemToCart,
    updateCartItem,
    getCart,
    deleteCartItem,
    clearCart
};