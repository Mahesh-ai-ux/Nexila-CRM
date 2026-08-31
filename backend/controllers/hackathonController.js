const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const Counter = require("../models/counterSchema");
const HackathonStudent = require("../models/dbsHackathonStudent.js");

// =====================================================
// RAZORPAY
// =====================================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const {
    sendRegistrationSuccess,
    sendManualRegistrationSuccess,
    sendTeamDetailsEmail,
} = require("../services/hackathonEmailService");
// =====================================================
// CONSTANTS
// =====================================================

// const PRICE_PER_MEMBER = 250;


const OTP_EXPIRY_MINUTES = 5;

const MAX_OTP_ATTEMPTS = 5;

const OTP_RESEND_SECONDS = 60;

// =====================================================
// HELPERS
// =====================================================

const normalizeTeamName = (teamName) => {
    return String(teamName || "")
        .trim()
        .replace(/\s+/g, " ");
};

// =====================================================
// GENERATE REGISTRATION ID
// =====================================================

const generateRegistrationId = async () => {

    const currentYear = new Date().getFullYear();

    const counter = await Counter.findOne({
        name: "hackathon-registration",
    });

    // ============================================
    // FIRST REGISTRATION
    // ============================================

    if (!counter) {

        const newCounter =
            await Counter.create({
                name: "hackathon-registration",
                year: currentYear,
                sequence: 301,
            });

        return `${currentYear}${newCounter.sequence}`;
    }

    // ============================================
    // YEAR CHANGED
    // ============================================

    if (counter.year !== currentYear) {

        counter.year = currentYear;
        counter.sequence = 1;

        await counter.save();

        return `${currentYear}${String(1).padStart(4, "0")}`;
    }

    // ============================================
    // SAME YEAR
    // ============================================

    if (counter.sequence >= 9999) {

        throw new Error(
            `Registration ID limit reached for ${currentYear}`
        );
    }

    counter.sequence += 1;

    await counter.save();

    // ============================================
    // RETURN ID
    // ============================================

    if (counter.sequence < 1000) {
        return `${currentYear}${counter.sequence}`;
    }

    return `${currentYear}${String(
        counter.sequence
    ).padStart(4, "0")}`;
};
// =====================================================
// GENERATE OTP
// =====================================================

const generateOtp = () => {
    return String(
        crypto.randomInt(100000, 1000000)
    );
};

// =====================================================
// HASH OTP
// =====================================================

const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
};

// =====================================================
// SEND OTP
// =====================================================

const sendProjectOtp = async (student, otp) => {

    /*
        CONNECT YOUR EMAIL/SMS PROVIDER HERE.

        Example:

        await sendEmail({
            to: student.email,
            subject: "Hackathon Project OTP",
            text: `Your OTP is ${otp}`
        });

        IMPORTANT:
        Do NOT return the OTP in the API response.
    */

    console.log(
        `OTP for ${student.email}: ${otp}`
    );
};

// =====================================================
// VALIDATE TEAM MEMBERS
// =====================================================

const validateTeamMembers = (teamMembers) => {

    if (!Array.isArray(teamMembers)) {
        return "Team members are required";
    }

    if (
        teamMembers.length < 2 ||
        teamMembers.length > 4
    ) {
        return "Team must contain between 2 and 4 members";
    }

    for (const member of teamMembers) {

        if (!member || typeof member !== "object") {
            return "Invalid team member";
        }

        if (!member.name?.trim()) {
            return "Team member name is required";
        }

        if (!member.phone?.trim()) {
            return "Team member phone is required";
        }

        if (!member.collegeRollNo?.trim()) {
            return "Team member college roll number is required";
        }
    }

    return null;
};
// =====================================================
// PUBLIC QR / MANUAL PAYMENT REGISTRATION
// NO RAZORPAY
// =====================================================

