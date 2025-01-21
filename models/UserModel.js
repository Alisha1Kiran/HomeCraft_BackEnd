const mongoose = require('mongoose');
const generateCustomId = require('./../utils/customIdGenerator');

// Generating Schema
const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Custom ID field
    fullName : { type: String, required: true, unique: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true},
    address : {
        street : { type : String },
        city : { type : String },
        state : { type : String },
        emirate: { type : String },
        zip : { type : String },
        country: {
            type: String,
            enum: ['India', 'United Arab Emirates'], // Allow only these options
            default: 'India', // Default country
        },
    },
    contactNumber : { type : Number},
    wishlist: [{ type : mongoose.Schema.Types.ObjectId, ref : 'Product' }],
    role: {type: String, required: true}
}
);

// Attach Pre-Save Hook for ID Generation
userSchema.pre('save', function (next) {
    generateCustomId(User, 101, this, next); // Start User IDs from 101
});

// Creating the model and exporting it
const User = mongoose.model('User', userSchema); // Model registration
module.exports = User;