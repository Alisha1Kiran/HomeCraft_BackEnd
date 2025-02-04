const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    cat_name : {
        type: String,
        required: true
    },
    ref_pic : {
        type: String,
        required: true
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;