const createHackathonManualRegistration = async (
    req,
    res
) => {

    try {

        const data = req.body;

        // =====================================================
        // TEAM MEMBERS
        // =====================================================

        const teamError =
            validateTeamMembers(
                data.teamMembers
            );

        if (teamError) {

            return res.status(400).json({

                success: false,

                message:
                    teamError,
            });
        }

        // =====================================================
        // TEAM NAME
        // =====================================================

        const teamName =
            normalizeTeamName(
                data.teamName
            );

        if (!teamName) {

            return res.status(400).json({

                success: false,

                message:
                    "Team name is required",
            });
        }

        // =====================================================
        // CHECK DUPLICATE TEAM
        // =====================================================

        const existingTeam =
            await HackathonStudent.findOne({
                teamName,
            });

        if (existingTeam) {

            return res.status(409).json({

                success: false,

                message:
                    "This team name is already registered",
            });
        }

        // =====================================================
        // GENERATE REGISTRATION ID
        // =====================================================

        const registrationId =
            await generateRegistrationId();

        console.log(
            "Generated manual registration ID:",
            registrationId
        );

        // =====================================================
        // AMOUNT
        // =====================================================

        const amount = 500;

        // =====================================================
        // CREATE STUDENT DATA
        // =====================================================

        const studentData = {
            // -----------------------------------------------
            // Registration
            // -----------------------------------------------
            registrationId,

            // -----------------------------------------------
            // Student
            // -----------------------------------------------
            fullName: String(
                data.fullName || ""
            ).trim(),

            phone: String(
                data.phone || ""
            ).trim(),

            email: String(
                data.email || ""
            )
                .trim()
                .toLowerCase(),

            collegeName: String(
                data.collegeName || ""
            ).trim(),

            degree: String(
                data.degree || ""
            ).trim(),

            department: String(
                data.department || ""
            ).trim(),

            collegeRollNo: String(
                data.collegeRollNo || ""
            ).trim(),

            yearOfStudy: String(
                data.yearOfStudy || ""
            ).trim(),

            district: String(
                data.district || ""
            ).trim(),

            // -----------------------------------------------
            // Team
            // -----------------------------------------------
            teamName,

            teamMembers: data.teamMembers,

            // -----------------------------------------------
            // Hackathon
            // -----------------------------------------------
            hackathonTrack: String(
                data.hackathonTrack || ""
            ).trim(),

            primaryTechnicalSkill: String(
                data.primaryTechnicalSkill || ""
            ).trim(),

            // -----------------------------------------------
            // Project
            // -----------------------------------------------
            projectTitle: null,

            projectDescription: null,

            projectAbstract: null,

            // -----------------------------------------------
            // Payment
            // -----------------------------------------------
            paymentStatus: "PENDING",

            status: "REGISTERED",

            amount,

            // -----------------------------------------------
            // Manual Payment
            // No actual Razorpay transaction
            // -----------------------------------------------
            razorpayOrderId:
                `MANUAL_${registrationId}`,

            razorpayPaymentId:
                `MANUAL_${registrationId}`,

            razorpaySignature:
                `MANUAL_${registrationId}`,

            paidAt: null,

            // -----------------------------------------------
            // Terms
            // -----------------------------------------------
            termsAccepted:
                data.termsAccepted === true,
        };

        // =====================================================
        // REQUIRED FIELD CHECK
        // =====================================================

        const requiredFields = [

            "fullName",

            "phone",

            "email",

            "collegeName",

            "degree",

            "department",

            "collegeRollNo",

            "yearOfStudy",

            "district",

            "teamName",

            "hackathonTrack",

            "primaryTechnicalSkill",
        ];

        for (
            const field of requiredFields
        ) {

            if (
                !studentData[field]
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `${field} is required`,
                });
            }
        }

        // =====================================================
        // TERMS
        // =====================================================

        if (
            studentData.termsAccepted !== true
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Terms and conditions must be accepted",
            });
        }

        // =====================================================
        // CREATE REGISTRATION
        // =====================================================

        console.log(
            "Creating manual HackathonStudent..."
        );

        const student =
            await HackathonStudent.create(
                studentData
            );

        console.log(
            "========================================"
        );

        console.log(
            "MANUAL REGISTRATION CREATED"
        );

        console.log(
            "Registration ID:",
            student.registrationId
        );

        console.log(
            "Team Name:",
            student.teamName
        );

        console.log(
            "Payment Status:",
            student.paymentStatus
        );

        console.log(
            "========================================"
        );

        // =====================================================
        // SEND SAME HACKATHON EMAILS
        // =====================================================

        try {

            await sendManualRegistrationSuccess(
                student
            );

            console.log(
                "Registration success email sent successfully"
            );

        } catch (emailError) {

            console.error(
                "Registration success email failed:",
                emailError
            );
        }

        try {

            await sendTeamDetailsEmail(
                student
            );

            console.log(
                "Team/project details email sent successfully"
            );

        } catch (emailError) {

            console.error(
                "Team/project details email failed:",
                emailError
            );
        }

        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        return res.status(201).json({

            success: true,

            message:
                "Hackathon registration submitted successfully. Please complete the payment using the QR code.",

            registrationId:
                student.registrationId,

            studentId:
                student._id,

            teamName:
                student.teamName,

            amount:
                student.amount,

            paymentStatus:
                student.paymentStatus,

            status:
                student.status,
        });

    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "MANUAL HACKATHON REGISTRATION ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(error);

        // =====================================================
        // MONGOOSE VALIDATION ERROR
        // =====================================================

        if (
            error?.name ===
            "ValidationError"
        ) {

            const validationErrors =
                Object.values(
                    error.errors || {}
                ).map((err) => ({

                    field:
                        err.path,

                    message:
                        err.message,
                }));

            return res.status(400).json({

                success: false,

                message:
                    "Registration validation failed",

                errors:
                    validationErrors,
            });
        }

        // =====================================================
        // DUPLICATE KEY ERROR
        // =====================================================

        if (
            error?.code === 11000
        ) {

            console.error(
                "MongoDB duplicate key:",
                error.keyPattern,
                error.keyValue
            );

            if (
                error.keyPattern?.teamName
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "This team name is already registered",
                });
            }

            if (
                error.keyPattern?.registrationId
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Registration ID already exists. Please try again.",
                });
            }

            return res.status(409).json({

                success: false,

                message:
                    "Duplicate registration data",
            });
        }

        // =====================================================
        // GENERAL ERROR
        // =====================================================

        return res.status(500).json({

            success: false,

            message:
                "Unable to complete hackathon registration",
        });
    }
};
// =====================================================
// PUBLIC PAYMENT
// CREATE ORDER
// =====================================================

