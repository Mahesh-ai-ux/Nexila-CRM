const axios = require("axios");

// =====================================================
// WATI CONFIGURATION
// =====================================================

const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_API_KEY = process.env.WATI_API_KEY;
const HACKATHON_PROJECT_DETAILS = process.env.HACKATHON_PROJECT_DETAILS_URL;

const sendHackathonRejectionWhatsApp = async (student) => {
  if (!WATI_BASE_URL || !WATI_API_KEY) {
    throw new Error("WATI configuration is missing");
  }

  if (!student) {
    throw new Error("Student details are missing");
  }

  const phone = String(student.phone || "").replace(/\D/g, "");

  if (phone.length !== 10) {
    throw new Error("Invalid student phone number");
  }

  if (!student.registrationId) {
    throw new Error("Registration ID is missing");
  }

  if (!student.projectTitle) {
    throw new Error("Project title is missing");
  }

  if (!student.teamName) {
    throw new Error("Team name is missing");
  }

  const whatsappNumber = `91${phone}`;

  // Replace these with your actual website URL and contact number.
 const NEXILA_OPPORTUNITIES_URL = "https://www.nexilatechnologies.com";
const NEXILA_CONTACT_NUMBER = "9803061234";

  const parameters = [
    {
      name: "1",
      value: String(student.fullName || student.name || ""),
    },
    {
      name: "2",
      value: String(student.registrationId),
    },
    {
      name: "3",
      value: String(student.projectTitle),
    },
    {
      name: "4",
      value: String(student.teamName),
    },
 {
  name: "5",
  value: "https://www.nexilatechnologies.com",
},
{
  name: "6",
  value: "9803061234",
},
  ];

  const url =
    `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
    `?whatsappNumber=${whatsappNumber}`;

  const requestBody = {
    template_name: "nex_hack_rejection_v1",
    broadcast_name: "nexila_hackathon_rejection",
    parameters,
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      Authorization: `Bearer ${WATI_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 15000,
  });

  return response.data;
};

const sendSemiFinalProjectSubmissionReminderWhatsApp = async (student) => {
  if (!WATI_BASE_URL || !WATI_API_KEY) {
    throw new Error("WATI configuration is missing");
  }

  if (!student) {
    throw new Error("Student details are missing");
  }

  const phone = String(student.phone || "").replace(/\D/g, "");

  if (phone.length !== 10) {
    throw new Error("Invalid student phone number");
  }

  if (!student.registrationId) {
    throw new Error("Registration ID is missing");
  }

  const whatsappNumber = `91${phone}`;

  const projectDetailsUrl =
    `${HACKATHON_PROJECT_DETAILS}?registrationId=${encodeURIComponent(
      student.registrationId
    )}`;

  const teamMembersCount = Array.isArray(student.teamMembers)
    ? student.teamMembers.length
    : 0;

  const parameters = [
    {
      name: "1",
      value: String(student.fullName || student.name || ""),
    },
    {
      name: "2",
      value: String(student.registrationId),
    },
    {
      name: "3",
      value: String(student.teamName || ""),
    },
    {
      name: "4",
      value: String(teamMembersCount),
    },
    {
        name: "5",
        value: String(student.projectTitle || ""),
    },
    {
      name: "6",
      value: projectDetailsUrl,
    },
  ];

  const url =
    `${WATI_BASE_URL}/api/v1/sendTemplateMessage` +
    `?whatsappNumber=${whatsappNumber}`;

  const requestBody = {
    template_name: "nex_hack_final_sub_v3", 
    broadcast_name: "nexila_project_details_reminder",
    parameters,
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      Authorization: `Bearer ${WATI_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 15000,
  });

  return response.data;
};
module.exports = {
    sendHackathonRejectionWhatsApp,
    sendSemiFinalProjectSubmissionReminderWhatsApp,
};

// nex_hack_rejection_v1
// nex_hack_final_sub_v3