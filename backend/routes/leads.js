// routes/leads.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const leadController = require("../controllers/leadController");

// ✅ Create Lead
router.post("/create", auth, leadController.createLead);

// ✅ List Leads (Admin/Employee logic handled inside controller)
router.get("/", auth, leadController.listLeads);

// ✅ Get Single Lead
router.get("/:id", auth, leadController.getLead);

// ✅ Update Lead
router.put("/:id", auth, leadController.updateLead);

// ✅ Delete Lead
router.delete("/:id", auth, leadController.deleteLead);

// ✅ Recent Leads
router.get("/recent/list", auth, leadController.recentLeads);

module.exports = router;
