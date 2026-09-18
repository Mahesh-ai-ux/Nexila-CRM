
// controllers/leadController.js
const mongoose = require("mongoose");
const NexilaID = require("../models/NexilaID");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Student = require("../models/Student");
const User = require("../models/User");
const axios = require("axios");
const Studentlog = require("../models/Studentlog");
const detectChanges = require("../utils/detectChanges");
const generateNexilaID = require("../utils/generateNexilaID");

const Leadlog = require("../models/leadlog"); //nexila changes
// ✅ Create Lead
exports.createLead = async (req, res) => {
  try {


    const data = { ...req.body };

    // ---------------- assignfrom ----------------
    if (data.assignfrom) {
      if (mongoose.Types.ObjectId.isValid(data.assignfrom)) {
        // already ObjectId → keep
        data.assignfrom = data.assignfrom;
      } else {
        // name → convert
        const user = await User.findOne({ name: data.assignfrom });
        data.assignfrom = user ? user._id : null;
      }
    } else {
      data.assignfrom = null;
    }

    // ---------------- assignto ----------------
    if (data.assignto) {
      if (mongoose.Types.ObjectId.isValid(data.assignto)) {
        data.assignto = data.assignto;
      } else {
        const user = await User.findOne({ name: data.assignto });
        data.assignto = user ? user._id : null;
      }
    } else {
      data.assignto = null;
    }

    console.log("✅ FINAL DATA:", data);



// Generate Nexila ID first
const nexilaData = await generateNexilaID();

console.log("Generated Nexila:", nexilaData);


// Create Lead
const newLead = new Lead({
  ...data,
   nexilaID: nexilaData.nexilaID,
  createdBy: req.user ? req.user._id : null,
});

await newLead.save();


// Save Nexila ID separately
await NexilaID.create({
    nexilaID: nexilaData.nexilaID,
    sequence: nexilaData.sequence,
    leadId: newLead._id,
    generatedDate: nexilaData.date
});


console.log("Lead ID:", newLead._id);
console.log("Nexila ID:", nexilaData.nexilaID);
    // ===============================

    await Leadlog.create({
      leadid: newLead._id,
      action: "create",
      updatedby: req.user?._id,
      changes: [
        { field: "name", oldvalue: "-", newvalue: newLead.name },
        { field: "phone", oldvalue: "-", newvalue: newLead.phone },
        { field: "leadstatus", oldvalue: "-", newvalue: newLead.leadstatus },
        { field: "assignto", oldvalue: "-", newvalue: newLead.assignto }
      ]
    });
    //nexila changes

    // --------------------------------------------------
    // 5️⃣ SYNC DEAL ON CREATE
    // --------------------------------------------------
    if (newLead.leadstatus === "Demo Scheduled") {
      await Deal.findOneAndUpdate(
        { leadId: newLead._id },
        { ...newLead.toObject(), leadId: newLead._id },
        { upsert: true, new: true }
      );
      console.log("📦 Deal created from Lead");
    }

    // --------------------------------------------------
    // 6️⃣ SYNC STUDENT ON CREATE
    // --------------------------------------------------
    if (newLead.leadstatus === "Student") {
      let student = await Student.findOne({ leadid: newLead._id });

      if (!student) {
        student = await Student.create({
          name: newLead.name,
          phone: newLead.phone,
          email: newLead.email,
          nexilaID: newLead.nexilaID, //nexila changes
          collegename: newLead.collegename,
          location: newLead.location,
          category: newLead.category,
          leadsource: newLead.leadsource,
          domain: newLead.domain,
          graduate: newLead.graduate,
          leadstatus: newLead.leadstatus,
          dateofjoin: newLead.dateofjoin,
          feetype: newLead.feetype,
          leadid: newLead._id,
          fees: Number(newLead.fees) || 0,
          feepaid: Number(newLead.feepaid) || 0,
          pendingfee:
            (Number(newLead.fees) || 0) -
            (Number(newLead.feepaid) || 0),
          assignto: newLead.assignto,
          lookingfor: newLead.lookingfor,
          noofday: newLead.noofday,
          internshipduration: newLead.internshipduration

        });

        console.log("student data:", student);
        // ✅ log creation
        await Studentlog.create({
          studentid: student._id,
          action: "create",
          source: "lead_create",
          updatedby: req.user?._id,
        });

        // create payment log if fee paid
        if (student.feepaid && Number(student.feepaid) > 0) {
          await Studentlog.create({
            studentid: student._id,
            action: "payment",
            source: "lead_create",
            payment: {
              amount: Number(student.feepaid),
              paymentMode: "cash",

            },
            updatedby: req.user?._id,
          });
        }
        console.log("Student and student log created");
      }
    }



    //  2️⃣ Prepare WhatsApp Number
    let phone = newLead.phone; // 🔴 make sure this field exists
    if (!phone) {
      return res.status(201).json({
        success: true,
        message: "Lead created (No phone to send WhatsApp)",
        data: newLead,
      });
    }

    // Convert to international format
    const whatsappId = phone.startsWith("91") ? phone : `91${phone}`;

    // 3️⃣ AUTO TRIGGER WhatsApp Message
    await axios.post(
      `${process.env.WATI_BASE_URL}/sendTemplateMessage` +
      `?whatsappNumber=${whatsappId}`,
      {

        template_name: "ds_dec13_link",
        broadcast_name: "auto_lead",
        parameters: [
          {
            name: "name",
            value: newLead.name,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WATI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then(res => {
        console.log("✅ WATI OK", res.data);
      })
      .catch(err => {
        console.log("❌ STATUS:", err.response?.status);
        console.log("❌ DATA:", err.response?.data);
      });

    console.log(data);

    // 4️⃣ Final Response
    res.status(201).json({
      success: true,
      message: "Lead created & WhatsApp sent automatically",
      data: newLead,
    });

  } catch (err) {
    console.error("❌ Error creating lead:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Lead created but WhatsApp failed",
    });
  }
};

// ✅ List Leads (Admin sees all, Employee sees only assigned/created)
// exports.listLeads = async (req, res) => {
//   try {
//     const userRole = req.user.role;
//     const userId = req.user._id;
//     let filter = {};

//     if (userRole !== "admin") {
//       filter = {
//         $or: [
//           { assignto: userId },
//           { assignfrom: userId },
//           { createdBy: userId },
//           { createdBy: null }, //nexila changes
//         ],
//       };
//     }

//     const leads = await Lead.find(filter)
//       .populate("assignfrom", "name email role")
//       .populate("assignto", "name email role")
//       .populate("createdBy", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: leads.length,
//       leads,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching leads:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// ✅ List Leads (Admin sees all, Employee sees assigned + created + public leads)
// exports.listLeads = async (req, res) => {
//   try {
//     const userRole = req.user.role;
//     const userId = req.user._id;

//     let filter = {};

//     // Admin sees everything
//     if (userRole === "admin") {
//       filter = {};
//     } 
//     else {
//       filter = {
//         $or: [
//           { assignto: userId },
//           { assignfrom: userId },
//           { createdBy: userId },

//           // ✅ PUBLIC LEADS (IMPORTANT FIX)
//           { createdBy: { $exists: false } },
//           { createdBy: null }
//         ],
//       };
//     }

//     const leads = await Lead.find(filter)
//       .populate("assignfrom", "name email role")
//       .populate("assignto", "name email role")
//       .populate("createdBy", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: leads.length,
//       leads,
//     });

//   } catch (err) {
//     console.error("❌ Error fetching leads:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

//fetch lead to all use fixed
exports.listLeads = async (req, res) => {
  try {

    const leads = await Lead.find({})
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

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const oldLead = await Lead.findById(id).lean(); //nexila changes

    console.log("✏️ Updating lead:", id);
    console.log("📦 Incoming:", req.body);

    const payload = { ...req.body };


    if (!payload.assignfrom || !mongoose.Types.ObjectId.isValid(payload.assignfrom)) {
      payload.assignfrom = null;
    }

    if (!payload.assignto || !mongoose.Types.ObjectId.isValid(payload.assignto)) {
      payload.assignto = null;
    }

    // --------------------------------------------------
    // 2️⃣ DATE NORMALIZATION
    // --------------------------------------------------
    payload.followdate = payload.followdate || null;
    payload.demodate = payload.demodate || null;

    // --------------------------------------------------
    // 3️⃣ UPDATE LEAD (NOW SAFE)
    // --------------------------------------------------
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    )
      .populate("assignfrom", "name email role")
      .populate("assignto", "name email role")
      .lean();


    if (!updatedLead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    console.log("✅ Lead updated");

    let changes = detectChanges(oldLead, updatedLead);

    // remove duplicate auto changes
    changes = changes.filter(
      c =>
        ![
          "leadstatus",
          "demodate",
          "followdate",
          "assignto",
          "assignfrom"
        ].includes(c.field)
    );

    // ---------- STATUS ----------
    if (
      String(oldLead.leadstatus || "") !==
      String(updatedLead.leadstatus || "")
    ) {
      changes.push({
        field: "leadstatus",
        oldvalue: oldLead.leadstatus || "-",
        newvalue: updatedLead.leadstatus || "-"
      });
    }

    // ---------- DEMO DATE ----------
    if (
      new Date(oldLead.demodate || 0).getTime() !==
      new Date(updatedLead.demodate || 0).getTime()
    ) {
      changes.push({
        field: "demodate",
        oldvalue: oldLead.demodate || "-",
        newvalue: updatedLead.demodate || "-"
      });
    }

    // ---------- FOLLOW DATE ----------
    if (
      new Date(oldLead.followdate || 0).getTime() !==
      new Date(updatedLead.followdate || 0).getTime()
    ) {
      changes.push({
        field: "followdate",
        oldvalue: oldLead.followdate || "-",
        newvalue: updatedLead.followdate || "-"
      });
    }

    // ---------- ASSIGN TO ----------
    if (
      String(oldLead.assignto || "") !==
      String(updatedLead.assignto?._id || "")
    ) {
      changes.push({
        field: "assignto",
        oldvalue: oldLead.assignto || "-",
        newvalue: updatedLead.assignto
      });
    }

    // ---------- ASSIGN FROM ----------
    if (
      String(oldLead.assignfrom || "") !==
      String(updatedLead.assignfrom?._id || "")
    ) {
      changes.push({
        field: "assignfrom",
        oldvalue: oldLead.assignfrom || "-",
        newvalue: updatedLead.assignfrom
      });
    }

    if (changes.length > 0) {
      await Leadlog.create({
        leadid: updatedLead._id,
        action: "update",
        updatedby: req.user?._id,
        changes
      });
    }
    //nexila changes

    // --------------------------------------------------
    // 4️⃣ SYNC DEAL
    // --------------------------------------------------
    const existingDeal = await Deal.findOne({ leadId: updatedLead._id });
    if (existingDeal) {
      await Deal.findOneAndUpdate(
        { leadId: updatedLead._id },
        updatedLead,
        { new: true }
      );
    }

    const existingStudent = await Student.findOne({
      leadId: updatedLead._id
    });

    console.log("Lead ID:", updatedLead._id);
    console.log("Lead Status:", updatedLead.leadstatus);
    console.log("Existing Student:", existingStudent);


    // CASE 1: leadstatus → Student (CREATE)
    if (updatedLead.leadstatus === "Student" && !existingStudent) {

      const studentData = {
        name: updatedLead.name,
        phone: updatedLead.phone,
        email: updatedLead.email,
        collegename: updatedLead.collegename,
        location: updatedLead.location,
        category: updatedLead.category,
        leadsource: updatedLead.leadsource,
        domain: updatedLead.domain,
        graduate: updatedLead.graduate,
        leadstatus: updatedLead.leadstatus,
        noofday: updatedLead.noofday,
        lookingfor: updatedLead.lookingfor,
        internshipduration: updatedLead.internshipduration,
        noofday: updatedLead.noofday,
        dateofjoin: updatedLead.dateofjoin,
        assignto: updatedLead.assignto,
        nexilaID: updatedLead.nexilaID, //nexila changes
        feetype: updatedLead.feetype,
        fees: Number(updatedLead.fees) || 0,
        feepaid: Number(updatedLead.feepaid),
        pendingfee:
          (Number(updatedLead.fees) || 0) -
          (Number(updatedLead.feepaid) || 0),

        leadId: updatedLead._id
      };

      const student = await Student.create(studentData);
      //nexila changes
      await NexilaID.findOneAndUpdate(
        {
          leadId: updatedLead._id
        },
        {
          studentId: student._id
        }
      );
      console.log("student data upadte:", student);

      // ✅ CREATE log (oldvalue = null)
      const changes = Object.keys(studentData).map(key => ({
        field: key,
        oldvalue: null,
        newvalue: studentData[key]
      }));

      await Studentlog.create({
        studentid: student._id,
        action: "create",
        changes,
        source: "lead_update",
        updatedby: req.user?._id,
      });
      paidDiff = student.feepaid;
      // payment log ONLY if payment increased
      if (paidDiff > 0) {
        await Studentlog.create({
          studentid: student._id,
          action: "payment",
          source: "lead_update",
          payment: {
            amount: paidDiff,      // ✅ only new amount
            paymentMode: "cash",
          },
          updatedby: req.user?._id,
        });
      }
    }

    if (updatedLead.leadstatus === "Student" && existingStudent) {

      const updateData = {
        name: updatedLead.name,
        phone: updatedLead.phone,
        email: updatedLead.email,
        collegename: updatedLead.collegename,
        location: updatedLead.location,
        category: updatedLead.category,
        leadsource: updatedLead.leadsource,
        domain: updatedLead.domain,
        graduate: updatedLead.graduate,
        leadstatus: updatedLead.leadstatus,
        lookingfor: updatedLead.lookingfor,
        internshipduration: updatedLead.internshipduration,
        noofday: updatedLead.noofday,
        dateofjoin: updatedLead.dateofjoin,
        feetype: updatedLead.feetype,
        fees: Number(updatedLead.fees) || 0,
        feepaid: Number(updatedLead.feepaid) || 0,
        pendingfee:
          (Number(updatedLead.fees) || 0) -
          (Number(updatedLead.feepaid) || 0),
        assignfrom: updatedLead.assignfrom,
        assignto: updatedLead.assignto,
        leadId: updatedLead._id,
        nexilaID: updatedLead.nexilaID //nexila changes
      };

      await Student.findByIdAndUpdate(
        existingStudent._id,
        updateData,
        { new: true }
      );
    }

    // --------------------------------------------------
    // 6️⃣ CREATE DEAL / STUDENT IF NEEDED
    // --------------------------------------------------
    if (updatedLead.leadstatus === "Demo Scheduled" && !existingDeal) {
      await Deal.create({ ...updatedLead, leadId: updatedLead._id });
    }

    // if (updatedLead.leadstatus === "Student" && !existingStudent) {
    //   await Student.create({ ...updatedLead, leadId: updatedLead._id });
    // }

    return res.json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });

  } catch (err) {
    console.error("❌ Error updating lead:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
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


//nexila changes
//nexila changes