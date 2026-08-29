const mongoose = require("mongoose");

// =====================================================
// TEAM MEMBER SCHEMA
// =====================================================

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
            trim: true,
        },

        collegeRollNo: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

// =====================================================
// HACKATHON STUDENT SCHEMA
// =====================================================

const hackathonStudentSchema = new mongoose.Schema(
    {
        // =================================================
        // REGISTRATION
        // =================================================

        registrationId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        // =================================================
        // STUDENT DETAILS
        // =================================================

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
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

        yearOfStudy: {
            type: String,
            required: true,
            trim: true,
        },

        // passingOutYear: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },

        district: {
            type: String,
            required: true,
            trim: true,
        },

        // =================================================
        // TEAM
        // =================================================

        teamName: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        teamMembers: {
            type: [teamMemberSchema],
            required: true,

            validate: {
                validator: function (members) {
                    return (
                        Array.isArray(members) &&
                        members.length >= 2 &&
                        members.length <= 4
                    );
                },

                message:
                    "Team must contain between 2 and 4 members",
            },
        },

        // =================================================
        // HACKATHON
        // =================================================

        hackathonTrack: {
            type: String,
            required: true,
            trim: true,
        },

        primaryTechnicalSkill: {
            type: String,
            required: true,
            trim: true,
        },

        // =================================================
        // PROJECT
        // =================================================
        // Project details are NOT collected during the
        // current registration/payment form.
        //
        // They can be submitted later using the project
        // submission flow.
        // =================================================

projectTitle: {
    type: String,
    default: null,
    trim: true,
},

projectDescription: {
    type: String,
    default: null,
    trim: true,
},

projectAbstract: {
    type: String,
    default: null,
    trim: true,
},

problemStatement: {
    type: String,
    default: null,
    trim: true,
},

proposedSolution: {
    type: String,
    default: null,
    trim: true,
},

techStack: {
    type: String,
    default: null,
    trim: true,
},

architectureDiagram: {
    type: String,
    default: null,
    trim: true,
},

expectedOutcome: {
    type: String,
    default: null,
    trim: true,
},

demoLink: {
    type: String,
    default: null,
    trim: true,
},

githubLink: {
    type: String,
    default: null,
    trim: true,
},

        // =================================================
        // PAYMENT
        // =================================================

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED",
            ],
            default: "PENDING",
        },

        amount: {
            type: Number,
            required: true,
        },

        razorpayOrderId: {
            type: String,
            default: null,
            unique: true,
            sparse: true,
            index: true,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
            unique: true,
            sparse: true,
            index: true,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        // =================================================
        // TERMS
        // =================================================

        termsAccepted: {
            type: Boolean,
            required: true,
            default: false,
        },
// =================================================
// HACKATHON STATUS
// =================================================

status: {
    type: String,
    enum: [
        "REGISTERED",
        "QUALIFIED",
        "SHORTLISTED",
        "SEMI_FINALIST",
        "FINALIST",
        "WINNER"
    ],
    default: "REGISTERED"
},
        // =================================================
        // PROJECT OTP AUTHENTICATION
        // =================================================

        projectOtpHash: {
            type: String,
            default: null,
        },

        projectOtpExpiresAt: {
            type: Date,
            default: null,
        },

        projectOtpAttempts: {
            type: Number,
            default: 0,
        },

        projectOtpLastSentAt: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
    "HackathonStudent",
    hackathonStudentSchema
);