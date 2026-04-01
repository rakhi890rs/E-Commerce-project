const express = require('express');
const { registerUserValidator } = require('../middleware/validator.middleware');
const { registerUser } = require('../controller/auth.controller');

const router = express.Router();

router.post('/register', registerUserValidator, registerUser);

module.exports = router;