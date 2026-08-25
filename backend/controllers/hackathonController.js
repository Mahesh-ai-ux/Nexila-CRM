const crypto = require("crypto");

const HackathonStudent = require("../models/dbsHackathonStudent");

const razorpay = require("../services/razorpayService");

const {
  sendRegistrationPreview,
  sendRegistrationSuccess,
} = require("../services/hackathonEmailService");

const {
    sendHackathonWhatsApp,
} = require("../services/watiService");
// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createHackathonPaymentOrder = async (req, res) => {
  try {
    const {
      teamMembers,
    } = req.body;

    if (
      !teamMembers ||
      !Array.isArray(teamMembers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Team members are required",
      });
    }

    // Minimum 2
    if (teamMembers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Minimum 2 team members are required",
      });
    }

    // Maximum 4
    if (teamMembers.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 team members are allowed",
      });
    }


    // ============================================
    // PRICE
    // ============================================

    const pricePerMember =
      Number(
        process.env.HACKATHON_MEMBER_PRICE || 125
      );

    const totalAmount =
      teamMembers.length * pricePerMember;


    // Razorpay requires amount in paise
    const amountInPaise =
      totalAmount * 100;


    // ============================================
    // CREATE RAZORPAY ORDER
    // ============================================

    const options = {
      amount: amountInPaise,

      currency: "INR",

      receipt:
        `hackathon_${Date.now()}`,

      notes: {
        teamSize:
          String(teamMembers.length),

        pricePerMember:
          String(pricePerMember),
      },
    };


    const order =
      await razorpay.orders.create(options);


    res.status(200).json({
      success: true,

      orderId: order.id,

      amount: totalAmount,

      amountInPaise,

      currency: "INR",

      keyId:
        process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    console.error(
      "Create Razorpay Order Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.error?.description ||
        error.message ||
        "Unable to create payment order",
    });
  }
};


// =====================================================
// VERIFY PAYMENT + REGISTER STUDENT
// =====================================================

const verifyHackathonPayment = async (
  req,
  res
) => {

  try {

    const {
      formData,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,
    } = req.body;


    // ============================================
    // BASIC VALIDATION
    // ============================================

    if (!formData) {
      return res.status(400).json({
        success: false,
        message: "Registration data is required",
      });
    }


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment information is missing",
      });
    }


    // ============================================
    // TEAM VALIDATION
    // ============================================

    if (
      !formData.teamMembers ||
      formData.teamMembers.length < 2 ||
      formData.teamMembers.length > 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Team must contain 2 to 4 members",
      });
    }


    // ============================================
    // VERIFY RAZORPAY SIGNATURE
    // ============================================

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;


    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");


    // Timing safe comparison
    const isValid =
      expectedSignature.length ===
        razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );


    if (!isValid) {

      console.error(
        "Invalid Razorpay signature"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }


    // ============================================
    // CALCULATE AMOUNT AGAIN ON SERVER
    // ============================================

    const pricePerMember =
      Number(
        process.env.HACKATHON_MEMBER_PRICE || 125
      );


    const teamSize =
      formData.teamMembers.length;


    const totalAmount =
      teamSize * pricePerMember;


    // ============================================
    // CREATE STUDENT AFTER PAYMENT
    // ============================================

    const student =
      await HackathonStudent.create({

        ...formData,

        paymentAmount:
          totalAmount,

        paymentStatus:
          "Paid",

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,

        registrationStatus:
          "Registered",
      });


    // ============================================
    // SEND EMAILS
    // ============================================
// ============================================
// SEND EMAILS + WHATSAPP
// ============================================
try {

    // EMAIL 1
    await sendRegistrationPreview(student);

    // EMAIL 2
    await sendRegistrationSuccess(student);

} catch (emailError) {

    console.error(
        "Email error:",
        emailError.message
    );

    // Email failure should NOT cancel registration
}


// ============================================
// SEND WHATSAPP
// ============================================
try {

    await sendHackathonWhatsApp(student);

} catch (whatsappError) {

    console.error(
        "WhatsApp error:",
        whatsappError.message
    );

    // WhatsApp failure should NOT cancel registration
}


    // ============================================
    // FINAL RESPONSE
    // ============================================

    res.status(200).json({

      success: true,

      message:
        "Payment successful and registration completed",

      student,

    });


  } catch (error) {

    console.error(
      "Payment Verification Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Unable to verify payment",

    });
  }
};

// =====================================================
// PUBLIC REGISTRATION
// No login required
// =====================================================

// const publicRegister = async (req, res) => {
//   try {
//     const student = await HackathonStudent.create(req.body);

//     // Send first email
//     try {
//       await sendRegistrationPreview(student);

//       // Send second email
//       await sendRegistrationSuccess(student);
//     } catch (emailError) {
//       console.error("Email error:", emailError.message);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Hackathon registration successful",
//       student,
//     });
//   } catch (error) {
//     console.error("Hackathon registration error:", error);

//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// =====================================================
// GET ALL
// CRM LOGIN REQUIRED
// =====================================================

const getAllHackathonStudents = async (req, res) => {
  try {
    const students = await HackathonStudent.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE
// =====================================================

const getHackathonStudent = async (req, res) => {
  try {
    const student = await HackathonStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Hackathon student not found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE FROM CRM
// =====================================================

const createHackathonStudent = async (req, res) => {
  try {
    const student = await HackathonStudent.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hackathon student created",
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE
// =====================================================

const updateHackathonStudent = async (req, res) => {
  try {
    const student = await HackathonStudent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Hackathon student not found",
      });
    }

    res.json({
      success: true,
      message: "Hackathon student updated",
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE
// =====================================================

const deleteHackathonStudent = async (req, res) => {
  try {
    const student = await HackathonStudent.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Hackathon student not found",
      });
    }

    res.json({
      success: true,
      message: "Hackathon student deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHackathonPaymentOrder,
  verifyHackathonPayment,

  getAllHackathonStudents,
  getHackathonStudent,
  createHackathonStudent,
  updateHackathonStudent,
  deleteHackathonStudent,
};