
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

const generateGroupInternshipID = require(
  "../utils/generateGroupInternshipID"
);

exports.createLead = async (req, res) => {
  try {
    const data = { ...req.body };

    // -----------------------------------------------
    // 1. ASSIGN FROM
    // -----------------------------------------------
    if (data.assignfrom) {
      if (!mongoose.Types.ObjectId.isValid(data.assignfrom)) {
        const user = await User.findOne({ name: data.assignfrom });
        data.assignfrom = user ? user._id : null;
      }
    } else {
      data.assignfrom = null;
    }

    // -----------------------------------------------
    // 2. ASSIGN TO
    // -----------------------------------------------
    if (data.assignto) {
      if (!mongoose.Types.ObjectId.isValid(data.assignto)) {
        const user = await User.findOne({ name: data.assignto });
        data.assignto = user ? user._id : null;
      }
    } else {
      data.assignto = null;
    }

    // ----------------------------------------------
    // 3. PAYMENT METHOD
    // Existing CRM requests without paymentMethod
    // continue using the MANUAL model default.
    // -----------------------------------------------
    const paymentMethod =
      String(data.paymentMethod || "MANUAL").toUpperCase();

    if (!["RAZORPAY", "MANUAL"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    data.paymentMethod = paymentMethod;

    if (paymentMethod === "RAZORPAY") {
      // Website Razorpay applications always begin
      // as New Lead with pending payment.
      data.leadstatus = "New Lead";
      data.paymentStatus = "PENDING";

      // Never accept payment verification details
      // directly from the frontend.
      delete data.razorpayOrderId;
      delete data.razorpayPaymentId;
      delete data.razorpaySignature;
      delete data.paidAt;

      data.paymentReference = null;
    } else {
      // Preserve the existing CRM lead status and
      // other existing manual-entry behaviour.
      data.paymentStatus = data.paymentStatus || "PENDING";

      // Do not accept Razorpay verification details
      // for a manual payment.
      delete data.razorpayOrderId;
      delete data.razorpayPaymentId;
      delete data.razorpaySignature;
      delete data.paidAt;
    }

    console.log("FINAL LEAD DATA: - leadController.js:93", data);

    // -----------------------------------------------
    // 4. GENERATE NEXILA ID
    // -----------------------------------------------
    const nexilaData = await generateNexilaID();

    console.log("Generated Nexila: - leadController.js:100", nexilaData);

    // Use the permanent Nexila ID as the payment reference.
    if (paymentMethod === "RAZORPAY") {
      data.paymentReference = `Pending_${nexilaData.nexilaID}`;
    } else if (
      data.paymentStatus === "PAID" &&
      data.paymentMethod === "MANUAL"
    ) {
      data.paymentReference = `Manual_${nexilaData.nexilaID}`;
    } else {
      // Preserve an existing supplied reference if present.
      data.paymentReference =
        data.paymentReference || `Manual_${nexilaData.nexilaID}`;
    }

    // -----------------------------------------------
    // 5. CREATE LEAD
    // -----------------------------------------------
    const newLead = new Lead({
      ...data,
      nexilaID: nexilaData.nexilaID,
      createdBy: req.user ? req.user._id : null,
    });

    await newLead.save();

    // -----------------------------------------------
    // 6. SAVE NEXILA ID RECORD
    // -----------------------------------------------
    await NexilaID.create({
      nexilaID: nexilaData.nexilaID,
      sequence: nexilaData.sequence,
      leadId: newLead._id,
      generatedDate: nexilaData.date,
    });

    console.log("Lead ID: - leadController.js:137", newLead._id);
    console.log("Nexila ID: - leadController.js:138", newLead.nexilaID);
    console.log("Payment Method: - leadController.js:139", newLead.paymentMethod);
    console.log("Payment Status: - leadController.js:140", newLead.paymentStatus);
    console.log("Payment Reference: - leadController.js:141", newLead.paymentReference);

    // -----------------------------------------------
    // 7. CREATE LEAD LOG
    // -----------------------------------------------
    await Leadlog.create({
      leadid: newLead._id,
      action: "create",
      updatedby: req.user?._id,
      changes: [
        {
          field: "name",
          oldvalue: "-",
          newvalue: newLead.name,
        },
        {
          field: "phone",
          oldvalue: "-",
          newvalue: newLead.phone,
        },
        {
          field: "leadstatus",
          oldvalue: "-",
          newvalue: newLead.leadstatus,
        },
        {
          field: "assignto",
          oldvalue: "-",
          newvalue: newLead.assignto,
        },
      ],
    });

    // -----------------------------------------------
    // 8. EXISTING DEAL SYNC
    // -----------------------------------------------
    if (newLead.leadstatus === "Demo Scheduled") {
      await Deal.findOneAndUpdate(
        { leadId: newLead._id },
        {
          ...newLead.toObject(),
          leadId: newLead._id,
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log("Deal created from Lead - leadController.js:190");
    }

    // -----------------------------------------------
    // 9. EXISTING STUDENT SYNC
    // -----------------------------------------------
    if (newLead.leadstatus === "Student") {
      let student = await Student.findOne({
        leadId: newLead._id,
      });

      if (!student) {
        student = await Student.create({
          name: newLead.name,
          phone: newLead.phone,
          email: newLead.email,
          nexilaID: newLead.nexilaID,
          collegename: newLead.collegename,
          collegeRegisterId: newLead.collegeRegisterId,
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
          internshipduration: newLead.internshipduration,

          // Copy payment information when creating a Student.
          paymentStatus: newLead.paymentStatus,
          paymentMethod: newLead.paymentMethod,
          paymentReference: newLead.paymentReference,
          razorpayOrderId: newLead.razorpayOrderId,
          razorpayPaymentId: newLead.razorpayPaymentId,
          razorpaySignature: newLead.razorpaySignature,
          paidAt: newLead.paidAt,
        });

        await Studentlog.create({
          studentid: student._id,
          action: "create",
          source: "lead_create",
          updatedby: req.user?._id,
        });

        // Preserve existing payment-log behaviour.
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

        console.log("Student and student log created - leadController.js:259");
      }
    }

    // -----------------------------------------------
    // 10. EXISTING WHATSAPP MESSAGE
    // -----------------------------------------------
    const phone = newLead.phone;

    if (!phone) {
      return res.status(201).json({
        success: true,
        message: "Lead created (No phone to send WhatsApp)",
        data: newLead,
      });
    }

    const whatsappId = phone.startsWith("91")
      ? phone
      : `91${phone}`;

    try {
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
      );

      console.log("WATI message sent successfully - leadController.js:302");
    } catch (err) {
      // WhatsApp failure should not undo a saved lead.
      console.log("WATI STATUS: - leadController.js:305", err.response?.status);
      console.log("WATI DATA: - leadController.js:306", err.response?.data);
    }

    // -----------------------------------------------
    // 11. FINAL RESPONSE
    // -----------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (err) {
    console.error(
      "Error creating lead:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createGroupInternship = async (req, res) => {
  try {
    const {
      college,
      location,
      graduate,
      year,
      domain,
      dateofjoin,
      duration,
      members,
    } = req.body;

    // --------------------------------
    // 1. VALIDATE GROUP
    // --------------------------------

    if (
  !Array.isArray(members) ||
  members.length < 6 ||
  members.length > 15
) {
  return res.status(400).json({
    success: false,
    message: "A group must contain minimum 6 and maximum 15 members.",
  });
}

    if (
      !college ||
      !location ||
      !graduate ||
      !year ||
      !domain ||
      !dateofjoin ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all common group details.",
      });
    }

    // --------------------------------
    // 2. VALIDATE JOINING DATE
    // --------------------------------

    const joiningDate = new Date(`${dateofjoin}T00:00:00Z`);

    if (
      Number.isNaN(joiningDate.getTime()) ||
      joiningDate.getUTCDay() !== 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Joining date must be a Wednesday.",
      });
    }

    // --------------------------------
    // 3. GROUP PRICING
    // --------------------------------

    const GROUP_PRICING = {
      15: {
        amount: 1299,
        days: "15 days",
        programme: "Group Internship",
      },

      30: {
        amount: 2150,
        days: "30 days",
        programme: "Group Internship",
      },

      60: {
        amount: 4500,
        days: "60 days",
        programme: "Group Internship",
      },

      90: {
        amount: 6899,
        days: "90 days",
        programme: "Group Internship",
      },
    };

    const selectedPlan = GROUP_PRICING[String(duration)];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid internship duration.",
      });
    }

    // --------------------------------
    // 4. VALIDATE EACH MEMBER
    // --------------------------------

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      if (
        !member.name?.trim() ||
        !member.phone?.trim() ||
        !member.email?.trim() ||
        !member.collegeRegisterId?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `Please complete all details for Member ${i + 1}.`,
        });
      }

      if (!/^\d{10}$/.test(member.phone.trim())) {
        return res.status(400).json({
          success: false,
          message: `Invalid phone number for Member ${i + 1}.`,
        });
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid email for Member ${i + 1}.`,
        });
      }
    }

    // --------------------------------
    // 5. GENERATE ONE GROUP ID
    // --------------------------------

    const groupInternshipId =
      await generateGroupInternshipID();

    console.log("GROUP ID: - leadController.js:471", groupInternshipId);

    // --------------------------------
    // 6. CREATE SIX INDIVIDUAL LEADS
    // --------------------------------

    const createdLeads = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      const crmData = {
        // Individual details
        name: member.name.trim(),
        phone: member.phone.trim(),
        email: member.email.trim(),

        collegeRegisterId:
          member.collegeRegisterId.trim(),

        // Common details
        collegename: college,
        location,
        graduate,
        category: year,
        domain,

        dateofjoin: joiningDate,

        internshipduration: selectedPlan.days,
        noofday: selectedPlan.days,

        lookingfor: selectedPlan.programme,

        // Individual fee
        fees: String(selectedPlan.amount),
        feepaid: "0",
        pendingfee: String(selectedPlan.amount),

        // Existing CRM fields
        leadstatus: "New Lead",
        leadsource: "Website",

        joinstatus: null,
        notes: null,
        remark: null,
        domainreason: null,
        dropreason: null,

        followdate: null,
        demodate: null,

        feetype: null,
        assignfrom: null,
        assignto: null,

        // Payment
        paymentMethod: "MANUAL",
        paymentStatus: "PENDING",

        paymentReference: null,

        // IMPORTANT: Same ID for all six leads
        groupInternshipId,
      };

      // --------------------------------
      // REUSE EXISTING createLead
      // --------------------------------

      // const fakeReq = {
      //   ...req,
      //   body: crmData,
      // };
const fakeReq = {
  ...req,
  user: req.user || null,
  body: crmData,
};
      const fakeRes = {
        statusCode: 200,
        responseData: null,

        status(code) {
          this.statusCode = code;
          return this;
        },

        json(data) {
          this.responseData = data;
          return this;
        },
      };

      await exports.createLead(fakeReq, fakeRes);

      // --------------------------------
      // CHECK LEAD CREATION
      // --------------------------------

      if (
        fakeRes.statusCode !== 201 ||
        !fakeRes.responseData?.success
      ) {
        return res.status(500).json({
          success: false,
          message: `Unable to create Member ${i + 1}.`,
          groupInternshipId,
          createdLeads,
          failedMember: i + 1,
          error: fakeRes.responseData?.message,
        });
      }

      const savedLead =
        fakeRes.responseData.data;

      createdLeads.push({
        name: savedLead.name,
        leadId: savedLead._id,
        nexilaID: savedLead.nexilaID,
        groupInternshipId:
          savedLead.groupInternshipId,
        fees: savedLead.fees,
        paymentStatus: savedLead.paymentStatus,
      });
    }

    // --------------------------------
    // 7. FINAL RESPONSE
    // --------------------------------

    return res.status(201).json({
      success: true,
      message: "Group internship registered successfully.",

      groupInternshipId,

      totalMembers: createdLeads.length,

      duration: selectedPlan.days,

      perPersonFee: selectedPlan.amount,

      groupTotal:
        selectedPlan.amount * createdLeads.length,

      data: createdLeads,
    });

  } catch (error) {
    console.error("Group Internship Error: - leadController.js:622", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.createLead = async (req, res) => {
//   try {


//     const data = { ...req.body };

//     // ---------------- assignfrom ----------------
//     if (data.assignfrom) {
//       if (mongoose.Types.ObjectId.isValid(data.assignfrom)) {
//         // already ObjectId → keep
//         data.assignfrom = data.assignfrom;
//       } else {
//         // name → convert
//         const user = await User.findOne({ name: data.assignfrom });
//         data.assignfrom = user ? user._id : null;
//       }
//     } else {
//       data.assignfrom = null;
//     }

//     // ---------------- assignto ----------------
//     if (data.assignto) {
//       if (mongoose.Types.ObjectId.isValid(data.assignto)) {
//         data.assignto = data.assignto;
//       } else {
//         const user = await User.findOne({ name: data.assignto });
//         data.assignto = user ? user._id : null;
//       }
//     } else {
//       data.assignto = null;
//     }

//     console.log("✅ FINAL DATA:", data);



// // Generate Nexila ID first
// const nexilaData = await generateNexilaID();

// console.log("Generated Nexila:", nexilaData);


// // Create Lead
// const newLead = new Lead({
//   ...data,
//    nexilaID: nexilaData.nexilaID,
//   createdBy: req.user ? req.user._id : null,
// });

// await newLead.save();


// // Save Nexila ID separately
// await NexilaID.create({
//     nexilaID: nexilaData.nexilaID,
//     sequence: nexilaData.sequence,
//     leadId: newLead._id,
//     generatedDate: nexilaData.date
// });


// console.log("Lead ID:", newLead._id);
// console.log("Nexila ID:", nexilaData.nexilaID);
//     // ===============================

//     await Leadlog.create({
//       leadid: newLead._id,
//       action: "create",
//       updatedby: req.user?._id,
//       changes: [
//         { field: "name", oldvalue: "-", newvalue: newLead.name },
//         { field: "phone", oldvalue: "-", newvalue: newLead.phone },
//         { field: "leadstatus", oldvalue: "-", newvalue: newLead.leadstatus },
//         { field: "assignto", oldvalue: "-", newvalue: newLead.assignto }
//       ]
//     });
//     //nexila changes

//     // --------------------------------------------------
//     // 5️⃣ SYNC DEAL ON CREATE
//     // --------------------------------------------------
//     if (newLead.leadstatus === "Demo Scheduled") {
//       await Deal.findOneAndUpdate(
//         { leadId: newLead._id },
//         { ...newLead.toObject(), leadId: newLead._id },
//         { upsert: true, new: true }
//       );
//       console.log("📦 Deal created from Lead");
//     }

//     // --------------------------------------------------
//     // 6️⃣ SYNC STUDENT ON CREATE
//     // --------------------------------------------------
//     if (newLead.leadstatus === "Student") {
//       let student = await Student.findOne({ leadid: newLead._id });

//       if (!student) {
//         student = await Student.create({
//           name: newLead.name,
//           phone: newLead.phone,
//           email: newLead.email,
//           nexilaID: newLead.nexilaID, //nexila changes
//           collegename: newLead.collegename,
//           collegeRegisterId: newLead.collegeRegisterId,
//           location: newLead.location,
//           category: newLead.category,
//           leadsource: newLead.leadsource,
//           domain: newLead.domain,
//           graduate: newLead.graduate,
//           leadstatus: newLead.leadstatus,
//           dateofjoin: newLead.dateofjoin,
//           feetype: newLead.feetype,
//           leadid: newLead._id,
//           fees: Number(newLead.fees) || 0,
//           feepaid: Number(newLead.feepaid) || 0,
//           pendingfee:
//             (Number(newLead.fees) || 0) -
//             (Number(newLead.feepaid) || 0),
//           assignto: newLead.assignto,
//           lookingfor: newLead.lookingfor,
//           noofday: newLead.noofday,
//           internshipduration: newLead.internshipduration

//         });

//         console.log("student data:", student);
//         // ✅ log creation
//         await Studentlog.create({
//           studentid: student._id,
//           action: "create",
//           source: "lead_create",
//           updatedby: req.user?._id,
//         });

//         // create payment log if fee paid
//         if (student.feepaid && Number(student.feepaid) > 0) {
//           await Studentlog.create({
//             studentid: student._id,
//             action: "payment",
//             source: "lead_create",
//             payment: {
//               amount: Number(student.feepaid),
//               paymentMode: "cash",

//             },
//             updatedby: req.user?._id,
//           });
//         }
//         console.log("Student and student log created");
//       }
//     }



//     //  2️⃣ Prepare WhatsApp Number
//     let phone = newLead.phone; // 🔴 make sure this field exists
//     if (!phone) {
//       return res.status(201).json({
//         success: true,
//         message: "Lead created (No phone to send WhatsApp)",
//         data: newLead,
//       });
//     }

//     // Convert to international format
//     const whatsappId = phone.startsWith("91") ? phone : `91${phone}`;

//     // 3️⃣ AUTO TRIGGER WhatsApp Message
//     await axios.post(
//       `${process.env.WATI_BASE_URL}/sendTemplateMessage` +
//       `?whatsappNumber=${whatsappId}`,
//       {

//         template_name: "ds_dec13_link",
//         broadcast_name: "auto_lead",
//         parameters: [
//           {
//             name: "name",
//             value: newLead.name,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WATI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     )
//       .then(res => {
//         console.log("✅ WATI OK", res.data);
//       })
//       .catch(err => {
//         console.log("❌ STATUS:", err.response?.status);
//         console.log("❌ DATA:", err.response?.data);
//       });

//     console.log(data);

//     // 4️⃣ Final Response
//     res.status(201).json({
//       success: true,
//       message: "Lead created & WhatsApp sent automatically",
//       data: newLead,
//     });

//   } catch (err) {
//     console.error("❌ Error creating lead:", err.response?.data || err.message);
//     res.status(500).json({
//       success: false,
//       message: "Lead created but WhatsApp failed",
//     });
//   }
// };

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
    console.error("❌ Error fetching leads: - leadController.js:943", err.message);
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
    console.error("❌ Error fetching lead: - leadController.js:962", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const oldLead = await Lead.findById(id).lean();

    if (!oldLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    console.log("✏️ Updating lead: - leadController.js:980", id);
    console.log("📦 Incoming: - leadController.js:981", req.body);

    const payload = { ...req.body };

    if (
      !payload.assignfrom ||
      !mongoose.Types.ObjectId.isValid(payload.assignfrom)
    ) {
      payload.assignfrom = null;
    }

    if (
      !payload.assignto ||
      !mongoose.Types.ObjectId.isValid(payload.assignto)
    ) {
      payload.assignto = null;
    }

    payload.followdate = payload.followdate || null;
    payload.demodate = payload.demodate || null;

    // --------------------------------------------------
    // 1. UPDATE LEAD
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
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    console.log("✅ Lead updated - leadController.js:1021");

    // --------------------------------------------------
    // 2. LEAD CHANGE LOG
    // --------------------------------------------------
    let changes = detectChanges(oldLead, updatedLead);

    changes = changes.filter(
      (c) =>
        ![
          "leadstatus",
          "demodate",
          "followdate",
          "assignto",
          "assignfrom",
        ].includes(c.field)
    );

    if (
      String(oldLead.leadstatus || "") !==
      String(updatedLead.leadstatus || "")
    ) {
      changes.push({
        field: "leadstatus",
        oldvalue: oldLead.leadstatus || "-",
        newvalue: updatedLead.leadstatus || "-",
      });
    }

    if (
      new Date(oldLead.demodate || 0).getTime() !==
      new Date(updatedLead.demodate || 0).getTime()
    ) {
      changes.push({
        field: "demodate",
        oldvalue: oldLead.demodate || "-",
        newvalue: updatedLead.demodate || "-",
      });
    }

    if (
      new Date(oldLead.followdate || 0).getTime() !==
      new Date(updatedLead.followdate || 0).getTime()
    ) {
      changes.push({
        field: "followdate",
        oldvalue: oldLead.followdate || "-",
        newvalue: updatedLead.followdate || "-",
      });
    }

    if (
      String(oldLead.assignto || "") !==
      String(updatedLead.assignto?._id || "")
    ) {
      changes.push({
        field: "assignto",
        oldvalue: oldLead.assignto || "-",
        newvalue: updatedLead.assignto || null,
      });
    }

    if (
      String(oldLead.assignfrom || "") !==
      String(updatedLead.assignfrom?._id || "")
    ) {
      changes.push({
        field: "assignfrom",
        oldvalue: oldLead.assignfrom || "-",
        newvalue: updatedLead.assignfrom || null,
      });
    }

    if (changes.length > 0) {
      await Leadlog.create({
        leadid: updatedLead._id,
        action: "update",
        updatedby: req.user?._id,
        changes,
      });
    }

    // --------------------------------------------------
    // 3. SYNC DEAL
    // --------------------------------------------------
    const existingDeal = await Deal.findOne({
      leadId: updatedLead._id,
    });

    if (existingDeal) {
      await Deal.findOneAndUpdate(
        { leadId: updatedLead._id },
        { $set: { ...updatedLead, leadId: updatedLead._id } },
        { new: true }
      );
    }

    // --------------------------------------------------
    // 4. FIND EXISTING STUDENT
    // --------------------------------------------------
    let existingStudent = await Student.findOne({
      leadId: updatedLead._id,
    });

    console.log("Lead ID: - leadController.js:1125", updatedLead._id);
    console.log("Lead Status: - leadController.js:1126", updatedLead.leadstatus);
    console.log("Existing Student: - leadController.js:1127", existingStudent?._id || null);

    // --------------------------------------------------
    // 5. CREATE OR UPDATE STUDENT
    // --------------------------------------------------
    if (updatedLead.leadstatus === "Student") {
      const studentData = {
        name: updatedLead.name,
        phone: updatedLead.phone,
        email: updatedLead.email,
        collegename: updatedLead.collegename,
        collegeRegisterId: updatedLead.collegeRegisterId,
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
        assignfrom: updatedLead.assignfrom?._id || updatedLead.assignfrom || null,
        assignto: updatedLead.assignto?._id || updatedLead.assignto || null,
        nexilaID: updatedLead.nexilaID,
        feetype: updatedLead.feetype,
        fees: Number(updatedLead.fees) || 0,
        feepaid: Number(updatedLead.feepaid) || 0,
        pendingfee:
          (Number(updatedLead.fees) || 0) -
          (Number(updatedLead.feepaid) || 0),
        leadId: updatedLead._id,
      };

      // Copy Razorpay identifiers only when they contain real values.
      // Never explicitly insert null for unique Razorpay fields.
      if (updatedLead.razorpayOrderId) {
        studentData.razorpayOrderId = updatedLead.razorpayOrderId;
      }

      if (
        updatedLead.razorpayPaymentId &&
        !String(updatedLead.razorpayPaymentId).startsWith("PENDING_")
      ) {
        studentData.razorpayPaymentId = updatedLead.razorpayPaymentId;
      }

      if (updatedLead.paymentMethod) {
        studentData.paymentMethod = updatedLead.paymentMethod;
      }

      if (updatedLead.paymentStatus) {
        studentData.paymentStatus = updatedLead.paymentStatus;
      }

      if (updatedLead.paymentReference) {
        studentData.paymentReference = updatedLead.paymentReference;
      }

      if (updatedLead.paidAt) {
        studentData.paidAt = updatedLead.paidAt;
      }

      if (!existingStudent) {
        // CREATE STUDENT
        const student = await Student.create(studentData);

        existingStudent = student;

        await NexilaID.findOneAndUpdate(
          { leadId: updatedLead._id },
          { $set: { studentId: student._id } }
        );

        console.log("✅ Student created: - leadController.js:1201", student._id);

        const studentChanges = Object.keys(studentData).map((key) => ({
          field: key,
          oldvalue: null,
          newvalue: studentData[key],
        }));

        await Studentlog.create({
          studentid: student._id,
          action: "create",
          changes: studentChanges,
          source: "lead_update",
          updatedby: req.user?._id,
        });

        const paidDiff = Number(student.feepaid) || 0;

        if (paidDiff > 0) {
          await Studentlog.create({
            studentid: student._id,
            action: "payment",
            source: "lead_update",
            payment: {
              amount: paidDiff,
              paymentMode: "cash",
            },
            updatedby: req.user?._id,
          });
        }
      } else {
        // UPDATE EXISTING STUDENT
        await Student.findByIdAndUpdate(
          existingStudent._id,
          { $set: studentData },
          { new: true, runValidators: true }
        );

        console.log("✅ Existing Student updated: - leadController.js:1239", existingStudent._id);
      }
    }

    // --------------------------------------------------
    // 6. CREATE DEAL WHEN DEMO IS SCHEDULED
    // --------------------------------------------------
    if (updatedLead.leadstatus === "Demo Scheduled" && !existingDeal) {
      await Deal.create({
        ...updatedLead,
        leadId: updatedLead._id,
      });
    }

    return res.json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (err) {
    console.error("❌ Error updating lead: - leadController.js:1259", err);

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
    console.error("❌ Error deleting lead: - leadController.js:1280", err.message);
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
    console.error("❌ Error fetching recent leads: - leadController.js:1297", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


//nexila changes
//nexila changes