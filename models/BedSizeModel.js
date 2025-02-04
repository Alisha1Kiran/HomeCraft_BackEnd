const mongoose = require("mongoose");

const bed_sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  ref_pic: {
    type: String,
    required: true,
  },
});

const BedSize = mongoose.model("BedSize", bed_sizeSchema);
module.exports = BedSize;
