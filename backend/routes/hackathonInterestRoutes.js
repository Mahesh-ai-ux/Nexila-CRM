const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  createHackathonInterest,
  getHackathonInterests,
  updateHackathonInterestStatus,
} = require("../controllers/hackathonInterestController");


// Public form
router.post("/", createHackathonInterest);


// CRM
router.get("/", authMiddleware,getHackathonInterests);


// CRM status update
router.patch("/:id/status", authMiddleware,updateHackathonInterestStatus);


module.exports = router;