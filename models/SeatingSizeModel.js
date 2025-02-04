const mongoose = require("mongoose");

const seating_sizeSchema = new mongoose.Schema({
  seating_limit: {
    type: String,
    required: true,
  }
});

const SeatingSize = mongoose.model("SeatingSize", seating_sizeSchema);
module.exports = SeatingSize;
