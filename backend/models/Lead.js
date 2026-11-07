
const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    collegename: { type: String },

    collegeRegisterId: {
      type: String,
      trim: true,
    },

    location: { type: String },

    // Existing select options
    category: { type: String },
    leadsource: { type: String },
    leadstatus: { type: String },
    domain: { type: String },
    graduate: { type: String },

    assignfrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: { type: String },
    joinstatus: { type: String },
    lookingfor: { type: String },
    internshipduration: { type: String },
    remark: { type: String },
    domainreason: { type: String },
    dropreason: { type: String },

    followdate: {
      type: Date,
      default: null,
    },

    demodate: {
      type: Date,
      default: null,
    },

    dateofjoin: {
      type: Date,
      default: null,
    },

    fees: { type: String },
    feetype: { type: String },
    feepaid: { type: String },
    pendingfee: { type: String },

    noofday: {
      type: String,
      default: "120",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
    },

    nexilaID: {
      type: String,
      unique: true,
      index: true,
    },

    metaLeadId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ===============================
    // PAYMENT FIELDS
    // ===============================

    paymentMethod: {
  type: String,
  enum: ["MANUAL", "RAZORPAY"],
  default: "MANUAL",
},

paymentStatus: {
  type: String,
  enum: ["PENDING", "PAID", "FAILED"],
  default: "PENDING",
},

paymentReference: {
  type: String,
  default: null,
},

razorpayOrderId: {
  type: String,
  default: undefined,
},

razorpayPaymentId: {
  type: String,
  default: undefined
},

razorpaySignature: {
  type: String,
  default: null,
},

paidAt: {
  type: Date,
  default: null,
},
groupInternshipId: {
  type: String,
  default: null,
  index: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", LeadSchema);