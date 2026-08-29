const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

// =====================================================
// VERIFY MAIL CONFIGURATION
// =====================================================

const verifyMailTransporter = async () => {
    try {
        await transporter.verify();

        console.log(
            "Hackathon email service is ready"
        );
    } catch (error) {
        console.error(
            "Hackathon email service error:"
        );

        console.error(error);
    }
};

// =====================================================
// EMAIL 1
// REGISTRATION SUCCESS
// =====================================================

const sendRegistrationSuccess = async (student) => {

    const mail = {
        from: `"Nexila Hackathon" <${process.env.MAIL_USER}>`,

        to: student.email,

        subject:
            "Nexila Hackathon - Registration Successful",

        text: `
Hello ${student.fullName},

Your Nexila Hackathon registration has been successfully completed.

========================================
REGISTRATION DETAILS
========================================

Registration ID : ${student.registrationId}

Team Name       : ${student.teamName}

Payment Status  : ${student.paymentStatus}

Amount Paid     : ₹${student.amount}

Payment Date    : ${
            student.paidAt
                ? new Date(student.paidAt).toLocaleString("en-IN")
                : "-"
        }

========================================

Your registration and payment have been successfully received.

Please keep your Registration ID safely for future communication.

Regards,
Nexila Hackathon Team
        `,
    };

    const info = await transporter.sendMail(mail);

    console.log(
        "Registration success email sent:",
        info.messageId
    );

    return info;
};

// =====================================================
// EMAIL 2
// TEAM DETAILS + PROJECT DETAILS LINK
// =====================================================

const sendTeamDetailsEmail = async (student) => {

    const teamMembers = (student.teamMembers || [])
        .map((member, index) => {

            const role =
                index === 0
                    ? "Team Lead"
                    : `Team Member ${index + 1}`;

            return `
${role}

Name            : ${member.name}
Phone Number    : ${member.phone}
College Roll No : ${member.collegeRollNo}
`;
        })
        .join("\n");

    // IMPORTANT:
    // Use the same environment variable name everywhere.

    const baseUrl =
        process.env.HACKATHON_PROJECT_DETAILS_URL;

    if (!baseUrl) {

        throw new Error(
            "HACKATHON_PROJECT_DETAILS_URL is not configured"
        );
    }

    const projectDetailsLink =
        `${baseUrl}?registrationId=${encodeURIComponent(
            student.registrationId
        )}`;

    const mail = {

        from:
            `"Nexila Hackathon" <${process.env.MAIL_USER}>`,

        to:
            student.email,

        subject:
            "Nexila Hackathon - Team Details & Project Submission",

        text: `
Hello ${student.fullName},

Your Nexila Hackathon registration has been confirmed successfully.

========================================
REGISTRATION DETAILS
========================================

Registration ID : ${student.registrationId}

Team Name       : ${student.teamName}

College         : ${student.collegeName}

Hackathon Track : ${student.hackathonTrack}

========================================
TEAM MEMBERS
========================================

${teamMembers}

========================================
PROJECT DETAILS
========================================

Your registration is complete.

You can now submit your project details using the link below:

${projectDetailsLink}

You will need to verify an OTP sent to the Team Lead's registered email address before editing project details.

The project details submission/edit link is valid until September 20, 2026.

After OTP verification, you can enter:

1. Project Title
2. Project Description / Outline
3. Project Abstract
4. Problem Statement
5. Proposed Solution
6. Tech Stack
7. Architecture Diagram
8. Expected Outcome
9. Demo Link
10. GitHub Link

Your team details are permanently locked and cannot be changed through this page.

For security, every new edit session requires OTP verification.

Please keep your Registration ID safely.

Regards,
Nexila Hackathon Team
        `,
    };

    const info =
        await transporter.sendMail(mail);

    console.log(
        "Team/project email sent:",
        info.messageId
    );

    return info;
};

// =====================================================
// OTP EMAIL
// =====================================================

const sendProjectOtpEmail = async (
    student,
    otp
) => {

    const mail = {

        from:
            `"Nexila Hackathon" <${process.env.MAIL_USER}>`,

        to:
            student.email,

        subject:
            "Nexila Hackathon - Project Details OTP",

        text: `
Hello ${student.fullName},

Your OTP for accessing your Hackathon project details is:

${otp}

Registration ID : ${student.registrationId}

Team Name       : ${student.teamName}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

If you did not request access to your project details, please ignore this email.

Regards,
Nexila Hackathon Team
        `,
    };

    const info =
        await transporter.sendMail(mail);

    console.log(
        "Project OTP email sent:",
        info.messageId
    );

    return info;
};

module.exports = {
    transporter,
    verifyMailTransporter,
    sendRegistrationSuccess,
    sendTeamDetailsEmail,
    sendProjectOtpEmail,
};