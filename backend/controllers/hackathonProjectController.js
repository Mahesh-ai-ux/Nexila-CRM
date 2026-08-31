const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const HackathonStudent = require("../models/dbsHackathonStudent.js")

const {
    sendProjectOtpEmail,
} = require("../services/hackathonEmailService");

// =====================================================
// PROJECT DEADLINE
// =====================================================

const PROJECT_DEADLINE =
    new Date("2026-10-03T23:59:59+05:30");

// =====================================================
// CHECK DEADLINE
// =====================================================

const checkProjectDeadline = () => {

    return new Date() <= PROJECT_DEADLINE;
};

// =====================================================
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

        // ---------------------------------------------
        // DEADLINE
        // ---------------------------------------------

        if (!checkProjectDeadline()) {

            return res.status(403).json({

                success: false,

                message:
                    "Project submission period has ended",

            });
        }

        // ---------------------------------------------
        // FIND STUDENT
        // ---------------------------------------------

        const student =
            await HackathonStudent.findOne({
                registrationId,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration not found",

            });
        }

        // ---------------------------------------------
        // CHECK PAYMENT
        // ---------------------------------------------

        if (
            student.paymentStatus !==
            "PAID"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Project access is available only after successful payment",

            });
        }

        // ---------------------------------------------
        // RATE LIMIT
        // ---------------------------------------------

        if (
            student.projectOtpLastSentAt
        ) {

            const secondsSinceLastOtp =
                (
                    Date.now() -
                    new Date(
                        student.projectOtpLastSentAt
                    ).getTime()
                ) / 1000;

            if (
                secondsSinceLastOtp < 60
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Please wait 60 seconds before requesting another OTP",

                });
            }
        }

        // ---------------------------------------------
        // GENERATE OTP
        // ---------------------------------------------

        const otp =
            crypto.randomInt(
                100000,
                1000000
            ).toString();

        // ---------------------------------------------
        // HASH OTP
        // ---------------------------------------------

        const otpHash =
            crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

        // ---------------------------------------------
        // SAVE OTP
        // ---------------------------------------------

        student.projectOtpHash =
            otpHash;

        student.projectOtpExpiresAt =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        student.projectOtpAttempts =
            0;

        student.projectOtpLastSentAt =
            new Date();

        await student.save();

        // ---------------------------------------------
        // SEND OTP
        // ---------------------------------------------

        await sendProjectOtpEmail(
            student,
            otp
        );

        return res.status(200).json({

            success: true,

            message:
                "OTP sent to the Team Lead email address",

        });

    } catch (error) {

        console.error(
            "Request Project OTP Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to send OTP",

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

        // ---------------------------------------------
        // DEADLINE
        // ---------------------------------------------

        if (!checkProjectDeadline()) {

            return res.status(403).json({

                success: false,

                message:
                    "Project submission period has ended",

            });
        }

        // ---------------------------------------------
        // FIND STUDENT
        // ---------------------------------------------

        const student =
            await HackathonStudent.findOne({
                registrationId,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration not found",

            });
        }

        // ---------------------------------------------
        // OTP EXISTS
        // ---------------------------------------------

        if (
            !student.projectOtpHash ||
            !student.projectOtpExpiresAt
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please request a new OTP",

            });
        }

        // ---------------------------------------------
        // OTP EXPIRY
        // ---------------------------------------------

        if (
            new Date() >
            new Date(
                student.projectOtpExpiresAt
            )
        ) {

            student.projectOtpHash = null;

            student.projectOtpExpiresAt =
                null;

            student.projectOtpAttempts =
                0;

            await student.save();

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired. Please request a new OTP",

            });
        }

        // ---------------------------------------------
        // ATTEMPT LIMIT
        // ---------------------------------------------

        if (
            student.projectOtpAttempts >=
            5
        ) {

            return res.status(429).json({

                success: false,

                message:
                    "Too many incorrect OTP attempts. Please request a new OTP",

            });
        }

        // ---------------------------------------------
        // HASH RECEIVED OTP
        // ---------------------------------------------

        const receivedHash =
            crypto
                .createHash("sha256")
                .update(
                    String(otp)
                )
                .digest("hex");

        // ---------------------------------------------
        // COMPARE
        // ---------------------------------------------

        if (
            receivedHash !==
            student.projectOtpHash
        ) {

            student.projectOtpAttempts += 1;

            await student.save();

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP",

            });
        }

        // ---------------------------------------------
        // OTP SUCCESS
        // ---------------------------------------------

        student.projectOtpHash = null;

        student.projectOtpExpiresAt =
            null;

        student.projectOtpAttempts =
            0;

        await student.save();

        // ---------------------------------------------
        // CREATE PROJECT ACCESS TOKEN
        // ---------------------------------------------

        const secret =
            process.env.PROJECT_ACCESS_SECRET ||
            process.env.JWT_SECRET;

        if (!secret) {

            return res.status(500).json({

                success: false,

                message:
                    "Project access secret is not configured",

            });
        }

        const token =
            jwt.sign(

                {
                    type:
                        "hackathon-project",

                    registrationId:
                        student.registrationId,

                },

                secret,

                {
                    expiresIn:
                        "30m",
                }
            );

        return res.status(200).json({

            success: true,

            message:
                "OTP verified successfully",

            accessToken:
                token,

        });

    } catch (error) {

        console.error(
            "Verify Project OTP Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to verify OTP",

        });
    }
};

