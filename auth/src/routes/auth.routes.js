const express = require('express');
const { registerUserValidator } = require('../middleware/validator.middleware');
const { registerUser } = require('../controller/auth.controller');
const { loginUserValidation } = require('../middleware/validator.middleware');
const { loginUser } = require('../controller/auth.controller');

const router = express.Router();

router.post('/register', ...registerUserValidator, registerUser);
router.post('/login', ...loginUserValidation, loginUser);

module.exports = router;