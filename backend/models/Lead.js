const mongoose = require('mongoose');
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  collegename: { type: String },
  location: { type: String },

  // select options
  category: { type: String },    // e.g. 'admission', 'inquiry', etc.
  leadsource: { type: String },  // e.g. 'website','referral'
  leadstatus: { type: String },  // e.g. 'new','contacted','closed'
  domain: { type: String },      // e.g. 'computer science'
  graduate: { type: String },    // e.g. '2025' or 'yes/no'

  // assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // assignto: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
assignfrom:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
assignto:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
notes: { type: String },
followdate: {
      type: Date,
      default: null,
    },
demodate: {
      type: Date,
      default: null,
    },


  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, { timestamps: true });

module.exports= mongoose.model('Lead', LeadSchema);

