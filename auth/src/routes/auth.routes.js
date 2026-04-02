const express = require('express');
const {
    registerUserValidator,
    loginUserValidation,
    addUserAddressValidator
} = require('../middleware/validator.middleware');

const {
    registerUser,
    loginUser,
    getCurrentUser,
    getUserAddress,
    addUserAddress,
    deleteUserAddress
} = require('../controller/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', ...registerUserValidator, registerUser);
router.post('/login', ...loginUserValidation, loginUser);

router.get('/me', authMiddleware, getCurrentUser);
router.get('/user/me/address', authMiddleware, getUserAddress);
router.post('/user/me/address', authMiddleware, ...addUserAddressValidator, addUserAddress);
router.delete('/user/me/address/:id', authMiddleware, deleteUserAddress);

module.exports = router;