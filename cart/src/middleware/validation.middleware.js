const {body ,validationResult } = require('express-validator');

const validateAddItemToCart = [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be at least 1'),
];



