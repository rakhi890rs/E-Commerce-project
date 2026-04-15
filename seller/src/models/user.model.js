const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    },
    role: {
        type: String,
        enum: ['user', 'seller'],
        default: 'user'
    },
    address: [addressSchema]
});

module.exports = mongoose.model('User', userSchema);