// =====================================================
// GET PROJECT
// =====================================================

const getStudentProject = async (
    req,
    res
) => {

    try {

        const {
            registrationId,
        } = req.params;

        const student =
            await HackathonStudent.findOne({
                registrationId,
            }).lean();

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration not found",

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

                problemStatement:
                    student.problemStatement,

                proposedSolution:
                    student.proposedSolution,

                techStack:
                    student.techStack,

                architectureDiagram:
                    student.architectureDiagram,

                expectedOutcome:
                    student.expectedOutcome,

                demoLink:
                    student.demoLink,

                githubLink:
                    student.githubLink,
//drive link
                driveLink:
                    student.driveLink,

                

            },

        });

    } catch (error) {

        console.error(
            "Get Student Project Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch project details",

        });
    }
};

// =====================================================
// UPDATE PROJECT
// =====================================================

const updateStudentProject =
    async (
        req,
        res
    ) => {

        try {

            const {
                registrationId,
            } = req.params;

            const student =
                await HackathonStudent.findOne({
                    registrationId,
                });

            if (!student) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Registration not found",

                });
            }

            // -----------------------------------------
            // DEADLINE
            // -----------------------------------------

            if (
                !checkProjectDeadline()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Project submission period has ended",

                });
            }

            // -----------------------------------------
            // ONLY PROJECT FIELDS
            // -----------------------------------------

            const allowedFields = [

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

                "driveLink" //drive link

            ];

            for (
                const field of allowedFields
            ) {

                if (
                    req.body[field] !==
                    undefined
                ) {

                    student[field] =
                        req.body[field];
                }
            }

            await student.save();

            return res.status(200).json({

                success: true,

                message:
                    "Project details saved successfully",

                data: {

                    registrationId:
                        student.registrationId,

                    teamName:
                        student.teamName,

                    projectTitle:
                        student.projectTitle,

                    projectDescription:
                        student.projectDescription,

                    projectAbstract:
                        student.projectAbstract,

                    problemStatement:
                        student.problemStatement,

                    proposedSolution:
                        student.proposedSolution,

                    techStack:
                        student.techStack,

                    architectureDiagram:
                        student.architectureDiagram,

                    expectedOutcome:
                        student.expectedOutcome,

                    demoLink:
                        student.demoLink,

                    githubLink:
                        student.githubLink,

                    driveLink:
                    student.driveLink, //drive link

                },

            });

        } catch (error) {

            console.error(
                "Update Student Project Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update project details",

            });
        }
    };

module.exports = {

    requestProjectOtp,

    verifyProjectOtp,

    getStudentProject,

    updateStudentProject,

};