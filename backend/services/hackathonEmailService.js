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

const path = require("path");

// QR image location
const paymentQrPath = path.join(
    __dirname,
    "../public/hackathon500payment.jpeg"
);

const sendManualRegistrationSuccess = async (student) => {

    const mail = {
        from: `"Nexila Hackathon" <${process.env.MAIL_USER}>`,
        to: student.email,

        subject:
            "Nexila Hackathon - Registration Successful",

text: `
Hello ${student.fullName},

Thank you for registering for the Nexila Hackathon.

Your hackathon registration has been successfully completed.

========================================
REGISTRATION DETAILS
========================================

Registration ID : ${student.registrationId}
Team Name       : ${student.teamName}
Payment Status  : ${student.paymentStatus}

========================================
PAYMENT DETAILS
========================================

Registration Fee : ₹500

Please complete the payment using the QR code
provided in this email.

The payment QR code is also attached as:
hackathon500payment.jpeg


IMPORTANT – PAYMENT VERIFICATION
========================================

If your payment status is currently showing as
"Pending", please complete the payment and send
a clear screenshot of the successful payment to
the Nexila Technologies WhatsApp number:

WhatsApp: +91 9803061234

Along with the payment screenshot, please send
the following details:

Registration ID     : ${student.registrationId}
Team Lead Name      : ${student.fullName}
Team Name           : ${student.teamName}
Mobile Number       : Your registered mobile number

These details are required to help our team
identify and verify your payment correctly.

Once the payment screenshot and required details
have been received, our team will manually verify
the payment and update your payment status.

========================================
PROJECT SUBMISSION ACCESS
========================================

After your payment has been successfully verified,
you will receive a separate email containing the
access/details required to submit your Hackathon
Project Details.

Please wait for the confirmation email before
submitting your project details.


========================================
NEED HELP?
========================================

If you have any questions regarding your registration,
payment, or the hackathon, please contact the
Nexila Hackathon Team on WhatsApp:

+91 9803061234


Please keep your Registration ID safely for all
future hackathon-related communication.

We look forward to your participation in the
Nexila Hackathon.

Regards,
Nexila Hackathon Team
Nexila Technologies
`,

html: `
<div style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #333333;
    line-height: 1.6;
">

    <div style="
        max-width: 680px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    ">

        <!-- HEADER -->
        <div style="
            background-color: #0d6efd;
            padding: 30px 25px;
            text-align: center;
        ">

           
            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                font-weight: 600;
            ">
                Nexila Hackathon
            </h1>

            <p style="
                margin: 8px 0 0;
                color: #eaf2ff;
                font-size: 14px;
            ">
                Registration Confirmation
            </p>

        </div>


        <!-- MAIN CONTENT -->
        <div style="
            padding: 35px 30px;
        ">

            <!-- GREETING -->

            <p style="
                margin-top: 0;
                font-size: 16px;
            ">
                Hello <strong>${student.fullName}</strong>,
            </p>

            <p style="font-size: 15px;">
                Thank you for registering for the
                <strong>Nexila Hackathon</strong>.
            </p>

            <p style="font-size: 15px;">
                Your hackathon registration has been
                <strong style="color: #198754;">
                    successfully completed.
                </strong>
            </p>


            <!-- REGISTRATION DETAILS -->

            <div style="
                margin-top: 28px;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                overflow: hidden;
            ">

                <div style="
                    background-color: #f1f5f9;
                    padding: 14px 18px;
                    border-bottom: 1px solid #dee2e6;
                ">

                    <h2 style="
                        margin: 0;
                        font-size: 18px;
                        color: #0d6efd;
                    ">
                        Registration Details
                    </h2>

                </div>

                <div style="
                    padding: 18px;
                ">

                    <p style="margin: 7px 0;">
                        <strong>Registration ID:</strong>
                        ${student.registrationId}
                    </p>

                    <p style="margin: 7px 0;">
                        <strong>Team Name:</strong>
                        ${student.teamName}
                    </p>

                    <p style="margin: 7px 0;">
                        <strong>Payment Status:</strong>

                        <span style="
                            display: inline-block;
                            padding: 3px 10px;
                            margin-left: 5px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: bold;
                            color: #856404;
                            background-color: #fff3cd;
                        ">
                            ${student.paymentStatus}
                        </span>

                    </p>

                </div>

            </div>


            <!-- PAYMENT DETAILS -->

            <div style="
                margin-top: 25px;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                overflow: hidden;
            ">

                <div style="
                    background-color: #f1f5f9;
                    padding: 14px 18px;
                    border-bottom: 1px solid #dee2e6;
                ">

                    <h2 style="
                        margin: 0;
                        font-size: 18px;
                        color: #0d6efd;
                    ">
                        Payment Details
                    </h2>

                </div>

                <div style="
                    padding: 20px;
                ">

                    <p style="
                        font-size: 16px;
                        margin-top: 0;
                    ">
                        <strong>Registration Fee:</strong>
                        <span style="
                            font-size: 18px;
                            color: #198754;
                            font-weight: bold;
                        ">
                            ₹500
                        </span>
                    </p>

                    <p>
                        Please complete the payment using
                        the QR code provided below.
                    </p>


                    <!-- QR CODE -->

                    <div style="
                        text-align: center;
                        margin: 25px 0;
                    ">

                        <img
                            src="cid:hackathon-payment-qr"
                            alt="Nexila Hackathon Payment QR Code"
                            style="
                                width: 250px;
                                max-width: 100%;
                                height: auto;
                                border: 1px solid #dddddd;
                                border-radius: 8px;
                                padding: 8px;
                                background-color: #ffffff;
                            "
                        />

                    </div>


                    <p style="
                        text-align: center;
                        font-size: 13px;
                        color: #666666;
                        margin-bottom: 0;
                    ">
                        If the QR code is not visible,
                        please use the attached file:
                        <strong>
                            hackathon500payment.jpeg
                        </strong>
                    </p>

                </div>

            </div>


            <!-- IMPORTANT PAYMENT VERIFICATION -->

            <div style="
                margin-top: 25px;
                padding: 22px;
                background-color: #fff8e1;
                border: 1px solid #ffe69c;
                border-left: 5px solid #ffc107;
                border-radius: 7px;
            ">

                <h2 style="
                    margin-top: 0;
                    margin-bottom: 12px;
                    font-size: 18px;
                    color: #856404;
                ">
                    Important – Payment Verification
                </h2>

                <p style="margin-top: 0;">
                    If your payment status is currently
                    showing as <strong>"Pending"</strong>,
                    please complete the payment and send
                    a clear screenshot of the successful
                    payment to the Nexila Technologies
                    WhatsApp number:
                </p>


                <!-- WHATSAPP NUMBER -->

                <div style="
                    margin: 15px 0;
                    padding: 12px;
                    background-color: #ffffff;
                    border-radius: 6px;
                    text-align: center;
                    border: 1px solid #ffe69c;
                ">

                    <span style="
                        font-size: 17px;
                        font-weight: bold;
                        color: #333333;
                    ">
                        WhatsApp: +91 9803061234
                    </span>

                </div>


                <p>
                    Along with the payment screenshot,
                    please send the following details:
                </p>


                <!-- REQUIRED DETAILS -->

                <div style="
                    background-color: #ffffff;
                    border-radius: 6px;
                    padding: 15px;
                    border: 1px solid #eeeeee;
                ">

                    <p style="margin: 6px 0;">
                        <strong>Registration ID:</strong>
                        ${student.registrationId}
                    </p>

                    <p style="margin: 6px 0;">
                        <strong>Team Lead Name:</strong>
                        ${student.fullName}
                    </p>

                    <p style="margin: 6px 0;">
                        <strong>Team Name:</strong>
                        ${student.teamName}
                    </p>

                    <p style="margin: 6px 0;">
                        <strong>Mobile Number:</strong>
                        Your registered mobile number
                    </p>

                </div>


                <p>
                    These details are required to help our
                    team identify and verify your payment
                    correctly.
                </p>

                <p style="margin-bottom: 0;">
                    Once the payment screenshot and required
                    details have been received, our team will
                    manually verify the payment and update
                    your payment status.
                </p>

            </div>


            <!-- PROJECT SUBMISSION -->

            <div style="
                margin-top: 25px;
                padding: 22px;
                background-color: #eef6ff;
                border: 1px solid #b6d4fe;
                border-radius: 7px;
            ">

                <h2 style="
                    margin-top: 0;
                    font-size: 18px;
                    color: #0d6efd;
                ">
                    Project Submission Access
                </h2>

                <p>
                    After your payment has been successfully
                    verified by the Nexila Hackathon Team,
                    you will receive a
                    <strong>separate email</strong> containing
                    the access and details required to submit
                    your <strong>Hackathon Project Details</strong>.
                </p>

                <p style="margin-bottom: 0;">
                    Please wait for the confirmation email
                    before submitting your project details.
                </p>

            </div>


            <!-- SUPPORT -->

            <div style="
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
            ">

                <h2 style="
                    margin-top: 0;
                    font-size: 18px;
                    color: #333333;
                ">
                    Need Help?
                </h2>

                <p>
                    If you have any questions regarding your
                    registration, payment, or the hackathon,
                    please contact the Nexila Hackathon Team
                    on WhatsApp:
                </p>

                <p style="
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 0;
                ">
                    +91 9803061234
                </p>

            </div>


            <!-- REGISTRATION ID REMINDER -->

            <div style="
                margin-top: 25px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 6px;
                text-align: center;
                font-size: 14px;
            ">

                <strong>
                    Please keep your Registration ID safely
                    for all future hackathon-related
                    communication.
                </strong>

            </div>


            <!-- CLOSING -->

            <div style="
                margin-top: 30px;
            ">

                <p>
                    We look forward to your participation
                    in the <strong>Nexila Hackathon</strong>.
                </p>

                <p style="margin-bottom: 3px;">
                    Regards,
                </p>

                <p style="
                    margin-top: 0;
                    margin-bottom: 0;
                    font-weight: bold;
                ">
                    Nexila Hackathon Team
                </p>

                <p style="
                    margin-top: 2px;
                    color: #666666;
                ">
                    Nexila Technologies
                </p>

            </div>

        </div>


        <!-- FOOTER -->

        <div style="
            background-color: #f8f9fa;
            padding: 18px 25px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        ">

            <p style="
                margin: 0;
                font-size: 12px;
                color: #777777;
            ">
                This is an automated email from
                Nexila Technologies.
            </p>

            <p style="
                margin: 5px 0 0;
                font-size: 12px;
                color: #777777;
            ">
                Please keep this email for your records.
            </p>

        </div>

    </div>

</div>
`,

        attachments: [
            {
                filename: "hackathon500payment.jpeg",
                path: paymentQrPath,
                cid: "hackathon-payment-qr"
            }
        ]
    };

    const info = await transporter.sendMail(mail);

    console.log(
        "Manual registration email sent:",
        info.messageId
    );

    return info;
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

Name            : ${member.name}</br>
Phone Number    : ${member.phone}</br>
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

        html: `
<div style="
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 750px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
">

    <p>
        Hello <strong>${student.fullName}</strong>,
    </p>

    <p>
        Your Nexila Hackathon registration has been
        <strong>successfully confirmed.</strong>
    </p>

    <div style="
        background-color: #fff3cd;
        border: 1px solid #ffecb5;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
    ">
        <strong>Important:</strong><br>
        Before accessing the <strong>Project Details Submission Link</strong>
        provided below, <strong>please read this email carefully and follow
        all the instructions mentioned.</strong> Proper submission of your
        project details and supporting documents is important for the
        evaluation and shortlisting process.
    </div>


    <!-- REGISTRATION DETAILS -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        REGISTRATION DETAILS
    </h3>

    <table style="
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 25px;
    ">
        <tr>
            <td style="padding: 8px; font-weight: bold; width: 180px;">
                Registration ID
            </td>
            <td style="padding: 8px;">
                ${student.registrationId}
            </td>
        </tr>

        <tr>
            <td style="padding: 8px; font-weight: bold;">
                Team Name
            </td>
            <td style="padding: 8px;">
                ${student.teamName}
            </td>
        </tr>

        <tr>
            <td style="padding: 8px; font-weight: bold;">
                College
            </td>
            <td style="padding: 8px;">
                ${student.collegeName}
            </td>
        </tr>

        <tr>
            <td style="padding: 8px; font-weight: bold;">
                Hackathon Track
            </td>
            <td style="padding: 8px;">
                ${student.hackathonTrack}
            </td>
        </tr>
    </table>


    <!-- TEAM MEMBERS -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        TEAM MEMBERS
    </h3>

    <div style="
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 25px;
    ">
        ${teamMembers}
    </div>


    <!-- IMPORTANT BEFORE SUBMISSION -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        IMPORTANT – BEFORE PROJECT SUBMISSION
    </h3>

    <p>
        Please ensure that you have prepared
        <strong>all the required project information and supporting
        documents before opening the submission link.</strong>
    </p>

    <p>
        The following two fields are <strong>MANDATORY:</strong>
    </p>

    <ol>
        <li><strong>Project Title</strong></li>
        <li><strong>Google Drive Link</strong></li>
    </ol>

    <p>
        In addition to the above, you are required to provide the following
        project details properly and completely:
    </p>

    <ol>
        <li>Project Description / Outline</li>
        <li>Project Abstract</li>
        <li>Problem Statement</li>
        <li>Proposed Solution</li>
        <li>Tech Stack</li>
        <li>Architecture Diagram</li>
        <li>Expected Outcome</li>
        <li>Demo Link</li>
        <li>GitHub Link</li>
    </ol>

    <p>
        The project information should be prepared in a
        <strong>proper work document / PDF format</strong>, wherever
        applicable. Please make sure that the submitted information is
        complete, clear, accurate, and properly organized.
    </p>

    <div style="
        background-color: #f8d7da;
        border: 1px solid #f5c2c7;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
    ">
        <strong>Important:</strong>
        Incomplete, unclear, incorrect, or improperly organized project
        information or supporting documents may affect the evaluation of
        your project and <strong>may result in your project not being
        considered for the shortlisting process.</strong>
    </div>


    <!-- GOOGLE DRIVE -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        GOOGLE DRIVE – REQUIRED FOLDER STRUCTURE
    </h3>

    <p>
        Your Google Drive folder must be organized properly as instructed
        below.
    </p>


    <h4>STEP 1 – CREATE THE MAIN FOLDER</h4>

    <p>
        Create a folder in Google Drive using the following naming format:
    </p>

    <div style="
        background-color: #f1f3f5;
        padding: 12px;
        border-radius: 5px;
        font-family: monospace;
        margin: 10px 0;
    ">
        RegisteredNumber_ProjectTitle
    </div>

    <p>
        Example:
    </p>

    <div style="
        background-color: #f1f3f5;
        padding: 12px;
        border-radius: 5px;
        font-family: monospace;
        margin: 10px 0;
    ">
        2026333_emsSystem
    </div>

    <p>
        Please ensure that the Registration Number and Project Title are
        correctly mentioned.
    </p>


    <h4>STEP 2 – SHARE THE MAIN FOLDER</h4>

    <p>
        After creating the folder:
    </p>

    <ol>
        <li>Right-click on the folder.</li>
        <li>Select <strong>Share</strong>.</li>
        <li>
    Under <strong>Share with people and groups</strong>, enter:
    <strong>info@nexilatechnologies.com</strong>
</li>
        <li>
            Set the access permission to <strong>Editor</strong>.
        </li>
        <li>Copy the folder link.</li>
    </ol>

    <p>
        This folder link must be provided in the
        <strong>Drive Link</strong> field during project submission.
    </p>

    <p>
        Please ensure that the submitted Google Drive link is accessible
        to the evaluation team. The Nexila Hackathon Team will use the
        provided access only for the purpose of reviewing and evaluating
        the submitted hackathon project materials.
    </p>


    <h4>STEP 3 – CREATE THE PROJECT SUBFOLDER</h4>

    <p>
        Open the main folder you created.
    </p>

    <p>
        Inside it, create another folder using
        <strong>exactly the same naming format:</strong>
    </p>

    <div style="
        background-color: #f1f3f5;
        padding: 12px;
        border-radius: 5px;
        font-family: monospace;
        margin: 10px 0;
    ">
        RegisteredNumber_ProjectTitle
    </div>

    <p>
        Example:
    </p>

    <div style="
        background-color: #f1f3f5;
        padding: 12px;
        border-radius: 5px;
        font-family: monospace;
        margin: 10px 0;
    ">
        2026333_emsSystem
    </div>


    <h4>STEP 4 – UPLOAD YOUR PROJECT MATERIALS</h4>

    <p>
        Inside the second folder, upload all relevant project materials,
        including:
    </p>

    <ul>
        <li>Project Documentation / Work Document</li>
        <li>Project PDF</li>
        <li>Architecture Diagram</li>
        <li>Screenshots / Images</li>
        <li>Supporting Documents</li>
        <li>Other relevant project files</li>
    </ul>

    <p>
        Please ensure that the required documentation and supporting
        materials are properly prepared, clearly named, and easy to review.
    </p>
    <pre>
    2026333_emsSystem
        |
        └── 2026333_emsSystem
                |
                ├── Project Document / PDF
                ├── Project Screenshots
                ├── Project Images
                ├── Architecture Diagram
                └── Other Supporting Materials
</pre>
<br><br>
<p>Please ensure that your project document/PDF and supporting materials are placed inside the inner project folder.</p>

    <div style="
        background-color: #f8d7da;
        border: 1px solid #f5c2c7;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
    ">
        <strong>Important:</strong>
        If the required project documentation or supporting materials are
        missing, incomplete, inaccessible, or not properly organized, it
        may negatively affect the evaluation of your project and may lead
        to rejection during the evaluation/shortlisting process.
    </div>


    <!-- PROJECT DETAILS SUBMISSION -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        PROJECT DETAILS SUBMISSION
    </h3>

    <p>
        Once you have carefully read and understood all the above
        instructions, you may proceed using the
        <strong>Project Details Submission Link</strong> below: ${projectDetailsLink}
    </p>

    <div style="
        text-align: center;
        margin: 25px 0;
    ">
        <a
            href="${projectDetailsLink}"
            style="
                display: inline-block;
                background-color: #0d6efd;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: bold;
            "
        >
            Open Project Details Submission
        </a>
    </div>

    <p>
        The submission page will require OTP verification through the
        <strong>Team Lead's registered email address.</strong>
    </p>

    <p>
        After clicking the OTP verification option, please check the Team
        Lead's registered email and allow a few seconds for the OTP email
        to arrive. Also check the Spam/Junk folder if the email is not
        immediately visible.
    </p>

    <p>
        For security purposes, OTP verification is required for every new
        project-details editing session.
    </p>

    <p>
        The Project Details Submission/Edit Link will remain valid until
        <strong>October 3, 2026.</strong>
    </p>


    <!-- IMPORTANT REMINDER -->

    <h3 style="
        color: #222222;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 8px;
    ">
        IMPORTANT REMINDER
    </h3>

    <p>
        Before submitting, please carefully verify that:
    </p>

    <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;">✓ Project Title is provided.</li>
        <li style="margin-bottom: 8px;">✓ Google Drive Link is provided.</li>
        <li style="margin-bottom: 8px;">
            ✓ Drive folder structure follows the required format.
        </li>
        <li style="margin-bottom: 8px;">
            ✓ Drive access is set to
            <strong>Anyone with the link – Editor.</strong>
        </li>
        <li style="margin-bottom: 8px;">
            ✓ Project documentation/PDF is uploaded.
        </li>
        <li style="margin-bottom: 8px;">
            ✓ Required screenshots and supporting files are uploaded.
        </li>
        <li style="margin-bottom: 8px;">
            ✓ All project details are complete and accurate.
        </li>
        <li style="margin-bottom: 8px;">
            ✓ The submitted information is properly organized and
            accessible.
        </li>
    </ul>

    <p>
        Your team details are permanently locked and cannot be modified
        through this page.
    </p>

    <p>
        Please keep your <strong>Registration ID</strong> safely for all
        future hackathon communication.
    </p>


    <!-- CONTACT -->

    <div style="
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 18px;
        border-radius: 6px;
        margin: 25px 0;
    ">

        <p style="margin-top: 0;">
            If you require any clarification regarding the project
            submission process, please contact the
            <strong>Nexila Hackathon Team:</strong>
        </p>

        <p style="margin-bottom: 0;">
            <strong>WhatsApp / Contact:</strong>
            +91 9803061234
        </p>

    </div>


    <p>
        We strongly recommend completing and verifying all project
        materials before submitting your project details to avoid any
        issues during the evaluation process.
    </p>

    <p>
        Best regards,<br>
        <strong>Nexila Hackathon Team</strong>
    </p>

</div>
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
    sendManualRegistrationSuccess,
    sendRegistrationSuccess,
    sendTeamDetailsEmail,
    sendProjectOtpEmail,
};