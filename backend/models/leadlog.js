// const mongoose = require("mongoose");

// const LeadlogSchema = new mongoose.Schema(
// {
//   // Lead Reference
//   leadid: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Lead",
//     required: true
//   },

//   // What happened
//   action: {
//     type: String,
//     enum: [
//       "create",
//       "update",
//       "delete",
//       "status_change",
//       "assign_change",
//       "payment_update",
//       "convert_student"
//     ],
//     required: true
//   },

//   // Optional short title
//   title: {
//     type: String,
//     default: ""
//   },

//   // Status Tracking
//   status: {
//     oldvalue: { type: String, default: "" },
//     newvalue: { type: String, default: "" }
//   },

//   // Assignment Tracking
//   assign: {
//     fromold: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     },
//     fromnew: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     },
//     toold: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     },
//     tonew: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//     }
//   },

//   // Payment Tracking
//   payment: {
//     oldfees: { type: String, default: "" },
//     newfees: { type: String, default: "" },

//     oldpaid: { type: String, default: "" },
//     newpaid: { type: String, default: "" },

//     oldpending: { type: String, default: "" },
//     newpending: { type: String, default: "" },

//     oldtype: { type: String, default: "" },
//     newtype: { type: String, default: "" }
//   },

//   // ALL FIELD CHANGES
//   changes: [
//     {
//       field: { type: String, required: true },

//       oldvalue: {
//         type: mongoose.Schema.Types.Mixed,
//         default: null
//       },

//       newvalue: {
//         type: mongoose.Schema.Types.Mixed,
//         default: null
//       }
//     }
//   ],

//   // Full Snapshot Before Update
//   beforeData: {
//     type: mongoose.Schema.Types.Mixed,
//     default: null
//   },

//   // Full Snapshot After Update
//   afterData: {
//     type: mongoose.Schema.Types.Mixed,
//     default: null
//   },

//   // Who updated
//   updatedby: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null
//   }

// },
// {
//   timestamps: true
// });

// module.exports = mongoose.model("Leadlog", LeadlogSchema);


const mongoose = require("mongoose");

const LeadlogSchema = new mongoose.Schema(
{
  // Lead Reference
  leadid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true
  },

  // What happened
  action: {
    type: String,
    enum: [
      "create",
      "update",
      "delete",
      "status_change",
      "assign_change",
      "payment_update",
      "convert_student"
    ],
    required: true
  },
  nexilaID:{
 type:String,
 index:true
},

  // Optional short title
  title: {
    type: String,
    default: ""
  },

  // Status Tracking
  status: {
    oldvalue: { type: String, default: "" },
    newvalue: { type: String, default: "" }
  },

  // Assignment Tracking
  assign: {
    fromold: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    fromnew: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    toold: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    tonew: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },

  // Payment Tracking
  payment: {
    oldfees: { type: String, default: "" },
    newfees: { type: String, default: "" },

    oldpaid: { type: String, default: "" },
    newpaid: { type: String, default: "" },

    oldpending: { type: String, default: "" },
    newpending: { type: String, default: "" },

    oldtype: { type: String, default: "" },
    newtype: { type: String, default: "" }
  },

  // ALL FIELD CHANGES
  changes: [
    {
      field: { type: String, required: true },

      oldvalue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },

      newvalue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    }
  ],

  // Full Snapshot Before Update
  beforeData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  // Full Snapshot After Update
  afterData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  // Who updated
  updatedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("Leadlog", LeadlogSchema);