const axios = require("axios");

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;

const HACKATHON_INTEREST_TEMPLATE =
  "nexila_hackathon_interest";

const sendHackathonInterestWhatsApp = async (student) => {

  try {

    // Remove spaces, + and other characters
    const whatsappNumber =
      String(student.mobileNumber)
        .replace(/\D/g, "")
        .slice(-10);

    // Add India country code
    const fullWhatsappNumber =
      `91${whatsappNumber}`;

    const registrationPage =
      "https://crm.nexilatechnologies.com/nexila-hackathon";

    const url =
      `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
      `?whatsappNumber=${fullWhatsappNumber}`;

    const requestBody = {

      template_name:
        HACKATHON_INTEREST_TEMPLATE,

      broadcast_name:
        "nexila_hackathon_interest",

      parameters: [

        {
          name: "1",
          value: student.name
        },

        {
          name: "2",
          value: student.email
        },

        {
          name: "3",
          value: student.mobileNumber
        },

        {
          name: "4",
          value: registrationPage
        },

        {
          name: "5",
          value: "9803061234"
        }

      ]

    };

    const response =
      await axios.post(
        url,
        requestBody,
        {
          headers: {

            Authorization:
              `Bearer ${WATI_API_KEY}`,

            "Content-Type":
              "application/json",

            Accept:
              "application/json"

          },

          timeout: 15000

        }
      );

    console.log(
      "Hackathon interest WhatsApp sent:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Hackathon interest WhatsApp error:",
      error.response?.data ||
      error.message
    );

    throw error;

  }

};

module.exports = {
  sendHackathonInterestWhatsApp
};