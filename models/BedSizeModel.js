const mongoose = require("mongoose");

const bed_sizeSchema = new mongoose.Schema({
  size: {
    type: string,
    required: true,
  },
  ref_pic: {
    type: string,
    required: true,
  },
});

const BedSize = mongoose.model("BedSize", bed_sizeSchema);
module.exports = BedSize;
