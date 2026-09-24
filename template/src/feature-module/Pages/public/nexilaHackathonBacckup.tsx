import React, { useState } from "react";
import "./nexilaHackathon.css";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface TeamMember {
    name: string;
    phone: string;
    collegeRollNo: string;
}

interface HackathonFormData {
    fullName: string;
    phone: string;
    email: string;
    collegeName: string;
    degree: string;
    department: string;
    collegeRollNo: string;
    yearOfStudy: string;
    // passingOutYear: string;
    district: string;
    teamName: string;
    hackathonTrack: string;
    primaryTechnicalSkill: string;
    teamMembers: TeamMember[];
    termsAccepted: boolean;
}

/* =========================================================
   COLLEGES
========================================================= */

const colleges: string[] = [
    "SRM Institute of Science and Technology, Kattankulathur (SRMIST)",
    "SRM Valliammai Engineering College (SRM VEC)",
    "SRM Arts and Science College",
    "SRM University, Kattankulathur",
    "Hindustan Institute of Technology and Science (HITS)",
    "SSN College of Engineering (SSN)",
    "Sri Sivasubramaniya Nadar College of Engineering",
    "Rajalakshmi Engineering College (REC)",
    "Rajalakshmi Institute of Technology (RIT)",
    "Saveetha Engineering College",
    "Jeppiaar Engineering College",
    "Jeppiaar Institute of Technology",
    "Dhanalakshmi Srinivasan Engineering College",
    "Tagore Engineering College",
    "St. Joseph's College of Engineering",
    "St. Joseph's Institute of Technology",
    "Easwari Engineering College",
    "Prince Shri Venkateshwara Padmavathy Engineering College",
    "Sathyabama Institute of Science and Technology",
    "KCG College of Technology",
    "Anna University",
    "University of Madras",
    "Loyola College",
    "Madras Christian College (MCC)",
    "Presidency College",
    "Ethiraj College for Women",
    "DG Vaishnav College",
    "Guru Nanak College",
    "MOP Vaishnav College for Women",
    "Hindustan College of Arts and Science",
    "Meenakshi College of Engineering",
    "Velammal Engineering College",
    "Velammal Institute of Technology",
    "Panimalar Engineering College",
    "Panimalar Institute of Technology",
    "Sri Sai Ram Engineering College",
    "Sri Sai Ram Institute of Technology",
    "RMK Engineering College",
    "RMD Engineering College",

    "PSG College of Technology (PSGCT)",
    "PSG Institute of Technology and Applied Research (PSG iTech)",
    "Coimbatore Institute of Technology (CIT)",
    "Kumaraguru College of Technology (KCT)",
    "Sri Krishna College of Engineering and Technology (SKCET)",
    "Sri Krishna Institute of Technology",
    "Sri Ramakrishna Engineering College (SREC)",
    "Sri Ramakrishna Institute of Technology",
    "SNS College of Technology (SNSCT)",
    "SNS College of Engineering",
    "KPR Institute of Engineering and Technology (KPRIET)",
    "KPR College of Arts Science and Research",
    "Hindusthan College of Engineering and Technology",
    "Hindusthan Institute of Technology",
    "Dr. N.G.P. Institute of Technology",
    "Dr. N.G.P. Arts and Science College",
    "Bannari Amman Institute of Technology (BIT)",
    "Karunya Institute of Technology and Sciences",
    "Amrita Vishwa Vidyapeetham, Coimbatore",
    "Rathinam College of Arts and Science",

    "Nandha Engineering College (NCT)",
    "Nandha College of Technology (NCT)",
    "VSB Engineering College",
    "VSB College of Engineering Technical Campus",
    "Kongu Engineering College (KEC)",
    "Bannari Amman Institute of Technology",
    "Shree Venkateshwara Hi-Tech Engineering College",
    "Velalar College of Engineering and Technology",
    "Excel Engineering College",
    "Erode Sengunthar Engineering College",
    "M.P. Nachimuthu M. Jaganathan Engineering College",
    "SNS College of Technology",
    "Kongu Arts and Science College",
    "Nandha Arts and Science College",
    "Sasurie College of Engineering",
    "Surya Engineering College",

    "Sona College of Technology",
    "Knowledge Institute of Technology (KIOT)",
    "Mahendra Engineering College",
    "Mahendra Institute of Technology",
    "AVS Engineering College",
    "Vinayaka Mission's Kirupananda Variyar Engineering College",
    "Government College of Engineering, Salem",
    "Thiagarajar Polytechnic College",
    "Sri Shanmugha College of Engineering and Technology",
    "Paavai Engineering College",
    "K.S.R. College of Engineering",
    "K.S.R. Institute for Engineering and Technology",
    "K.S.Rangasamy College of Technology",

    "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
    "Shanmuga Arts Science Technology Research Academy (SASTRA)",
    "K. Ramakrishnan College of Engineering",
    "K. Ramakrishnan College of Technology",
    "M.A.M. College of Engineering",
    "M.A.M. School of Engineering",
    "Bharathidasan University",
    "Government College of Engineering, Srirangam",
    "Oxford Engineering College",
    "CARE College of Engineering",
    "SRM TRP Engineering College",
    "Kongunadu College of Engineering and Technology",
    "Indra Ganesan College of Engineering",
    "Jamal Mohamed College",

    "Thiagarajar College of Engineering (TCE)",
    "Madurai Kamaraj University",
    "Velammal College of Engineering and Technology",
    "KLN College of Engineering",
    "KLN College of Information Technology",
    "PSNA College of Engineering and Technology",
    "SACS MAVMM Engineering College",
    "Anna University Regional Campus, Madurai",
    "Fatima College",
    "The American College",
    "Thiagarajar College",
    "Madura College",
    "Lady Doak College",

    "National Engineering College (NEC), Kovilpatti",
    "Francis Xavier Engineering College",
    "Government College of Engineering, Tirunelveli",
    "PSN College of Engineering and Technology",
    "PSN Institute of Technology and Science",
    "SCAD College of Engineering and Technology",
    "M.S. University, Tirunelveli",
    "PET Engineering College",
    "Einstein College of Engineering",
    "Sardar Raja College of Engineering",

    "SASTRA Deemed University",
    "PRIST University",
    "Government College of Engineering, Thanjavur",
    "Periyar Maniammai Institute of Science and Technology",
    "Mass College of Engineering",
    "Arasu Engineering College",
    "Anjalai Ammal Mahalingam Engineering College",
    "AVC College of Engineering",
    "As-Salam College of Engineering and Technology",

    "Vellore Institute of Technology (VIT)",
    "Government Vellore Institute of Technology",
    "Thanthai Periyar Government Institute of Technology",
    "Auxilium College",
    "Voorhees College",
    "Kingston Engineering College",
    "Sri Krishna Engineering College",
    "Ganadipathy Tulsi's Engineering College",
    "C. Abdul Hakeem College of Engineering and Technology",
    "Islamiah College",

    "Kalasalingam Academy of Research and Education",
    "Kalasalingam University",
    "Mepco Schlenk Engineering College",
    "PSR Engineering College",
    "Ramco Institute of Technology",
    "Government College of Engineering, Bodinayakanur",
    "Karpagam College of Engineering",
    "Karpagam Institute of Technology",
    "Adithya Institute of Technology",
    "Info Institute of Engineering",
    "Park College of Engineering Technology",
    "SNS Academy",
    "Dr. Mahalingam College of Engineering and Technology",
    "Nehru Institute of Engineering and Technology",
    "Sri Eshwar College of Engineering",
];

