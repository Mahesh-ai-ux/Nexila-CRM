const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

// Public payment endpoints for the internship website.
// Add rate limiting to these routes before production use.
router.post("/create-order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;