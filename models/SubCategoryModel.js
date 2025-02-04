const mongoose = require("mongoose");

const sub_categorySchema = new mongoose.Schema({
  name: {
    type: string,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
    required: true,
  },
  ref_pic: {
    type: string,
    required: true,
  },
});

const SubCategory = mongoose.model("SubCategory", sub_categorySchema);
module.exports = SubCategory;
