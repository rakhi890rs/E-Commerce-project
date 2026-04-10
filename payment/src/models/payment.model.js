const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentId: {
        type: String,

    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    signature: {
        type: String,
    },
     status: {
        type: String,
        enum: ["pending", "created", "paid", "failed"],
        default: "pending"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['USD', 'INR'],
            default: 'INR'
        }
    }

}, { timestamps: true });

module.exports = mongoose.model('paymentModel', paymentSchema);