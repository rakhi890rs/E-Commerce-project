const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerUserValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),

    body('email')
        .isEmail()
        .withMessage('Invalid email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('fullname.firstname')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),

    body('fullname.lastname')
        .isString()
        .notEmpty()
        .withMessage('Last name is required'),

    body('role')
        .optional()
        .isIn(['user', 'seller'])
        .withMessage('Role must be user or seller'),

    validate
];

const loginUserValidation = [
    body('username')
        .optional()
        .isString()
        .withMessage('Username must be a string'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validate
];

const addUserAddressValidator = [
    body('street')
        .isString()
        .notEmpty()
        .withMessage('Street is required'),

    body('city')
        .isString()
        .notEmpty()
        .withMessage('City is required'),

    body('state')
        .isString()
        .notEmpty()
        .withMessage('State is required'),

    body('zip')
        .isString()
        .notEmpty()
        .withMessage('Zip is required'),

    body('country')
        .isString()
        .notEmpty()
        .withMessage('Country is required'),

    validate
];

module.exports = { registerUserValidator, loginUserValidation, addUserAddressValidator };