// // models/studentlog.js
// const mongoose = require("mongoose");

// const StudentlogSchema = new mongoose.Schema({
//     studentid: {type: mongoose.Schema.Types.ObjectId,ref: "student",required: true},
//   action: {
//     type: String,
//     enum: ["create", "update", "payment"],
//     required: true
//   },
//   payment: {
//       amount: { type: Number },          // paid amount
//       paymentMode: { type: String },      // cash / upi / card (optional)
//       transactionId: { type: String },    // optional
//       paidAt: { type: Date, default: Date.now }
//     },

//  changes: [
//       {
//         field: { type: String, required: true },

//         oldvalue: { type: mongoose.Schema.Types.Mixed },

//         newvalue: { type: mongoose.Schema.Types.Mixed },
//       },
//     ],

//   updatedby: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   source: {
//     type: String,
//     enum: ["lead_create", "lead_update", "student_edit","fee_payment"],
//     required: true
//   },
//     createdAt: { type: Date, default: Date.now },
      
// }, {timestamps:true});

// module.exports = mongoose.model("Studentlog", StudentlogSchema);
// models/studentlog.js
const mongoose = require("mongoose");

const StudentlogSchema = new mongoose.Schema({
    studentid: {type: mongoose.Schema.Types.ObjectId,ref: "student",required: true},
  action: {
    type: String,
    enum: ["create", "update", "payment"],
    required: true
  },
  payment: {
      amount: { type: Number },          // paid amount
      paymentMode: { type: String },      // cash / upi / card (optional)
      transactionId: { type: String },    // optional
      paidAt: { type: Date, default: Date.now }
    },

 changes: [
      {
        field: { type: String, required: true },

        oldvalue: { type: mongoose.Schema.Types.Mixed },

        newvalue: { type: mongoose.Schema.Types.Mixed },
      },
    ],

  updatedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  nexilaID:{
 type:String,
 index:true
},
  source: {
    type: String,
    enum: ["lead_create", "lead_update", "student_edit","fee_payment"],
    required: true
  },
  
    createdAt: { type: Date, default: Date.now },
      
}, {timestamps:true});

module.exports = mongoose.model("Studentlog", StudentlogSchema);