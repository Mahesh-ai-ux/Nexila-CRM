
const axios = require("axios");

// =====================================================
// WATI CONFIGURATION
// =====================================================

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;

// =====================================================
// COMMON WATI SENDER
// =====================================================

const sendWatiTemplate = async (lead, templateName, broadcastName, parameters) => {
  try {
    if (!WATI_BASE_URL) {
      throw new Error("WATI_BASE_URL is missing");
    }

    if (!WATI_API_KEY) {
      throw new Error("WATI_API_KEY is missing");
    }

    if (!lead?.phone) {
      throw new Error("Lead phone number is required");
    }

    const phoneNumber = String(lead.phone).replace(/\D/g, "").trim();

    if (phoneNumber.length !== 10) {
      throw new Error("Lead phone number must contain 10 digits");
    }

    const whatsappNumber = `91${phoneNumber}`;

    const url =
      `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
      `?whatsappNumber=${whatsappNumber}`;

    const requestBody = {
      template_name: templateName,
      broadcast_name: broadcastName,
      parameters,
    };

    console.log("Lead Status WATI: - leadUpdateStatusWatiService.js:47", templateName);
    console.log("WhatsApp Number: - leadUpdateStatusWatiService.js:48", whatsappNumber);
    console.log("Parameters: - leadUpdateStatusWatiService.js:49", JSON.stringify(parameters, null, 2));

    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${WATI_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    });

    console.log("Lead Status WATI Success: - leadUpdateStatusWatiService.js:60", response.data);

    return response.data;

  } catch (error) {
    console.error("Lead Status WATI Error: - leadUpdateStatusWatiService.js:65", error.response?.status);
    console.error("WATI Response: - leadUpdateStatusWatiService.js:66", error.response?.data || error.message);

    return false;
  }
};

// =====================================================
// FOLLOW-UP 1, 2, 3
// =====================================================

const sendLeadFollowUpWati = async (lead) => {
  return sendWatiTemplate(
    lead,
    "nexila_lead_followup",
    "nexila_lead_followup",
    [
      { name: "1", value: String(lead.name || "Customer") },
      { name: "2", value: String(lead.domain || "-") },
      { name: "3", value: String(lead.lookingfor || "-") },
    ]
  );
};

// =====================================================
// NOT ANSWERING / SWITCH-OFF
// =====================================================

const sendLeadNotReachableWati = async (lead) => {
  return sendWatiTemplate(
    lead,
    "nexila_lead_not_reachable",
    "nexila_lead_not_reachable",
    [
      { name: "1", value: String(lead.name || "Customer") },
      { name: "2", value: String(lead.domain || "-") },
      { name: "3", value: String(lead.lookingfor || "-") },
    ]
  );
};

// =====================================================
// NOT INTERESTED / DROP OUT
// =====================================================

const sendLeadNotInterestedWati = async (lead) => {
  return sendWatiTemplate(
    lead,
    "nexila_lead_not_interested_v1",
    "nexila_lead_not_interested",
    [
      { name: "1", value: String(lead.name || "Customer") },
    ]
  );
};

// =====================================================
// STUDENT
// =====================================================

const sendLeadStudentWati = async (lead) => {
  return sendWatiTemplate(
    lead,
    "nexila_lead_student",
    "nexila_lead_student",
    [
      { name: "1", value: String(lead.name || "Customer") },
      { name: "2", value: String(lead.domain || "-") },
      { name: "3", value: String(lead.lookingfor || "-") },
    ]
  );
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendLeadFollowUpWati,
  sendLeadNotReachableWati,
  sendLeadNotInterestedWati,
  sendLeadStudentWati,
};