const createHackathonPaymentOrder = async (
    req,
    res
) => {

    try {

        const {
            teamName,
            teamMembers,
        } = req.body;

        // -------------------------------------------------
        // TEAM NAME
        // -------------------------------------------------

        const normalizedTeamName =
            normalizeTeamName(teamName);

        if (!normalizedTeamName) {

            return res.status(400).json({
                success: false,
                message: "Team name is required",
            });
        }

        // -------------------------------------------------
        // TEAM MEMBERS
        // -------------------------------------------------

        const teamError =
            validateTeamMembers(teamMembers);

        if (teamError) {

            return res.status(400).json({
                success: false,
                message: teamError,
            });
        }

        // -------------------------------------------------
        // CHECK TEAM NAME
        // -------------------------------------------------

        const existingTeam =
            await HackathonStudent.findOne({
                teamName: normalizedTeamName,
            });

        if (existingTeam) {

            return res.status(409).json({
                success: false,
                message:
                    "This team name is already registered",
            });
        }

        // -------------------------------------------------
        // CALCULATE AMOUNT
        // -------------------------------------------------

        // const amountInRupees =
        //     teamMembers.length *
        //     PRICE_PER_MEMBER;

        const amountInRupees = 500;

        const amountInPaise =
            amountInRupees * 100;

        // -------------------------------------------------
        // CREATE RAZORPAY ORDER
        // -------------------------------------------------

        const order =
            await razorpay.orders.create({

                amount: amountInPaise,

                currency: "INR",

                receipt:
                    `hackathon_${Date.now()}`,

                notes: {
                    teamName:
                        normalizedTeamName,

                    teamSize:
                        String(
                            teamMembers.length
                        ),
                },
            });

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            keyId:
                process.env.RAZORPAY_KEY_ID,

            orderId:
                order.id,

            amountInPaise,

            amountInRupees,

            currency: "INR",

            teamSize:
                teamMembers.length,
        });

    } catch (error) {

        console.error(
            "Create Hackathon Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment order",
        });
    }
};

// =====================================================
// VERIFY PAYMENT
// =====================================================


