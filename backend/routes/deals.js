// routes/deals.js
const express = require("express");
const router = express.Router();
const { getAllDeals } = require("../controllers/dealController");
const auth = require("../middleware/auth");
// ✅ Get all deals route
router.get("/", auth, getAllDeals);

module.exports = router;
