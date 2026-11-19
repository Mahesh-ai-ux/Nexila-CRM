
const formatValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return "-";
  }

  return String(value).trim();
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatAmount = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "₹0";

  return `₹${amount.toLocaleString("en-IN")}`;
};

const getWelcomeMessage = (lookingfor) => {
  const type = String(lookingfor || "").toLowerCase();

  if (type.includes("internship")) {
    return `Welcome to Nexila Technologies!

We are happy to have you join our internship journey. We look forward to helping you develop your technical skills through practical learning and real-world experience.`;
  }

  if (type.includes("course")) {
    return `Welcome to Nexila Technologies!

We are excited to be part of your learning journey. Get ready to strengthen your technical knowledge through practical training and hands-on projects.`;
  }

  if (type.includes("project")) {
    return `Welcome to Nexila Technologies!

We are glad to support your project journey. We look forward to helping you build practical skills and develop your ideas into working projects.`;
  }

  if (type.includes("job") || type.includes("placement")) {
    return `Welcome to Nexila Technologies!

Thank you for connecting with us. We look forward to supporting you in your career and professional development journey.`;
  }

  return `Welcome to Nexila Technologies!

Thank you for connecting with us. We appreciate your interest and look forward to assisting you.`;
};

const generateLeadWatiMessage = (lead) => {
  const lookingfor = formatValue(lead.lookingfor);

  const lines = [
    `*Name:* ${formatValue(lead.name)}`,
    `*Phone:* ${formatValue(lead.phone)}`,
    `*Email:* ${formatValue(lead.email)}`,
    `*College:* ${formatValue(lead.collegename)}`,
  ];

  // Show College Register ID only when available.
  if (lead.collegeRegisterId) {
    lines.push(
      `*College Register ID:* ${formatValue(lead.collegeRegisterId)}`
    );
  }

  lines.push(
    `*Location:* ${formatValue(lead.location)}`,
    `*Domain:* ${formatValue(lead.domain)}`,
    `*Graduate:* ${formatValue(lead.graduate)}`,
    `*Looking For:* ${lookingfor}`
  );

  // Internship-specific details.
  if (lookingfor.toLowerCase().includes("internship")) {
    lines.push(
      `*Internship:* ${formatValue(lead.internshipduration)}`,
      `*Join Date:* ${formatDate(lead.dateofjoin)}`
    );

    // Adjust these property names to match your Lead schema.
    const groupId = lead.groupInternshipId;

    lines.push(
  `*Group Internship ID:* ${
    groupId
      ? formatValue(groupId)
      : "Not for individual internship"
  }`
);
  }

  // Payment details.
  lines.push(
    `*Payment Status:* ${formatValue(lead.paymentStatus)}`,
    `*Fees:* ${formatAmount(lead.fees)}`,
    `*Paid:* ${formatAmount(lead.feepaid)}`,
    `*Pending:* ${formatAmount(lead.pendingfee)}`
  );

  return `${getWelcomeMessage(lead.lookingfor)}

--------------------------------
*LEAD DETAILS*
--------------------------------

${lines.join("\n")}

--------------------------------

For any assistance, please feel free to contact our team.

Regards,
*Nexila Technologies*
Learn. Build. Get Hired.`;
};

module.exports = generateLeadWatiMessage;