const verifyHackathonPayment = async (req, res) => {
    try {
        const {
            formData,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        console.log("======================================== - hackathonController.js:843");
        console.log("HACKATHON PAYMENT VERIFICATION - hackathonController.js:844");
        console.log("======================================== - hackathonController.js:845");

        console.log("Order ID: - hackathonController.js:847", razorpay_order_id);
        console.log("Payment ID: - hackathonController.js:848", razorpay_payment_id);
        console.log("Team Name: - hackathonController.js:849", formData?.teamName);
        console.log(
            "Team Members:",
            formData?.teamMembers?.length
        );

        // =====================================================
        // BASIC VALIDATION
        // =====================================================

        if (
            !formData ||
            typeof formData !== "object"
        ) {
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
                message: "Payment details are incomplete",
            });
        }

        // =====================================================
        // RAZORPAY SECRET
        // =====================================================

        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error(
                "RAZORPAY_KEY_SECRET is missing"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Razorpay server configuration is missing",
            });
        }

        // =====================================================
        // VERIFY RAZORPAY SIGNATURE
        // =====================================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "hex"
            );

        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "hex"
            );

        if (
            generatedBuffer.length !==
            receivedBuffer.length ||
            !crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            )
        ) {
            console.error(
                "Invalid Razorpay signature"
            );

            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment signature",
            });
        }

        console.log(
            "Razorpay signature verified"
        );

        // =====================================================
        // VALIDATE TEAM MEMBERS
        // =====================================================

        const teamMembers =
            Array.isArray(formData.teamMembers)
                ? formData.teamMembers
                : [];

        if (
            teamMembers.length < 2 ||
            teamMembers.length > 4
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Team must contain 2 to 4 members",
            });
        }

        // =====================================================
        // TEAM MEMBER VALIDATION
        // =====================================================

        for (
            let i = 0;
            i < teamMembers.length;
            i++
        ) {
            const member =
                teamMembers[i];

            if (
                !member ||
                !member.name?.trim() ||
                !member.phone?.trim() ||
                !member.collegeRollNo?.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Team Member ${i + 1} details are incomplete`,
                });
            }

            if (
                String(member.phone).length !== 10
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Team Member ${i + 1} phone number must contain 10 digits`,
                });
            }
        }

        // =====================================================
        // CALCULATE EXPECTED AMOUNT
        // =====================================================

        // const expectedAmountInRupees =
        //     teamMembers.length *
        //     PRICE_PER_MEMBER;
        const expectedAmountInRupees = 500

        const expectedAmountInPaise =
            expectedAmountInRupees * 100;

        console.log(
            "Expected amount:",
            expectedAmountInRupees
        );

        // =====================================================
        // FETCH RAZORPAY ORDER
        // =====================================================

        const razorpayOrder =
            await razorpay.orders.fetch(
                razorpay_order_id
            );

        console.log(
            "Razorpay order amount:",
            razorpayOrder.amount
        );

        console.log(
            "Razorpay order currency:",
            razorpayOrder.currency
        );

        // =====================================================
        // VERIFY ORDER AMOUNT
        // =====================================================

        if (
            Number(razorpayOrder.amount) !==
            Number(expectedAmountInPaise)
        ) {
            console.error(
                "Amount mismatch",
                {
                    razorpayAmount:
                        razorpayOrder.amount,

                    expectedAmount:
                        expectedAmountInPaise,
                }
            );

            return res.status(400).json({
                success: false,
                message:
                    "Payment amount does not match registration amount",
            });
        }

        // =====================================================
        // VERIFY CURRENCY
        // =====================================================

        if (
            razorpayOrder.currency !==
            "INR"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment currency",
            });
        }

        // =====================================================
        // FETCH PAYMENT
        // =====================================================

        const payment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );

        console.log(
            "Payment status:",
            payment.status
        );

        console.log(
            "Payment order:",
            payment.order_id
        );

        console.log(
            "Payment amount:",
            payment.amount
        );

        // =====================================================
        // VERIFY PAYMENT BELONGS TO ORDER
        // =====================================================

        if (
            payment.order_id !==
            razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment does not belong to this order",
            });
        }

        // =====================================================
        // VERIFY PAYMENT STATUS
        // =====================================================

        if (
            payment.status !==
            "captured"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Payment is not captured. Current status: ${payment.status}`,
            });
        }

        // =====================================================
        // VERIFY PAYMENT AMOUNT
        // =====================================================

        if (
            Number(payment.amount) !==
            Number(expectedAmountInPaise)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment amount does not match registration amount",
            });
        }

        console.log(
            "Payment verification successful"
        );

        // =====================================================
        // TERMS
        // =====================================================

        if (
            formData.termsAccepted !==
            true
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Terms and conditions must be accepted",
            });
        }

        // =====================================================
        // TEAM NAME
        // =====================================================

        const teamName =
            normalizeTeamName(
                formData.teamName
            );

        if (!teamName) {
            return res.status(400).json({
                success: false,
                message:
                    "Team name is required",
            });
        }

        // =====================================================
        // CHECK DUPLICATE PAYMENT
        // =====================================================

        const existingPayment =
            await HackathonStudent.findOne({
                $or: [
                    {
                        razorpayPaymentId:
                            razorpay_payment_id,
                    },
                    {
                        razorpayOrderId:
                            razorpay_order_id,
                    },
                ],
            });

        if (existingPayment) {
            console.log(
                "Payment already registered:",
                existingPayment.registrationId
            );

            return res.status(409).json({
                success: false,
                message:
                    "This payment has already been processed",
                registrationId:
                    existingPayment.registrationId,
            });
        }

        // =====================================================
        // CHECK DUPLICATE TEAM
        // =====================================================

        const existingTeam =
            await HackathonStudent.findOne({
                teamName,
            });

        if (existingTeam) {
            return res.status(409).json({
                success: false,
                message:
                    "This team name is already registered",
            });
        }

        // =====================================================
        // GENERATE REGISTRATION ID
        // =====================================================

        const registrationId =
            await generateRegistrationId();

        console.log(
            "Generated registration ID:",
            registrationId
        );

        // =====================================================
        // CREATE STUDENT DATA
        // =====================================================

        const studentData = {
            // -----------------------------------------------
            // Registration
            // -----------------------------------------------

            registrationId,

            // -----------------------------------------------
            // Student
            // -----------------------------------------------

            fullName:
                String(formData.fullName || "").trim(),

            phone:
                String(formData.phone || "").trim(),

            email:
                String(formData.email || "")
                    .trim()
                    .toLowerCase(),

            collegeName:
                String(formData.collegeName || "").trim(),

            degree:
                String(formData.degree || "").trim(),

            department:
                String(formData.department || "").trim(),

            collegeRollNo:
                String(formData.collegeRollNo || "").trim(),

            yearOfStudy:
                String(formData.yearOfStudy || "").trim(),

            // passingOutYear:
            //     String(formData.passingOutYear || "").trim(),

            district:
                String(formData.district || "").trim(),

            // -----------------------------------------------
            // Team
            // -----------------------------------------------

            teamName,

            teamMembers,

            // -----------------------------------------------
            // Hackathon
            // -----------------------------------------------

            hackathonTrack:
                String(
                    formData.hackathonTrack || ""
                ).trim(),

            primaryTechnicalSkill:
                String(
                    formData.primaryTechnicalSkill || ""
                ).trim(),

            // -----------------------------------------------
            // PROJECT
            // -----------------------------------------------
            // Registration form does not collect project
            // details yet.
            //
            // These remain null and can be updated later.
            // -----------------------------------------------

            projectTitle: null,

            projectDescription: null,

            projectAbstract: null,

            // -----------------------------------------------
            // Payment
            // -----------------------------------------------

            paymentStatus:
                "PAID",
            status: "REGISTERED",

            amount:
                expectedAmountInRupees,

            razorpayOrderId:
                razorpay_order_id,

            razorpayPaymentId:
                razorpay_payment_id,

            razorpaySignature:
                razorpay_signature,

            paidAt:
                new Date(),

            // -----------------------------------------------
            // Terms
            // -----------------------------------------------

            termsAccepted:
                true,
        };

        // =====================================================
        // FINAL REQUIRED FIELD CHECK
        // =====================================================

        const requiredFields = [
            "fullName",
            "phone",
            "email",
            "collegeName",
            "degree",
            "department",
            "collegeRollNo",
            "yearOfStudy",
            // "passingOutYear",
            "district",
            "teamName",
            "hackathonTrack",
            "primaryTechnicalSkill",
        ];

        for (
            const field of requiredFields
        ) {
            if (
                !studentData[field]
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${field} is required`,
                });
            }
        }

        // =====================================================
        // CREATE REGISTRATION
        // =====================================================

        console.log(
            "Creating HackathonStudent..."
        );

        const student =
            await HackathonStudent.create(
                studentData
            );

        console.log(
            "========================================"
        );

        console.log(
            "REGISTRATION CREATED SUCCESSFULLY"
        );

        console.log(
            "Registration ID:",
            student.registrationId
        );

        console.log(
            "Team Name:",
            student.teamName
        );

        console.log(
            "Payment ID:",
            student.razorpayPaymentId
        );

        console.log(
            "========================================"
        );
