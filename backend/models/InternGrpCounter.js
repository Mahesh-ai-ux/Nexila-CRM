const mongoose = require("mongoose");

const internGrpCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  sequence: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("InternGrpCounter", internGrpCounterSchema);