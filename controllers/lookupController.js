const mongoose = require('mongoose');
const Category = require("./../models/CategoryModel");
const SubCategory = require("./../models/SubCategoryModel");
const PurposeFor = require("./../models/PurposeForModel");
const BedSize = require("./../models/BedSizeModel");
const SeatingSize = require("./../models/SeatingSizeModel");
const DoorCount = require("./../models/DoorCountModel");

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({}).toArray();
        if (!categories.length) return res.status(404).json({ success: false, message: 'No categories found' });

        res.status(200).json({ success: true, message: 'Categories fetched successfully', categories });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching categories: ${error.message}` });
    }
}

const getSubCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const subcategories = await SubCategory.find({ category_id: new mongoose.Types.ObjectId(categoryId) }) // Use 'new' with ObjectId
            .toArray();

        if (!subcategories.length) return res.status(404).json({ success: false, message: 'No subcategories found' });

        res.status(200).json({ success: true, message: 'Subcategories fetched successfully', subcategories });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching subcategories: ${error.message}` });
    }
}

const getBedSize = async (req, res) => {
    try {
        const bedSize = await BedSize.find({}).toArray();
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

const seatingSize = async (req, res) => {
    try {
        const seating_size = await SeatingSize.find({}).toArray();
        if (!seating_size.length) return res.status(404).json({ success: false, message: 'No items found' });

        res.status(200).json({ success: true, message: 'Seating size fetched successfully', seating_size });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching seating size: ${error.message}` });
    }
}

const wardrobeDoorCount = async (req, res) => {
    try {
        const door_count = await DoorCount.find({}).toArray();
        if (!door_count.length) return res.status(404).json({ success: false, message: 'No items found' });

        res.status(200).json({ success: true, message: 'Wardrobe door type fetched successfully', door_count });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching wardrobe door type: ${error.message}` });
    }
}

const purposeFor = async (req, res) => {
    try {
        const purpose_for = await PurposeFor.find({}).toArray();
        if (!purpose_for.length) return res.status(404).json({ success: false, message: 'No items found' });

        res.status(200).json({ success: true, message: 'Purpose for data type fetched successfully', purpose_for });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching purpose for data: ${error.message}` });
    }
}

module.exports = {getCategory, getSubCategory, getBedSize, mattressType, seatingSize, wardrobeDoorCount, purposeFor};