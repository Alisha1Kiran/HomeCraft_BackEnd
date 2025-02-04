const mongoose = require("mongoose");

const door_countSchema = new mongoose.Schema({
  door_type: {
    type: string,
    required: true,
  }
});

const DoorCount = mongoose.model("DoorCount", door_countSchema);
module.exports = DoorCount;
