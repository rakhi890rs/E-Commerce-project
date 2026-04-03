const cartModel = require('../model/cart.model');

async function addItemToCart(req, res) {
    const { productId, quantity } = req.body;
    const user = req.user; // Assuming user information is available in the request
    let cart = await cartModel.findOne({ user: user._id });
    if (!cart) {
        cart = new cartModel({ user: user._id, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(200).json({ message: 'Item added to cart successfully', cart });

}

async function updateCartItem(req, res) {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;      

}

async function getCart(req, res) {
    const user = req.user;
    const cart = await cartModel.findOne({ user: user._id }).populate('items.product');
    res.status(200).json({ cart });
}

async function deleteCartItem(req, res) {
    const { productId } = req.params;
    const user = req.user;
    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ message: 'Item removed from cart successfully', cart });
}

async function clearCart(req, res) {
    const user = req.user;
    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully', cart });
}



module.exports = {
    addItemToCart,
    updateCartItem,
    getCart,
    deleteCartItem,
    clearCart
}