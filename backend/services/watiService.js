const axios = require("axios");

// =====================================================
// WATI CONFIGURATION
// =====================================================

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;

// =====================================================
// SEND HACKATHON REGISTRATION SUCCESS WHATSAPP
// =====================================================

const sendHackathonWhatsApp = async (student) => {

    try {

        // =================================================
        // VALIDATE CONFIGURATION
        // =================================================

        if (!WATI_BASE_URL) {
            throw new Error("WATI_BASE_URL is missing");
        }

        if (!WATI_API_KEY) {
            throw new Error("WATI_API_KEY is missing");
        }

        // =================================================
        // VALIDATE PHONE
        // =================================================

        if (!student.phone) {
            throw new Error(
                "Student phone number is required"
            );
        }

        // =================================================
        // CLEAN PHONE NUMBER
        // =================================================

        const phoneNumber = String(student.phone)
            .replace(/\D/g, "")
            .trim();

        if (phoneNumber.length !== 10) {
            throw new Error(
                "Student phone number must contain 10 digits"
            );
        }

        // India country code
        const whatsappNumber = `91${phoneNumber}`;

        // =================================================
        // TEMPLATE PARAMETERS
        // =================================================
        //
        // Template:
        //
        // Hello {{1}},
        //
        // Your Nexila Hackathon registration has been
        // successfully completed.
        //
        // College: {{2}}
        // Project: {{3}}
        // Team Size: {{4}}
        // Amount Paid: ₹{{5}}
        // Payment Status: {{6}}
        //
        // =================================================

        const parameters = [
            {
                name: "1",
                value: String(
                    student.fullName || ""
                ),
            },

            {
                name: "2",
                value: String(
                    student.collegeName || ""
                ),
            },

            {
                name: "3",
                value: String(
                    student.projectTitle || ""
                ),
            },

            {
                name: "4",
                value: String(
                    student.teamMembers?.length || 0
                ),
            },

            {
                name: "5",
                value: String(
                    student.paymentAmount || 0
                ),
            },

            {
                name: "6",
                value: String(
                    student.paymentStatus || ""
                ),
            },
        ];

        // =================================================
        // WATI API URL
        // =================================================
        //
        // IMPORTANT:
        // whatsappNumber must be in QUERY PARAMETER
        //
        // =================================================

        const url =
            `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
            `?whatsappNumber=${whatsappNumber}`;

        // =================================================
        // REQUEST BODY
        // =================================================

        const requestBody = {

            template_name:
                "nexila_hackathon_registration_success",

            broadcast_name:
                "nexila_hackathon_registration",

            parameters,
        };

        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "WATI WHATSAPP REQUEST"
        );

        console.log(
            "URL:",
            url
        );

        console.log(
            "WhatsApp Number:",
            whatsappNumber
        );

        console.log(
            "Template:",
            requestBody.template_name
        );

        console.log(
            "Parameters:",
            JSON.stringify(
                parameters,
                null,
                2
            )
        );

        console.log(
            "API KEY EXISTS:",
            Boolean(WATI_API_KEY)
        );

        console.log(
            "API KEY LENGTH:",
            WATI_API_KEY.length
        );

        console.log(
            "================================="
        );

        // =================================================
        // SEND REQUEST
        // =================================================

        const response = await axios.post(
            url,
            requestBody,
            {
                headers: {

                    Authorization:
                        `Bearer ${WATI_API_KEY}`,

                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json",
                },

                timeout: 15000,
            }
        );

        // =================================================
        // SUCCESS
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "WATI WHATSAPP SENT SUCCESSFULLY"
        );

        console.log(
            response.data
        );

        console.log(
            "================================="
        );

        return response.data;

    } catch (error) {

        // =================================================
        // ERROR
        // =================================================

        console.error(
            "================================="
        );

        console.error(
            "WATI ERROR"
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "Headers:",
            error.response?.headers
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "================================="
        );

        throw error;
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendHackathonWhatsApp,
};