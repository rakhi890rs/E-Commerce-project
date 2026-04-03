const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Middleware to check for validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation for adding an item to the cart
const validateAddItemToCart = [
    body('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Product ID format'),
    body('quantity')
        .isInt({ gt: 0 })
        .withMessage('Quantity must be a positive integer'),
    validate
];

// Validation for updating a cart item
const validateUpdateCartItem = [
    param('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Product ID format'),
    body('quantity')
        .isInt({ gt: 0 })
        .withMessage('Quantity must be a positive integer'),
    validate
];

module.exports = {
    validateAddItemToCart,
    validateUpdateCartItem
};