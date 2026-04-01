const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { username, email, password, fullname: { firstname, lastname } } = req.body;

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
            }
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

        res.cookie("token", token, {
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

        res.cookie("token", token, {
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

module.exports = { registerUser, loginUser, getCurrentUser };