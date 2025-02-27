const mongoose = require('mongoose');
const User = require('./../models/UserModel');
const Product = require('./../models/ProductModel');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestName: {
        type: String,
        trim: true,
        required: function () {
            return !this.user_id; // Required only if user_id is not present
        }
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;
