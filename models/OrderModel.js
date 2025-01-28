const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.Mixed, // Mixed type for both ObjectId and String
        ref: 'Users',
        required: true
    },
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        emirate: { type: String },
        zip: { type: String },
        country: {
            type: String,
            enum: ['India', 'United Arab Emirates'],
            default: 'India'
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        quantity: { type: Number },
        price_at_purchase: { type: Number }, // Store the price at the time of purchase
    }],
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;