// =====================================================
// SEND HACKATHON EMAILS
// =====================================================

try {

    await sendRegistrationSuccess(student);

    console.log(
        "Registration success email sent successfully"
    );

} catch (emailError) {

    console.error(
        "Registration success email failed:",
        emailError
    );
}

try {

    await sendTeamDetailsEmail(student);

    console.log(
        "Team/project details email sent successfully"
    );

} catch (emailError) {

    console.error(
        "Team/project details email failed:",
        emailError
    );
}
        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        return res.status(201).json({
            success: true,

            message:
                "Hackathon registration successful",

            registrationId:
                student.registrationId,

            studentId:
                student._id,

            teamName:
                student.teamName,

            amount:
                student.amount,

            paymentStatus:
                student.paymentStatus,
        });

    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "VERIFY HACKATHON PAYMENT ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(error);

        // =====================================================
        // MONGOOSE VALIDATION ERROR
        // =====================================================

        if (
            error?.name ===
            "ValidationError"
        ) {
            const validationErrors =
                Object.values(
                    error.errors || {}
                ).map((err) => ({
                    field: err.path,
                    message: err.message,
                }));

            console.error(
                "Mongoose validation errors:",
                validationErrors
            );

            return res.status(400).json({
                success: false,

                message:
                    "Registration validation failed",

                errors:
                    validationErrors,
            });
        }

        // =====================================================
        // DUPLICATE KEY ERROR
        // =====================================================

        if (
            error?.code === 11000
        ) {
            console.error(
                "MongoDB duplicate key:",
                error.keyPattern,
                error.keyValue
            );

            if (
                error.keyPattern?.teamName
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This team name is already registered",
                });
            }

            if (
                error.keyPattern?.razorpayPaymentId
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This payment has already been processed",
                });
            }

            if (
                error.keyPattern?.razorpayOrderId
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This payment order has already been processed",
                });
            }

            if (
                error.keyPattern?.registrationId
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Registration ID already exists. Please try again.",
                });
            }

            return res.status(409).json({
                success: false,
                message:
                    "Duplicate registration/payment data",
            });
        }

        // =====================================================
        // RAZORPAY ERROR
        // =====================================================

        if (
            error?.statusCode
        ) {
            return res.status(
                error.statusCode
            ).json({
                success: false,

                message:
                    error.error?.description ||
                    error.message ||
                    "Razorpay error",
            });
        }

        // =====================================================
        // GENERAL ERROR
        // =====================================================

        return res.status(500).json({
            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Payment verification or registration failed",
        });
    }
};

