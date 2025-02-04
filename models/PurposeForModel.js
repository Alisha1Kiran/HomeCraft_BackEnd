const mongoose = require("mongoose");

const purpose_forSchema = new mongoose.Schema({
  for_name: {
      type: String,
      required: true,
    },
    ref_pic: {
      type: String
    },
  });

const PurposeFor = mongoose.model("PurposeFor", purpose_forSchema);
module.exports = PurposeFor;
