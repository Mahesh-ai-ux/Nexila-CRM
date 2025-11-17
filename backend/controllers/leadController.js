// controllers/leadController.js
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Student = require("../models/Student");
const User = require("../models/User"); 

// ✅ Create Lead
exports.createLead = async (req, res) => {
  try {
    console.log("📥 Creating Lead:", req.body);

    const newLead = new Lead({
      ...req.body,
      createdBy: req.user ? req.user._id : null, 
      // store creator if authenticated
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (err) {
    console.error("❌ Error creating lead:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ List Leads (Admin sees all, Employee sees only assigned/created)
exports.listLeads = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;
    let filter = {};

    if (userRole !== "admin") {
      filter = {
        $or: [
          { assignto: userId },
          { assignfrom: userId },
          { createdBy: userId },
        ],
      };
    }

    const leads = await Lead.find(filter)
      .populate("assignfrom", "name email role")
      .populate("assignto", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err) {
    console.error("❌ Error fetching leads:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignfrom", "name email role")
      .populate("assignto", "name email role")
      .populate("createdBy", "name email role");

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({ success: true, lead });
  } catch (err) {
    console.error("❌ Error fetching lead:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("✏️ Updating lead with ID:", id);
    console.log("📦 Incoming data:", req.body);

    // 1️⃣ Convert names → ObjectId
    if (req.body.assignfrom && typeof req.body.assignfrom === "string") {
      const fromUser = await User.findOne({ name: req.body.assignfrom });
      if (fromUser) req.body.assignfrom = fromUser._id;
    }

    if (req.body.assignto && typeof req.body.assignto === "string") {
      const toUser = await User.findOne({ name: req.body.assignto });
      if (toUser) req.body.assignto = toUser._id;
    }

    // 2️⃣ Update Lead
    const updatedLead = await Lead.findByIdAndUpdate(id,  {
    ...req.body,  // this includes followdate & demodate
    followdate: req.body.followdate || null,
    demodate: req.body.demodate || null,
  }, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    console.log("✅ Lead updated:", updatedLead);

    // ------------------------------------------------------------------
    // 3️⃣ SYNC changes to Deal (if exists)
    // ------------------------------------------------------------------
    const existingDeal = await Deal.findOne({ leadId: updatedLead._id });

    if (existingDeal) {
      await Deal.findOneAndUpdate(
        { leadId: updatedLead._id },
        {
          name: updatedLead.name,
          phone: updatedLead.phone,
          email: updatedLead.email,
          domain: updatedLead.domain,
          category: updatedLead.category,
          leadsource: updatedLead.leadsource,
          leadstatus: updatedLead.leadstatus,
          location: updatedLead.location,
          assignfrom: updatedLead.assignfrom,
          assignto: updatedLead.assignto,
          followdate: updatedLead.followdate,   // ADD THIS
          demodate: updatedLead.demodate,  
         
        },
        { new: true }
      );

      console.log("🔄 Deal synced with updated lead");
    }

    // ------------------------------------------------------------------
    // 4️⃣ SYNC changes to Student (if exists)
    // ------------------------------------------------------------------
    const existingStudent = await Student.findOne({ leadId: updatedLead._id });

    if (existingStudent) {
      await Student.findOneAndUpdate(
        { leadId: updatedLead._id },
        {
          name: updatedLead.name,
          phone: updatedLead.phone,
          email: updatedLead.email,
          domain: updatedLead.domain,
          category: updatedLead.category,
          leadsource: updatedLead.leadsource,
          leadstatus: updatedLead.leadstatus,
          location: updatedLead.location,
          assignfrom: updatedLead.assignfrom,
          assignto: updatedLead.assignto,
          followdate: updatedLead.followdate,   // ADD THIS
          demodate: updatedLead.demodate,  
        },
        { new: true }
      );

      console.log("🔄 Student synced with updated lead");
    }

    // ------------------------------------------------------------------
    // 5️⃣ Move to Deal if needed
    // ------------------------------------------------------------------
    if (updatedLead.leadstatus === "Demo Scheduled" && !existingDeal) {
      await Deal.create({
        ...updatedLead,
        leadId: updatedLead._id,
        followdate: updatedLead.followdate,
        demodate: updatedLead.demodate,
      });

      console.log("📦 New Deal created");
    }

    // ------------------------------------------------------------------
    // 6️⃣ Move to Student if needed
    // ------------------------------------------------------------------
    if (updatedLead.leadstatus === "Student" && !existingStudent) {
      await Student.create({
        ...updatedLead,
        leadId: updatedLead._id,
        followdate: updatedLead.followdate,
        demodate: updatedLead.demodate,
      });

      console.log("🎓 New Student created");
    }

    // ------------------------------------------------------------------
    // 7️⃣ Send Response
    // ------------------------------------------------------------------
    return res.json({
      success: true,
      message: "Lead updated and synced successfully",
      lead: updatedLead,
    });
  } catch (err) {
    console.error("❌ Error updating lead:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    await Lead.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting lead:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Recent Leads (last 30 days)
exports.recentLeads = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leads = await Lead.find({ createdAt: { $gte: thirtyDaysAgo } })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, leads });
  } catch (err) {
    console.error("❌ Error fetching recent leads:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
