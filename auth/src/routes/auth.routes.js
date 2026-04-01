const express = require('express');
const { registerUserValidator, loginUserValidation } = require('../middleware/validator.middleware');
const { registerUser, loginUser, getCurrentUser } = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', ...registerUserValidator, registerUser);
router.post('/login', ...loginUserValidation, loginUser);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;