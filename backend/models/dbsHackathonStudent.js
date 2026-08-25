const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    collegeRollNo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const hackathonStudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    collegeRollNo: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },

    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },

    projectAbstract: {
      type: String,
      required: true,
      trim: true,
    },

    teamMembers: {
      type: [teamMemberSchema],

      required: true,

      validate: {
        validator: function (members) {
          return members.length >= 2 && members.length <= 4;
        },

        message:
          "Team must contain minimum 2 and maximum 4 members",
      },
    },

    // ==============================
    // PAYMENT
    // ==============================

    paymentAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],

      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    registrationStatus: {
      type: String,

      enum: [
        "Registered",
        "Cancelled",
      ],

      default: "Registered",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "dbsHackathonStudent",
  hackathonStudentSchema,
  "dbshackathonstudents"
);