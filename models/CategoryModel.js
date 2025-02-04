const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    cat_name : {
        type: string,
        required: true
    },
    ref_pic : {
        type: string,
        required: true
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;