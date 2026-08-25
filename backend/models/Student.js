// const mongoose = require("mongoose");

// const StudentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String },
//   email: { type: String },
//   collegename: { type: String },
//   location: { type: String },
//   category: { type: String },
//   leadsource: { type: String },
//   domain: { type: String },
//   graduate: { type: String },
//   leadstatus: {type: String},
//   followdate: {
//       type: Date,
//       default: null,
//     },
//   demodate: {
//       type: Date,
//       default: null,
//     },
//  lookingfor:{type:String},
//  internshipduration:{type:String},
//  noofday:{type:String,default:null},
//   dateofjoin:{type:Date,default:null},
//   feetype:{type:String}, 
//   fees: { type: Number, default: 0 },
//   feepaid: { type: Number, default: 0 },
//   pendingfee: { type: Number, default: 0 },

//   assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignto: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // 🔗 original lead
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Student", StudentSchema);
// const mongoose = require("mongoose");

// const StudentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String },
//   email: { type: String },
//   collegename: { type: String },
//   location: { type: String },
//   category: { type: String },
//   leadsource: { type: String },
//   domain: { type: String },
//   graduate: { type: String },
//   leadstatus: { type: String },

//   followdate: {
//     type: Date,
//     default: null,
//   },
//   demodate: {
//     type: Date,
//     default: null,
//   },

//   lookingfor: { type: String },
//   internshipduration: { type: String },
//   noofday: { type: String, default: null },
//   dateofjoin: { type: Date, default: null },

//   feetype: { type: String },
//   fees: { type: Number, default: 0 },
//   feepaid: { type: Number, default: 0 },
//   pendingfee: { type: Number, default: 0 },

//   // ✅ NEW FIELD
//   isActive: {
//     type: Boolean,
//     default: true, // active by default
//   },

//   assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignto: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Student", StudentSchema);
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
  leadstatus: { type: String },

  followdate: {
    type: Date,
    default: null,
  },
  demodate: {
    type: Date,
    default: null,
  },

  lookingfor: { type: String },
  internshipduration: { type: String },
  noofday: { type: String, default: null },
  dateofjoin: { type: Date, default: null },

  feetype: { type: String },
  fees: { type: Number, default: 0 },
  feepaid: { type: Number, default: 0 },
  pendingfee: { type: Number, default: 0 },

  // ✅ NEW FIELD
  isActive: {
    type: Boolean,
    default: true, // active by default
  },

  assignfrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignto: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

  nexilaID:{
 type:String,
 unique:true,
 index:true
},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);