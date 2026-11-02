
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Lead = require("../models/Lead");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_AMOUNTS = {
  "15 days": 1499,
  "30 days": 2500,
  "60 days": 5000,
  "90 days": 7499,
  "120 days": 20999,
};

const getPendingPaymentId = (lead) =>
  `PENDING_${lead.nexilaID || lead._id}`;

// --------------------------------------------------
// CREATE RAZORPAY ORDER
// POST /api/payments/create-order
// --------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const { leadId, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (lead.paymentMethod !== "RAZORPAY") {
      return res.status(400).json({
        success: false,
        message: "This application is not configured for Razorpay.",
      });
    }

    if (lead.paymentStatus === "PAID") {
      return res.status(409).json({
        success: false,
        message: "This application has already been paid.",
      });
    }

    if (lead.paymentStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This application is not awaiting payment.",
      });
    }

    const expectedAmount = PLAN_AMOUNTS[duration];

    if (
      !expectedAmount ||
      Number(lead.fees) !== expectedAmount ||
      lead.noofday !== duration ||
      lead.internshipduration !== duration
    ) {
      return res.status(400).json({
        success: false,
        message: "The selected plan does not match the saved application.",
      });
    }

    // Ensure older leads also have a unique payment placeholder.
    if (
      !lead.razorpayPaymentId ||
      lead.razorpayPaymentId === "null"
    ) {
      lead.razorpayPaymentId = getPendingPaymentId(lead);
    }

    // Reuse an existing unpaid order when possible.
    if (lead.razorpayOrderId) {
      try {
        const existingOrder = await razorpay.orders.fetch(
          lead.razorpayOrderId
        );

        if (
          existingOrder.status === "created" &&
          Number(existingOrder.amount) === expectedAmount * 100 &&
          existingOrder.currency === "INR"
        ) {
          await lead.save();

          return res.status(200).json({
            success: true,
            order: {
              id: existingOrder.id,
              amount: existingOrder.amount,
              currency: existingOrder.currency,
            },
          });
        }
      } catch (error) {
        console.error(
          "Unable to reuse existing Razorpay order:",
          error.error || error.message
        );
      }
    }

    const order = await razorpay.orders.create({
      amount: expectedAmount * 100,
      currency: "INR",
      receipt: String(lead.nexilaID || lead._id).slice(0, 40),
      notes: {
        leadId: String(lead._id),
        nexilaID: String(lead.nexilaID || ""),
      },
    });

    lead.razorpayOrderId = order.id;
    lead.paymentStatus = "PENDING";
    lead.paymentReference = `Pending_${lead.nexilaID || lead._id}`;

    await lead.save();

    return res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay create-order error:",
      error.error || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
};

// --------------------------------------------------
// VERIFY RAZORPAY PAYMENT
// POST /api/payments/verify
// --------------------------------------------------
exports.verifyPayment = async (req, res) => {
  try {
    const {
      leadId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment verification details are missing.",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Idempotent response for the same completed payment.
    if (
      lead.paymentStatus === "PAID" &&
      lead.razorpayPaymentId === razorpay_payment_id
    ) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        paymentStatus: "PAID",
      });
    }

    if (lead.paymentMethod !== "RAZORPAY") {
      return res.status(400).json({
        success: false,
        message: "This application is not configured for Razorpay.",
      });
    }

    if (lead.paymentStatus === "PAID") {
      return res.status(409).json({
        success: false,
        message: "A different payment is already recorded for this application.",
      });
    }

    if (lead.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match this application.",
      });
    }

    // Verify the Razorpay checkout signature.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Verify payment details directly with Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    const expectedAmount = Number(lead.fees) * 100;

    if (
      payment.order_id !== razorpay_order_id ||
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match the application fee.",
      });
    }

    if (payment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: "Payment has not been captured yet.",
        paymentStatus: "PENDING",
      });
    }

    // Replace the unique placeholder with the actual payment ID.
    lead.paymentStatus = "PAID";
    lead.razorpayPaymentId = razorpay_payment_id;
    lead.razorpaySignature = razorpay_signature;
    lead.paymentReference = razorpay_payment_id;
    lead.paidAt = new Date();

    lead.feepaid = Number(lead.fees);
    lead.pendingfee = 0;

    // Do not change the existing CRM lead status.
    lead.leadstatus = "New Lead";

    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentStatus: "PAID",
      data: {
        leadId: lead._id,
        nexilaID: lead.nexilaID,
        paymentReference: lead.paymentReference,
        paidAt: lead.paidAt,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay verify error:",
      error.error || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment. Please contact support.",
    });
  }
};