const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the User model
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', // Reference to the Product model
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
        max: 5 // Restrict rating between 1 and 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;
