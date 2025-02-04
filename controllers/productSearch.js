const Product = require("./../models/Product");
const Category = require("./../models/CategoryModel");
const SubCategory = require("./../models/SubCategoryModel");
const PurposeFor = require("./../models/PurposeForModel");
const BedSize = require("./../models/BedSizeModel");
const SeatingSize = require("./../models/SeatingSizeModel");
const DoorCount = require("./../models/DoorCountModel");

// general search
const searchProduct = async (req, res) => {
  console.log("inside search product");
    const { searchName } = req.params;
  console.log("Search text : ", searchName);
  try {
    // Search the category collection
    const category = await Category.findOne({ name: { $regex: searchName, $options: "i" } });
    if (category) {
      // If category matches, fetch products that belong to this category
      const products = await Product.find({ category_id: category._id });
      return res.status(200).json({ products });
    }

    // Search the sub-category collection
    const subCategory = await SubCategory.findOne({ name: { $regex: searchName, $options: "i" } });
    if (subCategory) {
      // If sub-category matches, fetch products that belong to this sub-category
      const products = await Product.find({ subcategory_id: subCategory._id });
      return res.status(200).json({ products });
    }

    // Search the sub-category collection
    const purposeFor = await PurposeFor.findOne({ name: { $regex: searchName, $options: "i" } });
    if (purposeFor) {
      // If sub-category matches, fetch products that belong to this sub-category
      const products = await Product.find({ purposeFor_id: purposeFor._id });
      return res.status(200).json({ products });
    }

    // Search the bed-size collection
    const bedSize = await BedSize.findOne({ name: { $regex: searchName, $options: "i" } });
    if (bedSize) {
      // If bed-size matches, fetch products that belong to this bed size
      const products = await Product.find({ bed_size_id: bedSize._id });
      return res.status(200).json({ products });
    }

    // Search the seating-size collection
    const seatingSize = await SeatingSize.findOne({ name: { $regex: searchName, $options: "i" } });
    if (seatingSize) {
      // If bed-size matches, fetch products that belong to this bed size
      const products = await Product.find({ seatingSize: seatingSize._id });
      return res.status(200).json({ products });
    }

    // Search the seating-size collection
    const doorCout = await DoorCount.findOne({ name: { $regex: searchName, $options: "i" } });
    if (doorCout) {
      // If bed-size matches, fetch products that belong to this bed size
      const products = await Product.find({ doorCout_id: doorCout._id });
      return res.status(200).json({ products });
    }

    // If no match is found
    return res.status(404).json({ message: "No products found matching the search term" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {searchProduct}