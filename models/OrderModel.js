const mongoose = require('mongoose');
const Product = require("./ProductModel");
const User = require("./UserModel");

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // For registered users
    guest_id: { type: String, required: false }, // For guest users

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      emirate: { type: String, required: false },
      zip: { type: String, required: true },
      country: {
        type: String,
        enum: ['India', 'United Arab Emirates'],
        default: 'India',
        required: true
      }
    },

    totalPrice: { type: Number, required: true },

    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price_at_purchase: { type: Number, required: true } // Ensuring price is saved
      }
    ],

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },

    transactionId: { type: String, required: false }, // Useful for online payment tracking

    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