// =====================================================
// CRM
// GET ALL
// =====================================================

const getAllHackathonStudents = async (req, res) => {
    try {

        // console.log(
        //     "Collection:",
        //     HackathonStudent.collection.name
        // );

        const students =
            await HackathonStudent.find()
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to get hackathon students",
        });
    }
};
// =====================================================
// CRM
// GET ONE
// =====================================================

const getHackathonStudent = async (
    req,
    res
) => {

    try {

        const student =
            await HackathonStudent.findById(
                req.params.id
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Hackathon student not found",
            });
        }

        return res.status(200).json({

            success: true,

            data:
                student,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to get hackathon student",
        });
    }
};

// =====================================================
// CRM
// CREATE
// =====================================================

const createHackathonStudent = async (
    req,
    res
) => {

    try {

        const data = req.body;

        // -------------------------------------------------
        // TEAM MEMBERS
        // -------------------------------------------------

        const teamError =
            validateTeamMembers(
                data.teamMembers
            );

        if (teamError) {

            return res.status(400).json({

                success: false,

                message:
                    teamError,
            });
        }

        // -------------------------------------------------
        // TEAM NAME
        // -------------------------------------------------

        const teamName =
            normalizeTeamName(
                data.teamName
            );

        if (!teamName) {

            return res.status(400).json({

                success: false,

                message:
                    "Team name is required",
            });
        }

        // -------------------------------------------------
        // CHECK TEAM
        // -------------------------------------------------

        const existingTeam =
            await HackathonStudent.findOne({
                teamName,
            });

        if (existingTeam) {

            return res.status(409).json({

                success: false,

                message:
                    "This team name is already registered",
            });
        }

        // -------------------------------------------------
        // GENERATE ID
        // -------------------------------------------------

        const registrationId =
            await generateRegistrationId();

        // -------------------------------------------------
        // AMOUNT
        // -------------------------------------------------

        // const amount =
        //     data.teamMembers.length *
        //     PRICE_PER_MEMBER;

        const amount = 500

        // -------------------------------------------------
        // CREATE
        // -------------------------------------------------

        const student =
            await HackathonStudent.create({

                ...data,

                teamName,

                registrationId,

                amount,
                status: "REGISTERED",
            });

        return res.status(201).json({

            success: true,

            message:
                "Hackathon student created",

            data:
                student,
        });

    } catch (error) {

        console.error(error);

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Duplicate registration data",
            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Unable to create hackathon student",
        });
    }
};

// =====================================================
// CRM
// UPDATE
// =====================================================

const updateHackathonStudent = async (
    req,
    res
) => {

    try {

        const student =
            await HackathonStudent.findById(
                req.params.id
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Hackathon student not found",
            });
        }

        // -------------------------------------------------
        // TEAM NAME
        // -------------------------------------------------

        if (
            req.body.teamName !== undefined
        ) {

            const teamName =
                normalizeTeamName(
                    req.body.teamName
                );

            if (!teamName) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Team name is required",
                });
            }

            const duplicate =
                await HackathonStudent.findOne({

                    teamName,

                    _id: {
                        $ne: student._id,
                    },
                });

            if (duplicate) {

                return res.status(409).json({

                    success: false,

                    message:
                        "This team name is already registered",
                });
            }

            student.teamName =
                teamName;
        }

        // -------------------------------------------------
        // TEAM MEMBERS
        // -------------------------------------------------

        if (
            req.body.teamMembers !== undefined
        ) {

            const teamError =
                validateTeamMembers(
                    req.body.teamMembers
                );

            if (teamError) {

                return res.status(400).json({

                    success: false,

                    message:
                        teamError,
                });
            }

            student.teamMembers =
                req.body.teamMembers;

            student.amount = 500;
        }

        // -------------------------------------------------
        // UPDATE SAFE FIELDS
        // -------------------------------------------------

        const allowedFields = [

            "fullName",
            "phone",
            "email",
            "collegeName",
            "degree",
            "department",
            "collegeRollNo",
            "yearOfStudy",
            // "passingOutYear",
            "district",

            "hackathonTrack",
            "primaryTechnicalSkill",

            "projectTitle",
            "projectDescription",
            "projectAbstract",
            "problemStatement",
            "proposedSolution",
            "techStack",
            "architectureDiagram",
            "expectedOutcome",
            "demoLink",
            "githubLink",
            "driveLink", //drive link

            "termsAccepted",
            "status",
            "paymentStatus"
        ];

        allowedFields.forEach(
            (field) => {

                if (
                    req.body[field] !==
                    undefined
                ) {

                    student[field] =
                        req.body[field];
                }
            }
        );

        await student.save();

        return res.status(200).json({

            success: true,

            message:
                "Hackathon student updated",

            data:
                student,
        });

    } catch (error) {

        console.error(error);

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Duplicate team/payment data",
            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Unable to update hackathon student",
        });
    }
};

