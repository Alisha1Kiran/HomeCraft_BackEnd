const mongoose = require('mongoose');

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
    doorCout_id: {
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
            required: true
        },
        color: {
            type: String,
            required: true
        },
        assembly_provided: {
            type: Boolean,
            default: false
        },
        dimensions: {
            type: String,
            trim: true
        },
        features: {
            type: String
        },
        general: {
            type: String
        },
        material: {
            type: String,
            trim: true
        },
        bed_size_id: {
            type: String
        },
        mattress_type_id: {
            type: String
        },
        seat_count: {
            type: String
        },
        door_count: {
            type: String
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

const Products = mongoose.model('Products', productSchema); // Model registration
module.exports = Products;