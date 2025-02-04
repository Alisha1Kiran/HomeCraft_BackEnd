const mongoose = require("mongoose");

const purpose_forSchema = new mongoose.Schema({
  for_name: {
      type: string,
      required: true,
    },
    ref_pic: {
      type: string
    },
  });

const PurposeFor = mongoose.model("PurposeFor", purpose_forSchema);
module.exports = PurposeFor;
