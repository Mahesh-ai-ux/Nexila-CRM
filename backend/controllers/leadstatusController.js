
const Leadstatus = require("../models/Leadstatus.js");
// ✅ Create Lead Status
exports.createLeadStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Lead status name is required" });
    }

    const existing = await Leadstatus.findOne({ name });
    if (existing) {
      return res.status(400).json({ msg: "Lead status already exists" });
    }

    const leadStatus = new Leadstatus({ name });
    await leadStatus.save();

    return res.status(201).json({ msg: "Lead status created", data: leadStatus });
  } catch (err) {
    console.error("Error creating lead status: - leadstatusController.js:21", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get All Lead Statuses
exports.getAllLeadStatuses = async (req, res) => {
  try {
    const leadStatuses = await Leadstatus.find();
    return res.status(200).json(leadStatuses);
  } catch (err) {
    console.error("Error fetching lead statuses: - leadstatusController.js:32", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update Lead Status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const leadStatus = await Leadstatus.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!leadStatus) {
      return res.status(404).json({ msg: "Lead status not found" });
    }

    return res.status(200).json({ msg: "Lead status updated", data: leadStatus });
  } catch (err) {
    console.error("Error updating lead status: - leadstatusController.js:55", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Delete Lead Status
exports.deleteLeadStatus = async (req, res) => {
  try { 
    const { id } = req.params;
    const leadStatus = await Leadstatus.findByIdAndDelete(id);

    if (!leadStatus) {
      return res.status(404).json({ msg: "Lead status not found" });
    }

    return res.status(200).json({ msg: "Lead status deleted" });
  } catch (err) {
    console.error("Error deleting lead status: - leadstatusController.js:72", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

