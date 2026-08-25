const axios = require("axios");

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;


// =====================================================
// HACKATHON REGISTRATION SUCCESS WHATSAPP
// =====================================================

const sendHackathonWhatsApp = async (student) => {

    try {

        if (!student.phone) {
            throw new Error(
                "Student phone number is required"
            );
        }


        // ============================================
        // PHONE
        // ============================================

        const phoneNumber = `91${student.phone}`;


        // ============================================
        // TEMPLATE PARAMETERS
        // ============================================

        const parameters = [
            {
                name: "1",
                value: student.fullName,
            },
            {
                name: "2",
                value: student.fullName,
            },
            {
                name: "3",
                value: student.collegeName,
            },
            {
                name: "4",
                value: student.projectTitle,
            },
            {
                name: "5",
                value: String(
                    student.teamMembers.length
                ),
            },
            {
                name: "6",
                value: String(
                    student.paymentAmount
                ),
            },
            {
                name: "7",
                value: student.paymentStatus,
            },
        ];


        // ============================================
        // WATI REQUEST
        // ============================================

        const response = await axios.post(

            `${WATI_BASE_URL}/sendTemplateMessage`,

            {
                whatsappNumber: phoneNumber,

                template_name:
                    "nexila_hackathon_registration_success",

                broadcast_name:
                    "nexila_hackathon_registration",

                parameters,
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${WATI_API_KEY}`,

                    "Content-Type":
                        "application/json",
                },
            }
        );


        console.log(
            "Hackathon WhatsApp sent:",
            response.data
        );


        return response.data;

    } catch (error) {

        console.error(
            "WATI Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


module.exports = {
    sendHackathonWhatsApp,
};