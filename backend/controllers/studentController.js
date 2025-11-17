// controllers/studentController.js
const Student = require("../models/Student");

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
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
