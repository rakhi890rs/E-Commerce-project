const { body, validationResult } = require("express-validator");

// validate middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    next();
};

// shipping address validator
const shippingAddressValidator = [
    body('shippingAddress.street')
        .isString()
        .notEmpty()
        .withMessage('Street is required'),

    body('shippingAddress.city')
        .isString()
        .notEmpty()
        .withMessage('City is required'),

    body('shippingAddress.state')
        .isString()
        .notEmpty()
        .withMessage('State is required'),

    body('shippingAddress.zip')
        .isString()
        .notEmpty()
        .withMessage('Zip is required'),

    body('shippingAddress.country')
        .isString()
        .notEmpty()
        .withMessage('Country is required'),

    validate
];

module.exports = {
    shippingAddressValidator
};