const axios = require("axios");

// =====================================================
// WATI CONFIGURATION
// =====================================================

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;
const HACKATHON_PROJECT_DETAILS = process.env.HACKATHON_PROJECT_DETAILS_URL;




// =====================================================
// SEND HACKATHON REGISTRATION SUCCESS WHATSAPP
// =====================================================

const sendHackathonWhatsApp = async (student) => {
const projectDetailsUrl =
    `${HACKATHON_PROJECT_DETAILS}?registrationId=${encodeURIComponent(
        student.registrationId
    )}`;
    try {

        // =================================================
        // VALIDATE CONFIGURATION
        // =================================================

        if (!WATI_BASE_URL) {
            throw new Error(
                "WATI_BASE_URL is missing"
            );
        }

        if (!WATI_API_KEY) {
            throw new Error(
                "WATI_API_KEY is missing"
            );
        }

        if (!projectDetailsUrl) {
            throw new Error(
                "Project details URL is missing"
            );
        }


        // =================================================
        // VALIDATE STUDENT
        // =================================================

        if (!student) {
            throw new Error(
                "Student details are required"
            );
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


        // =================================================
        // INDIA COUNTRY CODE
        // =================================================

        const whatsappNumber = `91${phoneNumber}`;


        // =================================================
        // TEAM MEMBERS COUNT
        // =================================================

        const teamMembersCount =
            Array.isArray(student.teamMembers)
                ? student.teamMembers.length
                : 0;


        // =================================================
        // WATI TEMPLATE PARAMETERS
        // =================================================
        //
        // {{1}} - Student / Team Lead Name
        // {{2}} - Registration ID
        // {{3}} - Team Lead
        // {{4}} - College
        // {{5}} - Team Name
        // {{6}} - Team Members
        // {{7}} - Hackathon Track
        // {{8}} - Primary Technical Skill
        // {{9}} - Project Details URL
        //
        // =================================================

        const parameters = [

            // {{1}}
            {
                name: "1",
                value: String(
                    student.fullName || ""
                ),
            },


            // {{2}}
            {
                name: "2",
                value: String(
                    student.registrationId || ""
                ),
            },


            // {{3}}
            {
                name: "3",
                value: String(
                    student.fullName || ""
                ),
            },


            // {{4}}
            {
                name: "4",
                value: String(
                    student.collegeName || ""
                ),
            },


            // {{5}}
            {
                name: "5",
                value: String(
                    student.teamName || ""
                ),
            },


            // {{6}}
            {
                name: "6",
                value: String(
                    teamMembersCount
                ),
            },


            // {{7}}
            {
                name: "7",
                value: String(
                    student.hackathonTrack || ""
                ),
            },


            // {{8}}
            {
                name: "8",
                value: String(
                    student.primaryTechnicalSkill || ""
                ),
            },


            // {{9}}
            {
                name: "9",
                value:
                    projectDetailsUrl,
            },

            // {{10}}
            {
                name: "10",
                value:
                    String(
                        student.paymentStatus || ""
                    )
            }

        ];


        // =================================================
        // WATI API URL
        // =================================================

        const url =
            `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
            `?whatsappNumber=${whatsappNumber}`;


        // =================================================
        // REQUEST BODY
        // =================================================

        const requestBody = {

            template_name:
                "nexila_hackathon_registration_success2",

            broadcast_name:
                "nexila_hackathon_registration2",

            parameters,

        };


        // =================================================
        // DEBUG LOGGING
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "WATI WHATSAPP REQUEST"
        );

        console.log(
            "================================="
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
            "Registration ID:",
            student.registrationId
        );

        console.log(
            "Team Lead:",
            student.fullName
        );

        console.log(
            "Team Name:",
            student.teamName
        );

        console.log(
            "College:",
            student.collegeName
        );

        console.log(
            "Team Members:",
            teamMembersCount
        );

        console.log(
            "Hackathon Track:",
            student.hackathonTrack
        );

        console.log(
            "Primary Technical Skill:",
            student.primaryTechnicalSkill
        );

        console.log(
            "Payment Status:",
            student.paymentStatus
        );

        console.log(
            "Project Details URL:",
            projectDetailsUrl
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
        // SEND REQUEST TO WATI
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
            "Response:",
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
            "WATI WHATSAPP ERROR"
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