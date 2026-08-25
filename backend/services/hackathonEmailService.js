const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// =====================================================
// EMAIL 1
// Registration Preview
// =====================================================

const sendRegistrationPreview = async (student) => {
  const teamMembers = student.teamMembers
    .map(
      (member, index) =>
        `${index + 1}. ${member.name} - ${member.phone} - ${member.collegeRollNo}`
    )
    .join("\n");

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: student.email,
    subject: "Hackathon Registration Preview",

    text: `
Hackathon Registration Preview

Name: ${student.fullName}
Phone: ${student.phone}
Email: ${student.email}

College: ${student.collegeName}
Degree: ${student.degree}
Department: ${student.department}
College Roll No: ${student.collegeRollNo}
City: ${student.city}

Project Title:
${student.projectTitle}

Project Description:
${student.projectDescription}

Project Abstract:
${student.projectAbstract}

Team Members:

${teamMembers}

Please verify your registration details.
`,
  });
};

// =====================================================
// EMAIL 2
// Registration Success
// =====================================================

const sendRegistrationSuccess = async (student) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: student.email,
    subject: "Hackathon Registration Successful",

    text: `
Hello ${student.fullName},

Your hackathon registration has been successfully submitted.

Registration Details:

Name: ${student.fullName}
College: ${student.collegeName}
Project: ${student.projectTitle}

We have successfully received your registration.

Thank you for registering for the hackathon.

Regards,
Hackathon Team
`,
  });
};

module.exports = {
  sendRegistrationPreview,
  sendRegistrationSuccess,
};