/* =========================================================
   OTHER OPTIONS
========================================================= */

const degreeOptions: string[] = [
    "B.A.",
    "B.Com",
    "B.Com (Computer Applications)",
    "B.B.A.",
    "B.C.A.",
    "B.Sc.",
    "B.Sc. Computer Science",
    "B.Sc. Information Technology",
    "B.Sc. Data Science",
    "B.Sc. Artificial Intelligence",
    "B.Sc. Computer Applications",
    "B.E.",
    "B.E. Computer Science and Engineering",
    "B.E. Information Technology",
    "B.E. Artificial Intelligence and Data Science",
    "B.E. Artificial Intelligence and Machine Learning",
    "B.E. Computer Science and Business Systems",
    "B.E. Cyber Security",
    "B.E. Data Science",
    "B.Tech",
    "B.Tech Computer Science and Engineering",
    "B.Tech Information Technology",
    "B.Tech Artificial Intelligence",
    "B.Tech Artificial Intelligence and Data Science",
    "B.Tech Data Science",
    "B.Tech Information Systems",
    "M.A.",
    "M.Com",
    "M.B.A.",
    "M.C.A.",
    "M.Sc.",
    "M.Sc. Computer Science",
    "M.Sc. Information Technology",
    "M.Sc. Data Science",
    "M.Sc. Artificial Intelligence",
    "M.E.",
    "M.Tech",
    "Ph.D.",
    "Other",
];

const departmentOptions: string[] = [
    "Artificial Intelligence",
    "Artificial Intelligence and Data Science (AI&DS)",
    "Artificial Intelligence and Machine Learning (AIML)",
    "Computer Applications",
    "Computer Science",
    "Computer Science and Engineering (CSE)",
    "Computer Science and Business Systems (CSBS)",
    "Cyber Security",
    "Data Analytics",
    "Data Science",
    "Information Technology (IT)",
    "Software Engineering",
    "Cloud Computing",
    "Business Administration",
    "Commerce",
    "Accounting and Finance",
    "Management Studies",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Statistics",
    "English",
    "Economics",
    "General",
    "Other",
];

const tamilNaduDistricts: string[] = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
];

const yearOfStudyOptions: string[] = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
];

