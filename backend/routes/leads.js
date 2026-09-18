const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const leadController = require("../controllers/leadController");

const Studentlog = require("../models/Studentlog");
const Leadlog = require("../models/leadlog");
const Student = require("../models/Student");


// CREATE
router.post("/create", auth, leadController.createLead);

//create public - nexila changes - 28/4/2026
router.post("/create-public", leadController.createLead);
// LIST
router.get("/", auth, leadController.listLeads);

// RECENT
router.get("/recent/list", auth, leadController.recentLeads);


// ✅ COMBINED LOGS
router.get("/logs/:leadId", auth, async (req, res) => {
  try {
    const leadId = req.params.leadId;

    // 1️⃣ Lead logs
    const leadLogs = await Leadlog.find({
      leadid: leadId
    }).lean();

    // 2️⃣ Find student from lead
    const student = await Student.findOne({
      leadId: leadId
    });

    let studentLogs = [];

    if (student) {
      studentLogs = await Studentlog.find({
        studentid: student._id
      }).lean();
    }

    // 3️⃣ Merge + Sort
    const logs = [...leadLogs, ...studentLogs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      logs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// SINGLE LEAD
router.get("/:id", auth, leadController.getLead);

// UPDATE
router.put("/:id", auth, leadController.updateLead);

// DELETE
router.delete("/:id", auth, leadController.deleteLead);

module.exports = router;

//nexila change