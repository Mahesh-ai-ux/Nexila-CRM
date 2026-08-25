// const express = require('express');
// const router = express.Router();
// const Leadstatus=require('../models/Leadstatus')
// const auth = require('../middleware/auth');



// // ✅ GET all lead statuses
// router.get("/", auth, async (req, res) => {
//   try {
//     const statuses = await Leadstatus.find().sort({ createdAt: -1 });
//     return res.status(200).json({ success: true, data: statuses });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ ADD new status
// router.post("/", auth, async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ success: false, message: "Name is required" });

//     const exist = await Leadstatus.findOne({ name });
//     if (exist)
//       return res.status(400).json({ success: false, message: "Status already exists" });

//     const newStatus = new Leadstatus({ name });
//     await newStatus.save();
//     return res.status(201).json({ success: true, data: newStatus });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ UPDATE status
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     const updated = await Leadstatus.findByIdAndUpdate(id, { name }, { new: true });
//     if (!updated)
//       return res.status(404).json({ success: false, message: "Status not found" });

//     return res.status(200).json({ success: true, data: updated });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ DELETE status
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await Leadstatus.findByIdAndDelete(id);
//     if (!deleted)
//       return res.status(404).json({ success: false, message: "Status not found" });

//     return res.status(200).json({ success: true, message: "Deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const {
  createLeadStatus,
  getAllLeadStatuses,
  updateLeadStatus,
  deleteLeadStatus,
} = require("../controllers/leadstatusController");
const router = express.Router();

const auth = require('../middleware/auth');



// 🟢 CRUD Routes
router.post("/", auth, createLeadStatus);
router.get("/", auth, getAllLeadStatuses);
router.put("/:id", auth, updateLeadStatus);
router.delete("/:id", auth, deleteLeadStatus);

module.exports = router;