// =====================================================
// CRM
// DELETE
// =====================================================

const deleteHackathonStudent = async (
    req,
    res
) => {

    try {

        const student =
            await HackathonStudent.findByIdAndDelete(
                req.params.id
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Hackathon student not found",
            });
        }

        return res.status(200).json({

            success: true,

            message:
                "Hackathon student deleted",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete hackathon student",
        });
    }
};

// =====================================================
// STUDENT PROJECT
// REQUEST OTP
// =====================================================

const requestProjectOtp = async (
    req,
    res
) => {

    try {

        const {
            registrationId,
        } = req.body;

        if (!registrationId) {

            return res.status(400).json({

                success: false,

                message:
                    "Registration ID is required",
            });
        }

        // -------------------------------------------------
        // FIND STUDENT
        // -------------------------------------------------

        const student =
            await HackathonStudent.findOne({

                registrationId:
                    registrationId.trim(),
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration ID not found",
            });
        }

        // -------------------------------------------------
        // RESEND LIMIT
        // -------------------------------------------------

        if (
            student.projectOtpLastSentAt
        ) {

            const secondsPassed =
                (
                    Date.now() -
                    student.projectOtpLastSentAt.getTime()
                ) / 1000;

            if (
                secondsPassed <
                OTP_RESEND_SECONDS
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        `Please wait ${Math.ceil(
                            OTP_RESEND_SECONDS -
                            secondsPassed
                        )} seconds before requesting another OTP`,
                });
            }
        }

        // -------------------------------------------------
        // GENERATE OTP
        // -------------------------------------------------

        const otp =
            generateOtp();

        const otpHash =
            hashOtp(otp);

        const expiresAt =
            new Date(
                Date.now() +
                OTP_EXPIRY_MINUTES *
                60 *
                1000
            );

        // -------------------------------------------------
        // SAVE OTP
        // -------------------------------------------------

        student.projectOtpHash =
            otpHash;

        student.projectOtpExpiresAt =
            expiresAt;

        student.projectOtpAttempts =
            0;

        student.projectOtpLastSentAt =
            new Date();

        await student.save();

        // -------------------------------------------------
        // SEND OTP
        // -------------------------------------------------

        await sendProjectOtp(
            student,
            otp
        );

        return res.status(200).json({

            success: true,

            message:
                "OTP sent successfully",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to request OTP",
        });
    }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyProjectOtp = async (
    req,
    res
) => {

    try {

        const {
            registrationId,
            otp,
        } = req.body;

        if (
            !registrationId ||
            !otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Registration ID and OTP are required",
            });
        }

        // -------------------------------------------------
        // FIND STUDENT
        // -------------------------------------------------

        const student =
            await HackathonStudent.findOne({

                registrationId:
                    registrationId.trim(),
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration ID not found",
            });
        }

        // -------------------------------------------------
        // CHECK OTP
        // -------------------------------------------------

        if (
            !student.projectOtpHash ||
            !student.projectOtpExpiresAt
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP not requested or expired",
            });
        }

        // -------------------------------------------------
        // CHECK EXPIRY
        // -------------------------------------------------

        if (
            student.projectOtpExpiresAt <
            new Date()
        ) {

            student.projectOtpHash =
                null;

            student.projectOtpExpiresAt =
                null;

            student.projectOtpAttempts =
                0;

            await student.save();

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired",
            });
        }

        // -------------------------------------------------
        // CHECK ATTEMPTS
        // -------------------------------------------------

        if (
            student.projectOtpAttempts >=
            MAX_OTP_ATTEMPTS
        ) {

            return res.status(429).json({

                success: false,

                message:
                    "Too many incorrect OTP attempts. Please request a new OTP.",
            });
        }

        // -------------------------------------------------
        // HASH PROVIDED OTP
        // -------------------------------------------------

        const receivedHash =
            hashOtp(otp);

        const receivedBuffer =
            Buffer.from(
                receivedHash,
                "hex"
            );

        const storedBuffer =
            Buffer.from(
                student.projectOtpHash,
                "hex"
            );

        const valid =
            receivedBuffer.length ===
                storedBuffer.length &&
            crypto.timingSafeEqual(
                receivedBuffer,
                storedBuffer
            );

        // -------------------------------------------------
        // INVALID OTP
        // -------------------------------------------------

        if (!valid) {

            student.projectOtpAttempts += 1;

            await student.save();

            return res.status(401).json({

                success: false,

                message:
                    "Invalid OTP",
            });
        }

        // -------------------------------------------------
        // OTP SUCCESS
        // -------------------------------------------------

        student.projectOtpHash =
            null;

        student.projectOtpExpiresAt =
            null;

        student.projectOtpAttempts =
            0;

        await student.save();

        // -------------------------------------------------
        // CREATE JWT
        // -------------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing"
            );

            return res.status(500).json({

                success: false,

                message:
                    "Authentication configuration error",
            });
        }

        const token =
            jwt.sign(

                {
                    studentId:
                        student._id.toString(),

                    registrationId:
                        student.registrationId,

                    purpose:
                        "HACKATHON_PROJECT",
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "2h",
                }
            );

        return res.status(200).json({

            success: true,

            message:
                "OTP verified successfully",

            token,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to verify OTP",
        });
    }
};

