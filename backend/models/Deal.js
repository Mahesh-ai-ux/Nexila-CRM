const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String },
  phone: { type: String },
  category: { type: String },
  leadsource: { type: String },
  location: { type: String },
    assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignto: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String },
  time: { type: String },
  leadstatus: {
    type: String,
  },
  followdate: {
      type: Date,
      default: null,
    },
  demodate: {
      type: Date,
      default: null,
    },

  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
