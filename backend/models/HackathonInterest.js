const mongoose = require("mongoose");

const hackathonInterestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["interested","link sent", "not interested"],
      default: "interested",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HackathonInterest",
  hackathonInterestSchema
);