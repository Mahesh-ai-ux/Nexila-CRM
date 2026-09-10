const axios = require("axios");

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;


const sendHackathonInterestWhatsApp = async (student) => {
  try {
    // Remove spaces, + and other characters
    const whatsappNumber = String(student.mobileNumber)
      .replace(/\D/g, "")
      .slice(-10);

    // Add India country code
    const fullWhatsappNumber = 91${whatsappNumber};

    const url =
      ${WATI_BASE_URL}/api/v1/sendTemplateMessage +
      ?whatsappNumber=${fullWhatsappNumber};

    const requestBody = {
      template_name: "hack_welcome_msg",
      broadcast_name: "nexila_hackathon_welcome"
    };

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          Authorization: Bearer ${WATI_API_KEY},
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        timeout: 15000
      }
    );

    console.log(
      "Hackathon welcome WhatsApp sent:",
      response.data
    );

    return response.data;

  } catch (error) {
    console.error(
      "Hackathon welcome WhatsApp error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = {
  sendHackathonInterestWhatsApp
};