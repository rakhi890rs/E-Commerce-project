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

const updateShippingAddressValidator = [
    body('street')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Street must be a non-empty string'),
    body('city')
        .optional()
        .isString()
        .notEmpty() 
        .withMessage('City must be a non-empty string'),
    body('state')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('State must be a non-empty string'),
    body('zip')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Zip must be a non-empty string'),
    body('country')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Country must be a non-empty string'),
    validate
];

module.exports = {
    shippingAddressValidator,
    updateShippingAddressValidator
};