// =====================================================
// PROJECT AUTH MIDDLEWARE
// =====================================================

const verifyProjectAccess = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Project authentication required",
            });
        }

        const token =
            authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {

            return res.status(500).json({

                success: false,

                message:
                    "Authentication configuration error",
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (
            decoded.purpose !==
            "HACKATHON_PROJECT"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Invalid project access token",
            });
        }

        if (
            decoded.registrationId !==
            req.params.registrationId
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to access this project",
            });
        }

        req.projectUser =
            decoded;

        next();

    } catch (error) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired project access token",
        });
    }
};

// =====================================================
// GET STUDENT PROJECT
// =====================================================

const getStudentProject = async (
    req,
    res
) => {

    try {

        const student =
            await HackathonStudent.findOne({

                registrationId:
                    req.params.registrationId,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student project not found",
            });
        }

        return res.status(200).json({

            success: true,

            data: {

                registrationId:
                    student.registrationId,

                teamName:
                    student.teamName,

                teamMembers:
                    student.teamMembers,

                projectTitle:
                    student.projectTitle,

                projectDescription:
                    student.projectDescription,

                projectAbstract:
                    student.projectAbstract,

                hackathonTrack:
                    student.hackathonTrack,

                primaryTechnicalSkill:
                    student.primaryTechnicalSkill,

                status:
                    student.status,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to get project",
        });
    }
};

// =====================================================
// UPDATE STUDENT PROJECT
// =====================================================

const updateStudentProject = async (
    req,
    res
) => {

    try {

        const student =
            await HackathonStudent.findOne({

                registrationId:
                    req.params.registrationId,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student project not found",
            });
        }

        // -------------------------------------------------
        // ALLOWED FIELDS
        // -------------------------------------------------

        const allowedFields = [

            "projectTitle",

            "projectDescription",

            "projectAbstract",

            "hackathonTrack",

            "primaryTechnicalSkill",

            "teamMembers",
        ];

        // -------------------------------------------------
        // UPDATE
        // -------------------------------------------------

        allowedFields.forEach(
            (field) => {

                if (
                    req.body[field] !==
                    undefined
                ) {

                    student[field] =
                        req.body[field];
                }
            }
        );

        // -------------------------------------------------
        // TEAM MEMBERS VALIDATION
        // -------------------------------------------------

        if (
            req.body.teamMembers !==
            undefined
        ) {

            const teamError =
                validateTeamMembers(
                    req.body.teamMembers
                );

            if (teamError) {

                return res.status(400).json({

                    success: false,

                    message:
                        teamError,
                });
            }
        }

        await student.save();

        return res.status(200).json({

            success: true,

            message:
                "Project updated successfully",

            data: {

                registrationId:
                    student.registrationId,

                teamName:
                    student.teamName,

                teamMembers:
                    student.teamMembers,

                projectTitle:
                    student.projectTitle,

                projectDescription:
                    student.projectDescription,

                projectAbstract:
                    student.projectAbstract,

                hackathonTrack:
                    student.hackathonTrack,

                primaryTechnicalSkill:
                    student.primaryTechnicalSkill,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to update project",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {

    // Payment
    createHackathonPaymentOrder,
    verifyHackathonPayment,

    //manual payment
    createHackathonManualRegistration,

    // CRM
    getAllHackathonStudents,
    getHackathonStudent,
    createHackathonStudent,
    updateHackathonStudent,
    deleteHackathonStudent,

    // Project OTP
    requestProjectOtp,
    verifyProjectOtp,

    // Project
    getStudentProject,
    updateStudentProject,

    // Middleware
    verifyProjectAccess,
};