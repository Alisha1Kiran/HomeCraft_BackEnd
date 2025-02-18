const mongoose = require('mongoose');
const Catetory = require('./CategoryModel');
const SubCategory = require('./SubCategoryModel');
const PurposeFor = require('./PurposeForModel');
const BedSize = require('./BedSizeModel');
const SeatingSize = require('./SeatingSizeModel');
const DoorCount = require('./DoorCountModel');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    purposeFor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurposeFor',
        required: true
    },
    bedSize_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BedSize',
        required: false
    },
    seatingSize_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeatingSize',
        required: false
    },
    doorCount_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoorCount',
        required: false
    },
    stock: {
        type: Number,
        default: 0
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }    
    ],
    specifications: {
        weight: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        assembly_provided: {
            type: Boolean,
            default: false
        },
        dimensions: {
            type: String,
            required: false,
            trim: true
        },
        features: {
            type: String,
            required: false
        },
        general: {
            type: String,
            required: false
        },
        material: {
            type: String,
            required: false,
            trim: true
        }
    },
    ratings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})    

const Product = mongoose.model('Product', productSchema); // Model registration
module.exports = Product;