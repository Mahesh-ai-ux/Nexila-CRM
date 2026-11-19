
const axios = require("axios");

// =====================================================
// WATI CONFIGURATION
// =====================================================

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;

// =====================================================
// CREATE LEAD WATI MESSAGE
// =====================================================

const createLeadWatiMsg = async (lead) => {
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

    if (!lead) {
      throw new Error("Lead details are required");
    }

    // =================================================
    // VALIDATE PHONE
    // =================================================

    if (!lead.phone) {
      throw new Error("Lead phone number is required");
    }

    const phoneNumber = String(lead.phone)
      .replace(/\D/g, "")
      .trim();

    if (phoneNumber.length !== 10) {
      throw new Error("Lead phone number must contain 10 digits");
    }

    // =================================================
    // INDIA COUNTRY CODE
    // =================================================

    const whatsappNumber = `91${phoneNumber}`;

    // =================================================
    // TEMPLATE VALUES
    // =================================================

    const name = String(lead.name || "Customer");
    const domain = String(lead.domain || "your selected domain");
    const program = String(lead.lookingfor || "Program");

    // =================================================
    // WATI TEMPLATE PARAMETERS
    // =================================================

    // {{1}} - Name
    // {{2}} - Domain
    // {{3}} - Program

    const parameters = [
      {
        name: "1",
        value: name,
      },
      {
        name: "2",
        value: domain,
      },
      {
        name: "3",
        value: program,
      },
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
      template_name: "nexila_crm_lead_welcome",
      broadcast_name: "nexila_lead_created",
      parameters,
    };

    // =================================================
    // DEBUG LOGGING
    // =================================================

    console.log("================================= - leadWatiService.js:109");
    console.log("LEAD WATI WHATSAPP REQUEST - leadWatiService.js:110");
    console.log("================================= - leadWatiService.js:111");

    console.log("WhatsApp Number: - leadWatiService.js:113", whatsappNumber);
    console.log("Template: - leadWatiService.js:114", requestBody.template_name);
    console.log("Lead Name: - leadWatiService.js:115", name);
    console.log("Domain: - leadWatiService.js:116", domain);
    console.log("Program: - leadWatiService.js:117", program);
    console.log("Parameters: - leadWatiService.js:118", JSON.stringify(parameters, null, 2));

    // =================================================
    // SEND REQUEST TO WATI
    // =================================================

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${WATI_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      }
    );

    // =================================================
    // SUCCESS
    // =================================================

    console.log("LEAD WATI MESSAGE SENT SUCCESSFULLY - leadWatiService.js:141");
    console.log("Response: - leadWatiService.js:142", response.data);

    return response.data;

  } catch (error) {

    // =================================================
    // ERROR
    // =================================================

    console.error("LEAD WATI WHATSAPP ERROR - leadWatiService.js:152");
    console.error("Status: - leadWatiService.js:153", error.response?.status);
    console.error("Response: - leadWatiService.js:154", error.response?.data);
    console.error("Message: - leadWatiService.js:155", error.message);

    return false;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = createLeadWatiMsg;