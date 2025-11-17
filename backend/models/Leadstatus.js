
const mongoose = require("mongoose");
const leadstatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Leadstatus = mongoose.model("Leadstatus", leadstatusSchema);
export default Leadstatus;