const hackathonTrackOptions: string[] = [
    "AI & Generative AI",
    "Artificial Intelligence & Machine Learning",
    "Data Science & Data Analytics",
    "Full Stack Development",
    "Cloud Computing",
    "Open Innovation",
];

const technicalSkillOptions: string[] = [
    "Python",
    "Java",
    "JavaScript",
    "React",
    "MERN",
    "AI/ML",
    "Data Science",
    "Data Analytics",
    "Power BI",
    "AWS / Cloud",
    "Generative AI",
    "DevOps",
    "Other",
];

/* =========================================================
   COMPONENT
========================================================= */

const NexilaHackathon: React.FC = () => {
    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    const [showTermsModal, setShowTermsModal] =
        useState(false);

    const [termsAccepted, setTermsAccepted] =
        useState(false);

    const [studentDeclaration, setStudentDeclaration] =
        useState(false);

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const [registrationId, setRegistrationId] = useState("");

    const getInitialFormData = (): HackathonFormData => ({
        fullName: "",
        phone: "",
        email: "",
        collegeName: "",
        degree: "",
        department: "",
        collegeRollNo: "",
        yearOfStudy: "",
        // passingOutYear: "",
        district: "",
        teamName: "",
        hackathonTrack: "",
        primaryTechnicalSkill: "",
        teamMembers: [
            {
                name: "",
                phone: "",
                collegeRollNo: "",
            },
            {
                name: "",
                phone: "",
                collegeRollNo: "",
            },
        ],
        termsAccepted: false,
    });

    const [formData, setFormData] =
        useState<HackathonFormData>(
            getInitialFormData()
        );

    /* =====================================================
       MAIN FORM CHANGE
    ===================================================== */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]:
                    name === "fullName"
                        ? value.toUpperCase()
                        : value,
            };

            if (
                name === "fullName" ||
                name === "phone" ||
                name === "collegeRollNo"
            ) {
                updatedData.teamMembers = [
                    {
                        name:
                            name === "fullName"
                                ? value.toUpperCase()
                                : prev.fullName,

                        phone:
                            name === "phone"
                                ? value
                                : prev.phone,

                        collegeRollNo:
                            name === "collegeRollNo"
                                ? value
                                : prev.collegeRollNo,
                    },
                    ...prev.teamMembers.slice(1),
                ];
            }

            return updatedData;
        });
    };

    /* =====================================================
       TEAM MEMBER CHANGE
    ===================================================== */

    const handleTeamMemberChange = (
        index: number,
        field: keyof TeamMember,
        value: string
    ) => {
        if (index === 0) {
            return;
        }

        setFormData((prev) => {
            const updatedMembers = [
                ...prev.teamMembers,
            ];

            updatedMembers[index] = {
                ...updatedMembers[index],
                [field]:
                    field === "name"
                        ? value.toUpperCase()
                        : value,
            };

            return {
                ...prev,
                teamMembers: updatedMembers,
            };
        });
    };

    /* =====================================================
       ADD TEAM MEMBER
    ===================================================== */

    const addTeamMember = () => {
        if (formData.teamMembers.length >= 4) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            teamMembers: [
                ...prev.teamMembers,
                {
                    name: "",
                    phone: "",
                    collegeRollNo: "",
                },
            ],
        }));
    };

    /* =====================================================
       REMOVE TEAM MEMBER
    ===================================================== */

    const removeTeamMember = (index: number) => {
        if (index <= 1) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            teamMembers:
                prev.teamMembers.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    /* =====================================================
       STUDENT DECLARATION
    ===================================================== */

    const handleStudentDeclarationChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;

        setStudentDeclaration(checked);

        if (!checked) {
            setTermsAccepted(false);

            setFormData((prev) => ({
                ...prev,
                termsAccepted: false,
            }));
        }
    };

    /* =====================================================
       TERMS CHECKBOX
    ===================================================== */

    const handleTermsCheckboxClick = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!termsAccepted) {
            e.preventDefault();
            setShowTermsModal(true);
            return;
        }

        const checked = e.target.checked;

        setTermsAccepted(checked);

        setFormData((prev) => ({
            ...prev,
            termsAccepted: checked,
        }));
    };

    /* =====================================================
       TERMS MODAL OK
    ===================================================== */

    const handleTermsOk = () => {
        setShowTermsModal(false);

        setTermsAccepted(true);

        setFormData((prev) => ({
            ...prev,
            termsAccepted: true,
        }));
    };

    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!studentDeclaration) {
            alert(
                "Please confirm that you are currently enrolled as a college student and that the information provided is correct."
            );
            return;
        }

        if (!termsAccepted) {
            alert(
                "Please read and accept the Hackathon Rules & Terms & Conditions."
            );
            return;
        }

        if (!formData.teamName.trim()) {
            alert("Please enter Team Name");
            return;
        }

        if (formData.teamMembers.length < 2) {
            alert(
                "Minimum 2 team members are required"
            );
            return;
        }

        if (formData.teamMembers.length > 4) {
            alert(
                "Maximum 4 team members are allowed"
            );
            return;
        }

        for (
            let i = 0;
            i < formData.teamMembers.length;
            i++
        ) {
            const member =
                formData.teamMembers[i];

            if (
                !member.name.trim() ||
                !member.phone.trim() ||
                !member.collegeRollNo.trim()
            ) {
                alert(
                    `Please complete Team Member ${i + 1} details`
                );
                return;
            }

            if (member.phone.length !== 10) {
                alert(
                    `Team Member ${i + 1} phone number must contain 10 digits`
                );
                return;
            }
        }

        if (formData.phone.length !== 10) {
            alert(
                "Phone number must contain 10 digits"
            );
            return;
        }

        try {
            setPaymentLoading(true);

            /* =================================================
               CREATE RAZORPAY ORDER
            ================================================= */

            const orderResponse = await fetch(
                "https://crm.nexilatechnologies.com:5000/api/hackathon/public/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        teamName:
                            formData.teamName,
                        teamMembers:
                            formData.teamMembers,
                    }),
                }
            );

            const orderResult =
                await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(
                    orderResult.message ||
                    "Unable to create payment order"
                );
            }

            if (
                !orderResult.keyId ||
                !orderResult.orderId ||
                !orderResult.amountInPaise
            ) {
                throw new Error(
                    "Invalid payment order response from server"
                );
            }

            /* =================================================
               RAZORPAY OPTIONS
            ================================================= */

            const options = {
                key: orderResult.keyId,

                amount:
                    orderResult.amountInPaise,

                currency:
                    orderResult.currency || "INR",

                name:
                    "Nexila Technologies",

                description:
                    `Hackathon Registration - ${formData.teamMembers.length} Members`,

                order_id:
                    orderResult.orderId,

                prefill: {
                    name:
                        formData.fullName,
                    email:
                        formData.email,
                    contact:
                        formData.phone,
                },

                notes: {
                    teamSize:
                        String(
                            formData.teamMembers.length
                        ),
                    teamName:
                        formData.teamName,
                },

                theme: {
                    color: "#0d6efd",
                },

                modal: {
                    confirm_close: true,
                    escape: false,
                    backdropclose: false,
                },

                handler:
                    async function (
                        response: any
                    ) {
                        try {
                            const finalFormData = {
                                ...formData,
                                termsAccepted: true,
                            };

                            console.log(
                                "Payment Response:",
                                response
                            );

                            console.log(
                                "Sending Form Data:",
                                finalFormData
                            );

                            /* =========================================
                               VERIFY PAYMENT
                            ========================================= */

                            const verifyResponse =
                                await fetch(
                                    "https://crm.nexilatechnologies.com:5000/api/hackathon/public/verify-payment",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },

                                        body:
                                            JSON.stringify({
                                                formData:
                                                    finalFormData,

                                                razorpay_order_id:
                                                    response.razorpay_order_id,

                                                razorpay_payment_id:
                                                    response.razorpay_payment_id,

                                                razorpay_signature:
                                                    response.razorpay_signature,
                                            }),
                                    }
                                );

                            const verifyResult =
                                await verifyResponse.json();

                            console.log(
                                "Verify Response:",
                                verifyResult
                            );

                            if (
                                !verifyResponse.ok
                            ) {
                                throw new Error(
                                    verifyResult.message ||
                                    "Payment verification failed"
                                );
                            }

                            setRegistrationId(
                                verifyResult.registrationId
                            );

                            setPaymentLoading(
                                false
                            );

                            setShowSuccessModal(
                                true
                            );
                        } catch (
                        verificationError
                        ) {
                            console.error(
                                "Payment Verification Error:",
                                verificationError
                            );

                            setPaymentLoading(
                                false
                            );

                            alert(
                                verificationError instanceof
                                    Error
                                    ? verificationError.message
                                    : "Payment verification failed"
                            );
                        }
                    },

                retry: {
                    enabled: true,
                    max_count: 3,
                },
            };

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout is not loaded"
                );
            }

            const razorpay =
                new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (
                    response: any
                ) {
                    console.error(
                        "Payment Failed:",
                        response.error
                    );

                    setPaymentLoading(
                        false
                    );

                    alert(
                        response.error?.description ||
                        "Payment failed"
                    );
                }
            );

            razorpay.open();

        } catch (error) {
            console.error(
                "Registration Payment Error:",
                error
            );

            setPaymentLoading(false);

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to start payment"
            );
        }
    };

    /* =====================================================
       RETURN
    ===================================================== */

    return (
        <div className="hackathon-page">

            <div className="hackathon-container">

                {/* =========================================
                PAGE HEADER
            ========================================= */}

                <div className="hackathon-header">

                    <img
                        src="/nexilalogo1.jpeg"
                        alt="Nexila Technologies"
                        className="hackathon-logo"
                    />

                    <h1>
                        Nexila Hackathon 2026
                    </h1>

                    <p>
                        Student Project Registration
                    </p>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* =========================================
                    STUDENT DETAILS
                ========================================= */}

                    <div className="hackathon-card">

                        <div className="section-header">

                            <div className="section-icon student-icon">
                                <i className="ti ti-user" />
                            </div>

                            <div>
                                <h3>
                                    Student Details
                                </h3>

                                <p>
                                    Please provide the basic details of the team and college.
                                </p>
                            </div>

                        </div>


                        <div className="section-body">

                            <div className="row">


                                {/* FULL NAME */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Full Name
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        className="hackathon-input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Phone Number
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        className="hackathon-input"
                                        value={formData.phone}
                                        maxLength={10}
                                        inputMode="numeric"
                                        placeholder="Enter phone number"
                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 10);

                                            setFormData((prev) => ({
                                                ...prev,

                                                phone: value,

                                                teamMembers: [
                                                    {
                                                        ...prev.teamMembers[0],
                                                        phone: value,
                                                    },

                                                    ...prev.teamMembers.slice(1),
                                                ],
                                            }));

                                        }}
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Email
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="hackathon-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                    />

                                </div>


                                {/* COLLEGE */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        College Name
                                        <span>* </span><small className="field-helper">
                                            If your college is not available in the list,
                                            you can type the college name manually.
                                        </small>

                                    </label>


                                    <input
                                        type="text"
                                        name="collegeName"
                                        className="hackathon-input"
                                        list="college-list"
                                        value={formData.collegeName}
                                        onChange={handleChange}
                                        placeholder="Type college name..."
                                        required
                                    />

                                    <datalist id="college-list">

                                        {[
                                            ...colleges,
                                        ]
                                            .sort((a, b) =>
                                                a.localeCompare(b)
                                            )
                                            .map((college) => (
                                                <option
                                                    key={college}
                                                    value={college}
                                                />
                                            ))}

                                    </datalist>

                                </div>


                                {/* DEGREE */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Degree
                                        <span>*</span>
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            name="degree"
                                            className="hackathon-input"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Degree
                                            </option>

                                            {[
                                                ...degreeOptions,
                                            ]
                                                .sort((a, b) =>
                                                    a.localeCompare(b)
                                                )
                                                .map((degree) => (
                                                    <option
                                                        key={degree}
                                                        value={degree}
                                                    >
                                                        {degree}
                                                    </option>
                                                ))}

                                        </select>

                                        <i className="ti ti-chevron-down" />

                                    </div>

                                </div>


                                {/* DEPARTMENT */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Department / Specialization
                                        <span>*</span>
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            name="department"
                                            className="hackathon-input"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Department
                                            </option>

                                            {[
                                                ...departmentOptions,
                                            ]
                                                .sort((a, b) =>
                                                    a.localeCompare(b)
                                                )
                                                .map((department) => (
                                                    <option
                                                        key={department}
                                                        value={department}
                                                    >
                                                        {department}
                                                    </option>
                                                ))}

                                        </select>

                                        <i className="ti ti-chevron-down" />

                                    </div>

                                </div>


                                {/* ROLL NUMBER */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        College Roll No
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="collegeRollNo"
                                        className="hackathon-input"
                                        value={formData.collegeRollNo}
                                        onChange={handleChange}
                                        placeholder="Enter college roll number"
                                        required
                                    />

                                </div>


                                {/* YEAR */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Year of Study
                                        <span>*</span>
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            name="yearOfStudy"
                                            className="hackathon-input"
                                            value={formData.yearOfStudy}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Year
                                            </option>

                                            {yearOfStudyOptions.map(
                                                (year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <i className="ti ti-chevron-down" />

                                    </div>

                                </div>


                                {/* DISTRICT */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        District
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="district"
                                        className="hackathon-input"
                                        list="district-list"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Type district..."
                                        required
                                    />

                                    <datalist id="district-list">

                                        {[
                                            ...tamilNaduDistricts,
                                        ]
                                            .sort((a, b) =>
                                                a.localeCompare(b)
                                            )
                                            .map((district) => (
                                                <option
                                                    key={district}
                                                    value={district}
                                                />
                                            ))}

                                    </datalist>

                                </div>


                                {/* TEAM NAME */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Team Name
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="teamName"
                                        className="hackathon-input"
                                        value={formData.teamName}
                                        onChange={handleChange}
                                        placeholder="Enter unique team name"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                    HACKATHON DETAILS
                ========================================= */}

                    <div className="hackathon-card">

                        <div className="section-header">

                            <div className="section-icon hackathon-icon">
                                <i className="ti ti-trophy" />
                            </div>

                            <div>
                                <h3>
                                    Hackathon Details
                                </h3>

                                <p>
                                    Tell us about your hackathon preferences and technical skills.
                                </p>
                            </div>

                        </div>


                        <div className="section-body">

                            <div className="row">

                                {/* TRACK */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Hackathon Track
                                        <span>*</span>
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            name="hackathonTrack"
                                            className="hackathon-input"
                                            value={formData.hackathonTrack}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Hackathon Track
                                            </option>

                                            {hackathonTrackOptions.map(
                                                (track) => (
                                                    <option
                                                        key={track}
                                                        value={track}
                                                    >
                                                        {track}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <i className="ti ti-chevron-down" />

                                    </div>

                                </div>


                                {/* TECHNICAL SKILL */}

                                <div className="col-md-6 form-field">

                                    <label>
                                        Primary Technical Skill
                                        <span>*</span>
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            name="primaryTechnicalSkill"
                                            className="hackathon-input"
                                            value={
                                                formData.primaryTechnicalSkill
                                            }
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Primary Technical Skill
                                            </option>

                                            {technicalSkillOptions.map(
                                                (skill) => (
                                                    <option
                                                        key={skill}
                                                        value={skill}
                                                    >
                                                        {skill}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        <i className="ti ti-chevron-down" />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                    TEAM MEMBERS
                ========================================= */}

                    <div className="hackathon-card">

                        <div className="section-header team-header">

                            <div className="section-title-wrapper">

                                <div className="section-icon team-icon">
                                    <i className="ti ti-users" />
                                </div>

                                <div>

                                    <h3>
                                        Team Members
                                    </h3>

                                    <p>
                                        Minimum 2 members and maximum 4 members are allowed.
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="add-member-btn"
                                onClick={addTeamMember}
                                disabled={
                                    formData.teamMembers.length >= 4
                                }
                            >

                                <i className="ti ti-plus" />

                                Add Member

                            </button>

                        </div>


                        <div className="section-body">

                            {formData.teamMembers.map(
                                (member, index) => (

                                    <div
                                        className="team-member-card"
                                        key={index}
                                    >

                                        <div className="team-member-title">

                                            <span>

                                                Team Member {index + 1}

                                                {index === 0 && (
                                                    <span className="team-lead-label">
                                                        {" "}
                                                        (Team Lead)
                                                    </span>
                                                )}

                                            </span>


                                            {index >= 2 && (

                                                <button
                                                    type="button"
                                                    className="remove-member-btn"
                                                    onClick={() =>
                                                        removeTeamMember(
                                                            index
                                                        )
                                                    }
                                                >

                                                    <i className="ti ti-trash" />

                                                    Remove

                                                </button>

                                            )}

                                        </div>


                                        <div className="row">


                                            {/* NAME */}

                                            <div className="col-md-4 form-field">

                                                <label>
                                                    Name
                                                    <span>*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="hackathon-input"
                                                    value={member.name}
                                                    readOnly={
                                                        index === 0
                                                    }
                                                    placeholder="Enter name"
                                                    onChange={(e) =>
                                                        handleTeamMemberChange(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>


                                            {/* PHONE */}

                                            <div className="col-md-4 form-field">

                                                <label>
                                                    Phone Number
                                                    <span>*</span>
                                                </label>

                                                <input
                                                    type="tel"
                                                    className="hackathon-input"
                                                    value={member.phone}
                                                    maxLength={10}
                                                    inputMode="numeric"
                                                    readOnly={
                                                        index === 0
                                                    }
                                                    placeholder="Enter phone number"
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    ""
                                                                )
                                                                .slice(
                                                                    0,
                                                                    10
                                                                );

                                                        handleTeamMemberChange(
                                                            index,
                                                            "phone",
                                                            value
                                                        );

                                                    }}
                                                    required
                                                />

                                            </div>


                                            {/* ROLL NUMBER */}

                                            <div className="col-md-4 form-field">

                                                <label>
                                                    College Roll No
                                                    <span>*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="hackathon-input"
                                                    value={
                                                        member.collegeRollNo
                                                    }
                                                    readOnly={
                                                        index === 0
                                                    }
                                                    placeholder="Enter college roll number"
                                                    onChange={(e) =>
                                                        handleTeamMemberChange(
                                                            index,
                                                            "collegeRollNo",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* =========================================
                    DECLARATION
                ========================================= */}

                    <div className="hackathon-card">

                        <div className="section-header">

                            <div className="section-icon declaration-icon">
                                <i className="ti ti-shield-check" />
                            </div>

                            <div>

                                <h3>
                                    Declaration & Agreement
                                </h3>

                                <p>
                                    Please read and accept the terms to proceed.
                                </p>

                            </div>

                        </div>


                        <div className="section-body declaration-body">


                            {/* STUDENT DECLARATION */}

                            <div className="custom-checkbox-row">

                                <input
                                    type="checkbox"
                                    id="studentDeclaration"
                                    className="custom-checkbox"
                                    checked={
                                        studentDeclaration
                                    }
                                    onChange={
                                        handleStudentDeclarationChange
                                    }
                                />

                                <label htmlFor="studentDeclaration">

                                    I confirm that I am currently enrolled as a
                                    college student and that the information
                                    provided is correct.

                                    <span className="required-star">
                                        *
                                    </span>

                                </label>

                            </div>


                            {/* TERMS */}

                            <div className="custom-checkbox-row">

                                <input
                                    type="checkbox"
                                    id="termsAgreement"
                                    className="custom-checkbox"
                                    checked={
                                        termsAccepted
                                    }
                                    disabled={
                                        !studentDeclaration
                                    }
                                    onChange={
                                        handleTermsCheckboxClick
                                    }
                                />

                                <label
                                    htmlFor="termsAgreement"
                                    className={
                                        !studentDeclaration
                                            ? "disabled-label"
                                            : ""
                                    }
                                >

                                    I agree to the{" "}

                                    <span className="terms-link">
                                        Hackathon Rules & Terms & Conditions.
                                    </span>

                                    <span className="required-star">
                                        *
                                    </span>

                                </label>

                            </div>


                            {!studentDeclaration && (

                                <div className="terms-help">

                                    Please accept the first declaration before
                                    viewing the{" "}

                                    <span>
                                        Terms & Conditions.
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =========================================
                    PAYMENT
                ========================================= */}

                    <div className="payment-card">

                        <div className="payment-content">

                            <div className="payment-icon">
                                <i className="ti ti-credit-card" />
                            </div>

                            <h3>
                                Registration Fee
                            </h3>

                            <div className="payment-amount">
                                ₹500
                            </div>

                            <p>
                                Complete your registration by proceeding
                                to secure payment.
                            </p>
                            <p className="text-warn">Please wait until the “Submission Successful” message is displayed. Do not refresh or close the page during the payment or submission process, as this may interrupt the transaction or submission.</p>

                            <button
                                type="submit"
                                className="payment-btn"
                                disabled={
                                    paymentLoading ||
                                    !studentDeclaration ||
                                    !termsAccepted
                                }
                            >

                                {paymentLoading ? (
                                    <>
                                        <span className="payment-spinner" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Payment
                                        <i className="ti ti-arrow-right" />
                                    </>
                                )}

                            </button>


                            {(!studentDeclaration ||
                                !termsAccepted) && (

                                    <div className="payment-help">

                                        Please complete both declarations
                                        before proceeding to payment.

                                    </div>

                                )}

                        </div>

                    </div>

                </form>

            </div>


            {/* =========================================
            TERMS MODAL
        ========================================= */}

            {showTermsModal && (

                <div
                    className="hackathon-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="hackathon-modal terms-modal">

                        <div className="hackathon-modal-header">

                            <div>

                                <h3>
                                    Hackathon Rules & Terms & Conditions
                                </h3>

                                <p>
                                    Please review the following information carefully.
                                </p>

                            </div>

                        </div>


                        <div className="hackathon-modal-body">


                            <div className="terms-intro">

                                <h4>
                                    Terms & Conditions
                                </h4>

                                <p>
                                    Please read the following Terms & Conditions
                                    carefully before registering for the Nexila Hackathon.
                                </p>

                            </div>


                            {/* REGISTRATION */}

                            <div className="terms-section">

                                <h5>
                                    I. Registration & Participation
                                </h5>

                                <ol>

                                    <li>
                                        Participants must register for the Hackathon
                                        through the official Nexila Hackathon registration page.
                                    </li>

                                    <li>
                                        The Hackathon is open to eligible college
                                        students across Tamil Nadu, subject to the
                                        eligibility requirements specified by Nexila.
                                    </li>

                                    <li>
                                        Each team must consist of a minimum of
                                        <strong> 2 </strong>
                                        and a maximum of
                                        <strong> 4 members</strong>.
                                    </li>

                                    <li>
                                        Each individual participant may register
                                        and participate in only one team.
                                    </li>

                                    <li>
                                        Participants must provide their team name
                                        at the time of registration.
                                    </li>

                                    <li>
                                        Each team must nominate one member as the
                                        <strong> Team Leader</strong>.
                                    </li>

                                    <li>
                                        The Team Leader will be responsible for
                                        providing accurate information relating to
                                        all team members and for receiving official
                                        communications from Nexila.
                                    </li>

                                    <li>
                                        All participants must provide genuine and
                                        accurate information, including their name,
                                        college, department, year of study,
                                        roll/registration number, contact details
                                        and other information requested during registration.
                                    </li>

                                    <li>
                                        Nexila reserves the right to verify the
                                        eligibility and student status of any
                                        participant at any stage of the Hackathon.
                                    </li>

                                    <li>
                                        Participants may be required to present a
                                        valid college/student identity card or other
                                        acceptable proof of student status.
                                    </li>

                                    <li>
                                        Participants must actively participate in
                                        all required stages, checkpoints, mentoring
                                        sessions, submissions and final presentations
                                        as communicated by Nexila.
                                    </li>

                                    <li>
                                        Failure to comply with the Hackathon requirements
                                        or failure to respond to official communications
                                        may result in disqualification of the participant
                                        or the entire team.
                                    </li>

                                </ol>

                            </div>


                            {/* PAYMENT */}

                            <div className="terms-section">

                                <h5>
                                    II. Registration Fee & Payment
                                </h5>

                                <ol>

                                    <li>
                                        Participation in the Hackathon requires
                                        payment of the registration fee displayed
                                        on the official Hackathon registration page.
                                    </li>

                                    <li>
                                        The applicable registration fee must be paid
                                        through the payment method provided by Nexila
                                        or its authorized payment service provider.
                                    </li>

                                    <li>
                                        Registration will be considered successfully
                                        completed only after successful payment and
                                        confirmation by the registration system/Nexila.
                                    </li>

                                    <li>
                                        Participants are responsible for ensuring
                                        that the information submitted during registration
                                        is accurate before making payment.
                                    </li>

                                    <li>
                                        Participants should retain their payment
                                        transaction or reference number for future
                                        communication or verification.
                                    </li>

                                    <li>
                                        Payment of the registration fee confirms
                                        registration but does not guarantee selection
                                        for the final round, winning a prize, internship,
                                        placement, or any other opportunity.
                                    </li>

                                    <li>
                                        Any applicable payment gateway charges, taxes
                                        or statutory deductions, if separately applicable,
                                        will be handled in accordance with the applicable
                                        payment terms and laws.
                                    </li>

                                </ol>

                            </div>


                            {/* REFUND */}

                            <div className="terms-section">

                                <h5>
                                    III. Cancellation & Refund Policy
                                </h5>

                                <ol>

                                    <li>
                                        The registration fee is non-refundable once
                                        the registration has been successfully completed,
                                        except where a refund is required under applicable
                                        law or where Nexila specifically decides otherwise.
                                    </li>

                                    <li>

                                        Refunds will generally not be provided due to:

                                        <ul>

                                            <li>Change of mind</li>

                                            <li>
                                                Failure to attend the Hackathon
                                            </li>

                                            <li>
                                                Failure to form or maintain a complete team
                                            </li>

                                            <li>
                                                Failure to qualify for the next stage
                                            </li>

                                            <li>
                                                Failure to submit the required project or idea
                                            </li>

                                            <li>
                                                Disqualification due to violation of
                                                the Hackathon rules
                                            </li>

                                            <li>
                                                Personal, academic or other commitments
                                            </li>

                                            <li>
                                                Failure to respond to official communications
                                            </li>

                                        </ul>

                                    </li>

                                    <li>
                                        If Nexila cancels the Hackathon entirely,
                                        Nexila will communicate the applicable refund
                                        or alternative arrangement to registered participants.
                                    </li>

                                    <li>
                                        If the Hackathon is postponed, Nexila may,
                                        at its discretion, carry forward the participant's
                                        registration to the rescheduled event.
                                    </li>

                                    <li>
                                        Where a refund is approved, it will generally
                                        be processed to the original payment method,
                                        subject to applicable payment gateway and banking
                                        processing timelines.
                                    </li>

                                </ol>

                            </div>


                            <div className="terms-notice">

                                <i className="ti ti-info-circle" />

                                <p>

                                    By clicking <strong>OK</strong>, you confirm that
                                    you have read, understood and agreed to the above
                                    Terms & Conditions, including the Registration,
                                    Payment, Cancellation and Refund Policies of the
                                    Nexila Hackathon.

                                </p>

                            </div>

                        </div>


                        <div className="hackathon-modal-footer">

                            <button
                                type="button"
                                className="modal-ok-btn"
                                onClick={handleTermsOk}
                            >
                                OK
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================================
            SUCCESS MODAL
        ========================================= */}

            {showSuccessModal && (

                <div
                    className="hackathon-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="hackathon-modal success-modal">

                        <div className="success-content">

                            <div className="success-icon">

                                <i className="ti ti-check" />

                            </div>


                            <h2>
                                Registration Successful!
                            </h2>


                            <p>

                                Your Nexila Hackathon registration has been
                                successfully completed.

                                <br />

                                Payment received successfully.

                            </p>


                            <div className="registration-id-box">

                                <span>
                                    Registration ID
                                </span>

                                <strong>
                                    {registrationId}
                                </strong>

                            </div>


                            <p className="success-note">

                                Please take a screenshot of this Registration ID
                                and keep it safely for future reference.

                                <br />
                                <br />

                                Registration details have been sent to your email.

                                <br />
                                <br />

                                Please check your email for the link to submit
                                your project details.

                            </p>


                            <button
                                type="button"
                                className="success-ok-btn"
                                onClick={() => {

                                    setShowSuccessModal(false);

                                    setStudentDeclaration(false);

                                    setTermsAccepted(false);

                                    setFormData(
                                        getInitialFormData()
                                    );

                                }}
                            >
                                OK
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

export default NexilaHackathon;