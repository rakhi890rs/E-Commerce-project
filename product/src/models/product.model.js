const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        enum: ["USD", "INR"],
        default: "INR"
      }
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    images: [
      {
        url: {
          type: String,
          required: true
        },
        thumbnail: {
          type: String
        },
        id: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);