const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
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
      }
    ],

    totalPrice: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        enum: ['USD', 'INR'],
        default: 'INR'
      }
    },

    shippingAddress: {
      type: addressSchema,
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);