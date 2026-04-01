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

module.exports = { registerUserValidator, loginUserValidation };