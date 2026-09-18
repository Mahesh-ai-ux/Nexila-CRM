const express = require("express");

const router = express.Router();

// =====================================================
// HACKATHON CONTROLLER
// =====================================================

const {
    createHackathonPaymentOrder,
    verifyHackathonPayment,

    createHackathonManualRegistration,



    getAllHackathonStudents,
    getHackathonStudent,
    createHackathonStudent,
    updateHackathonStudent,
    deleteHackathonStudent,
} = require("../controllers/hackathonController");

// =====================================================
// HACKATHON PROJECT CONTROLLER
// =====================================================

const {
    requestProjectOtp,
    verifyProjectOtp,
    getStudentProject,
    updateStudentProject,
} = require("../controllers/hackathonProjectController");

// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/auth");
const projectAccessMiddleware = require("../middleware/projectAccess");

// =====================================================
// PUBLIC HACKATHON PAYMENT
// =====================================================
router.post(
    "/public/manual-register",
    createHackathonManualRegistration
);

// Create Razorpay order
router.post(
    "/public/create-order",
    createHackathonPaymentOrder
);

// Verify Razorpay payment
router.post(
    "/public/verify-payment",
    verifyHackathonPayment
);

// =====================================================
// STUDENT PROJECT ACCESS
// =====================================================

// -----------------------------------------------------
// 1. Registration ID → Send OTP
// -----------------------------------------------------

router.post(
    "/student/request-otp",
    requestProjectOtp
);

// -----------------------------------------------------
// 2. Registration ID + OTP → Generate Access Token
// -----------------------------------------------------

router.post(
    "/student/verify-otp",
    verifyProjectOtp
);

// -----------------------------------------------------
// 3. Access Token → Get Project Details
// -----------------------------------------------------

router.get(
    "/student/project/:registrationId",
    // projectAccessMiddleware,
    getStudentProject
);

// -----------------------------------------------------
// 4. Access Token → Update Project Details
// -----------------------------------------------------

router.patch(
    "/student/project/:registrationId",
    // projectAccessMiddleware,
    updateStudentProject
);

// =====================================================
// CRM / ADMIN HACKATHON STUDENT ROUTES
// =====================================================

// -----------------------------------------------------
// GET ALL
// -----------------------------------------------------

router.get(
    "/",
    authMiddleware,
    getAllHackathonStudents
);

// -----------------------------------------------------
// GET ONE
// -----------------------------------------------------

router.get(
    "/:id",
    authMiddleware,
    getHackathonStudent
);

// -----------------------------------------------------
// CREATE
// -----------------------------------------------------

router.post(
    "/",
    authMiddleware,
    createHackathonStudent
);

// -----------------------------------------------------
// UPDATE
// -----------------------------------------------------

router.put(
    "/:id",
    authMiddleware,
    updateHackathonStudent
);

// -----------------------------------------------------
// DELETE
// -----------------------------------------------------

router.delete(
    "/:id",
    authMiddleware,
    deleteHackathonStudent
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;