const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  collegename: { type: String },
  location: { type: String },
  category: { type: String },
  leadsource: { type: String },
  domain: { type: String },
  graduate: { type: String },
  leadstatus: {type: String},
  followdate: {
      type: Date,
      default: null,
    },
  demodate: {
      type: Date,
      default: null,
    },

  assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignto: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // 🔗 original lead
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);
