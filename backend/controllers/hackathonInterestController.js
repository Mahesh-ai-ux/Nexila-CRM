const HackathonInterest = require("../models/HackathonInterest");

// CREATE
const createHackathonInterest = async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;

    // Validation
    if (!name || !email || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Name, email and mobile number are required",
      });
    }

    // Check duplicate email/mobile
    // const existingStudent = await HackathonInterest.findOne({
    //   $or: [
    //     { email: email.toLowerCase() },
    //     { mobileNumber: mobileNumber },
    //   ],
    // });

    // if (existingStudent) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "This email or mobile number is already registered",
    //   });
    // }

    const student = await HackathonInterest.create({
      name: name.toUpperCase(),
      email: email.toLowerCase(),
      mobileNumber,
      status: "interested",
    });

    return res.status(201).json({
      success: true,
      message: "Interest registered successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create hackathon interest error: - hackathonInterestController.js:44", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// GET ALL
const getHackathonInterests = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    if (
      status === "interested" ||
      status === "not interested"
    ) {
      filter.status = status;
    }

    const students = await HackathonInterest.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get hackathon interests error: - hackathonInterestController.js:76", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// UPDATE STATUS ONLY
const updateHackathonInterestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      status !== "interested" &&
      status !== "not interested"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const student = await HackathonInterest.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update status error: - hackathonInterestController.js:126", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


module.exports = {
  createHackathonInterest,
  getHackathonInterests,
  updateHackathonInterestStatus,
};