const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the User model
        required: false
    },
    guest_id: {
        type: String, // For unauthenticated users
        required: false,
        default: null
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products', // Reference to the Product model
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1, // Default quantity is 1
                min: 1 // Ensure at least 1 item
            }
        }
    ],
    total_price: {
        type: Number,
        required: true,
        default: 0 // can be dynamically calculated in the backend
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
