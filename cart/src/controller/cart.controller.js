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
module.exports = {
    addItemToCart
}