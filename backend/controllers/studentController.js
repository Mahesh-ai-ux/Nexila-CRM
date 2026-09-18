// controllers/studentController.js
const Student = require("../models/Student");
const  Studentlog=require("../models/Studentlog");
const mongoose = require("mongoose");
const user = require("../models/User");
const Lead = require("../models/Lead");
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }) //nexila changes
      .populate("assignfrom assignto", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching students",
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("assignfrom", "name email role")
      .populate("assignto", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (err) {
    console.error("❌ Error fetching student:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // sanitize objectIds
    if (!payload.assignfrom || !mongoose.Types.ObjectId.isValid(payload.assignfrom)) {
      payload.assignfrom = null;
    }
    if (!payload.assignto || !mongoose.Types.ObjectId.isValid(payload.assignto)) {
      payload.assignto = null;
    }

    // 1️⃣ fetch old student
    const oldStudent = await Student.findById(id).lean();
    if (!oldStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2️⃣ FIX FEES (model = Number)
    const fees = payload.fees !== undefined ? Number(payload.fees) : oldStudent.fees;
    const feepaid = payload.feepaid !== undefined ? Number(payload.feepaid) : oldStudent.feepaid;

    payload.fees = isNaN(fees) ? 0 : fees;
    payload.feepaid = isNaN(feepaid) ? 0 : feepaid;
    payload.pendingfee = payload.fees - payload.feepaid;

    // 3️⃣ detect changes
    const changes = [];
    Object.keys(payload).forEach(key => {
      if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return;

      if (String(oldStudent[key] ?? "") !== String(payload[key])) {
        changes.push({
          field: key,
          oldvalue: oldStudent[key] ?? null,
          newvalue: payload[key]
        });
      }
    });

    // 4️⃣ decide action
    const feeFields = ["fees", "feepaid", "pendingfee"];
    const isPayment =
      changes.length &&
      changes.every(c => feeFields.includes(c.field));

    const actionType = isPayment ? "payment" : "update";

    // 5️⃣ update
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );

    // 5.1️⃣ SYNC TO LEAD
if (updatedStudent.leadId) {
  await Lead.findByIdAndUpdate(
    updatedStudent.leadId,
    {
      name: updatedStudent.name,
      phone: updatedStudent.phone,
      email: updatedStudent.email,
      collegename: updatedStudent.collegename,
      location: updatedStudent.location,
      category: updatedStudent.category,
      leadsource: updatedStudent.leadsource,
      domain: updatedStudent.domain,
      graduate: updatedStudent.graduate,
      leadstatus: updatedStudent.leadstatus,
      lookingfor: updatedStudent.lookingfor,
      internshipduration: updatedStudent.internshipduration,
      noofday: updatedStudent.noofday,
      dateofjoin: updatedStudent.dateofjoin,
      feetype: updatedStudent.feetype,
      fees: updatedStudent.fees,
      feepaid: updatedStudent.feepaid,
      pendingfee: updatedStudent.pendingfee,
      assignto: updatedStudent.assignto,
      assignfrom: updatedStudent.assignfrom,
      nexilaId: updatedStudent.nexilaID
    }
  );
}


    // 6️⃣ log
    if (changes.length) {
      await Studentlog.create({
        studentid: updatedStudent._id,
        action: actionType,
        changes,
        source: "student_edit",
        updatedby: req.User?._id
      });
    }

    res.json({
      success: true,
      student: updatedStudent
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.payStudentFee = async (req, res) => {
  try {
    const { payamount, paymentMode } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const amount = Number(payamount);
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    if (amount > student.pendingfee) {
      return res.status(400).json({ message: "Payment exceeds pending fee" });
    }

    const oldFeePaid = student.feepaid;
    const oldPendingFee = student.pendingfee;

    // ✅ Update student fees
    student.feepaid += amount;
    student.pendingfee -= amount;
    await student.save();
    // 🔁 SYNC PAYMENT TO LEAD
if (student.leadId) {
  await Lead.findByIdAndUpdate(
    student.leadId,
    {
      feepaid: student.feepaid,
      pendingfee: student.pendingfee,
      fees: student.fees
    }
  );
}

    // ✅ STORE PAYMENT HISTORY
    await Studentlog.create({
      studentid: student._id,
      action: "payment",
      source: "fee_payment",
      payment: {
        amount: amount,
        paymentMode: paymentMode || "cash",
        paidAt: new Date(),
      },
      changes: [
        {
          field: "feepaid",
          oldvalue: oldFeePaid,
          newvalue: student.feepaid,
        },
        {
          field: "pendingfee",
          oldvalue: oldPendingFee,
          newvalue: student.pendingfee,
        },
      ],
      updatedby: req.user?._id,
    });

    res.json({
      message: "Payment successful",
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getStudentPayments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const logs = await Studentlog.find({
      studentid: id,
      action: "payment",
    })
      .sort({ createdAt: -1 })
      .populate("updatedby", "name");

    res.json({ payments: logs });
  } catch (error) {
    console.error("🔥 getStudentPayments error:", error);
    res.status(500).json({ message: error.message });
  }
};