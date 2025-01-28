const mongoose = require('mongoose');

const getCategory = async (req, res) => {
    try {
        const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
        if (!categories.length) return res.status(404).json({ success: false, message: 'No categories found' });

        res.status(200).json({ success: true, message: 'Categories fetched successfully', categories });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching categories: ${error.message}` });
    }
}

const getSubCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const subcategories = await mongoose.connection.db
            .collection('subCategories')
            .find({ category_id: new mongoose.Types.ObjectId(categoryId) }) // Use 'new' with ObjectId
            .toArray();

        if (!subcategories.length) return res.status(404).json({ success: false, message: 'No subcategories found' });

        res.status(200).json({ success: true, message: 'Subcategories fetched successfully', subcategories });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching subcategories: ${error.message}` });
    }
}

const getBedSize = async (req, res) => {
    try {
        const bedSize = await mongoose.connection.db.collection('bedSize').find({}).toArray();
        if (!bedSize.length) return res.status(404).json({ success: false, message: 'No bedSize found' });

        res.status(200).json({ success: true, message: 'Bed size fetched successfully', bedSize });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching bed size: ${error.message}` });
    }
}

const mattressType = async (req, res) => {
    try {
        const mattress_type = await mongoose.connection.db.collection('mattressType').find({}).toArray();
        if (!mattress_type.length) return res.status(404).json({ success: false, message: 'No item found' });

        res.status(200).json({ success: true, message: 'Mattress type fetched successfully', mattress_type });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching mattress type: ${error.message}` });
    }
}

module.exports = {getCategory, getSubCategory, getBedSize, mattressType};