const mongoose = require("mongoose");

const sub_categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
    required: true,
  },
  ref_pic: {
    type: String,
    required: true,
  },
});

const SubCategory = mongoose.model("SubCategory", sub_categorySchema);
module.exports = SubCategory;
