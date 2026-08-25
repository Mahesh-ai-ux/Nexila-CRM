const express = require("express");

const router = express.Router();

const {
  createHackathonPaymentOrder,
  verifyHackathonPayment,

  getAllHackathonStudents,
  getHackathonStudent,
  createHackathonStudent,
  updateHackathonStudent,
  deleteHackathonStudent,
} = require("../controllers/hackathonController");

const authMiddleware =
  require("../middleware/auth");


// =====================================================
// PUBLIC PAYMENT
// =====================================================

router.post(
  "/public/create-order",
  createHackathonPaymentOrder
);

router.post(
  "/public/verify-payment",
  verifyHackathonPayment
);


// =====================================================
// CRM AUTHENTICATED
// =====================================================

router.get(
  "/",
  authMiddleware,
  getAllHackathonStudents
);

router.get(
  "/:id",
  authMiddleware,
  getHackathonStudent
);

router.post(
  "/",
  authMiddleware,
  createHackathonStudent
);

router.put(
  "/:id",
  authMiddleware,
  updateHackathonStudent
);

router.delete(
  "/:id",
  authMiddleware,
  deleteHackathonStudent
);


module.exports = router;