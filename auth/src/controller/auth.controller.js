const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { publishToQueue } = require('../borker/borker');

async function registerUser(req, res) {
    try {
        const { username, email, password, fullname: { firstname, lastname }, role } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({ message: 'user or email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
            fullname: {
                firstname,
                lastname
            },
            role
        });

        // publish user created event rabbitmq
        await publishToQueue('AUTH_NOTIFICATION.USER_CREATED', {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        });

        return res.status(201).json({
            message: 'user registered successfully',
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        });

        user.password = undefined;

        return res.status(200).json({
            message: 'login successful',
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        return res.status(200).json({
            message: 'current user fetched successfully',
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

async function getUserAddress(req, res) {
    try {
        return res.status(200).json({
            message: 'user address fetched successfully',
            address: req.user.address
        });
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

async function addUserAddress(req, res) {
    try {
        const { street, city, state, zip, country } = req.body;

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    address: { street, city, state, zip, country }
                }
            },
            { new: true }
        );

        return res.status(201).json({
            message: 'user address added successfully',
            address: user.address
        });

    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

async function deleteUserAddress(req, res) {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    address: { _id: id }
                }
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'address deleted successfully',
            address: user.address
        });

    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    getUserAddress,
    addUserAddress,
    deleteUserAddress
};