import React, { useState } from "react";

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
        <div className="page-wrapper">
            <div className="content">
                <div className="container-fluid">

                    <div className="text-center mb-4">
                        <div className="text-center mb-3">
                            <img
                                src="/nexilalogo1.jpeg"
                                alt="Nexila Logo"
                                className="enquiry-logo"
                                width={200}
                            />
                        </div>
                        <h1>
                            Nexila Hackathon
                        </h1>

                        <p className="text-muted">
                            Student Project Registration
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* =========================================
                            STUDENT DETAILS
                        ========================================= */}

                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">
                                    Student Details
                                </h4>
                            </div>

                            <div className="card-body">
                                <div className="row">

                                    {/* FULL NAME */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Full Name
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            value={
                                                formData.fullName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                    {/* PHONE */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Phone Number
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={
                                                formData.phone
                                            }
                                            maxLength={10}
                                            inputMode="numeric"
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

                                                setFormData(
                                                    (prev) => ({
                                                        ...prev,

                                                        phone:
                                                            value,

                                                        teamMembers:
                                                            [
                                                                {
                                                                    ...prev
                                                                        .teamMembers[0],

                                                                    phone:
                                                                        value,
                                                                },

                                                                ...prev.teamMembers.slice(
                                                                    1
                                                                ),
                                                            ],
                                                    })
                                                );
                                            }}
                                            required
                                        />
                                    </div>

                                    {/* EMAIL */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Email
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                    {/* COLLEGE */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            College Name
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="collegeName"
                                            className="form-control"
                                            list="college-list"
                                            value={
                                                formData.collegeName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Type college name..."
                                            required
                                        />

                                        <datalist
                                            id="college-list"
                                        >
                                            {[
                                                ...colleges,
                                            ]
                                                .sort(
                                                    (
                                                        a,
                                                        b
                                                    ) =>
                                                        a.localeCompare(
                                                            b
                                                        )
                                                )
                                                .map(
                                                    (
                                                        college
                                                    ) => (
                                                        <option
                                                            key={
                                                                college
                                                            }
                                                            value={
                                                                college
                                                            }
                                                        />
                                                    )
                                                )}
                                        </datalist>
                                    </div>

                                    {/* DEGREE */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Degree
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <select
                                            name="degree"
                                            className="form-select"
                                            value={
                                                formData.degree
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Degree
                                            </option>

                                            {[
                                                ...degreeOptions,
                                            ]
                                                .sort(
                                                    (
                                                        a,
                                                        b
                                                    ) =>
                                                        a.localeCompare(
                                                            b
                                                        )
                                                )
                                                .map(
                                                    (
                                                        degree
                                                    ) => (
                                                        <option
                                                            key={
                                                                degree
                                                            }
                                                            value={
                                                                degree
                                                            }
                                                        >
                                                            {
                                                                degree
                                                            }
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </div>

                                    {/* DEPARTMENT */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Department /
                                            Specialization
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <select
                                            name="department"
                                            className="form-select"
                                            value={
                                                formData.department
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Department
                                            </option>

                                            {[
                                                ...departmentOptions,
                                            ]
                                                .sort(
                                                    (
                                                        a,
                                                        b
                                                    ) =>
                                                        a.localeCompare(
                                                            b
                                                        )
                                                )
                                                .map(
                                                    (
                                                        department
                                                    ) => (
                                                        <option
                                                            key={
                                                                department
                                                            }
                                                            value={
                                                                department
                                                            }
                                                        >
                                                            {
                                                                department
                                                            }
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                    </div>

                                    {/* ROLL NUMBER */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            College Roll No
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="collegeRollNo"
                                            className="form-control"
                                            value={
                                                formData.collegeRollNo
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                    {/* YEAR */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Year of Study
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <select
                                            name="yearOfStudy"
                                            className="form-select"
                                            value={
                                                formData.yearOfStudy
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Year
                                            </option>

                                            {yearOfStudyOptions.map(
                                                (
                                                    year
                                                ) => (
                                                    <option
                                                        key={
                                                            year
                                                        }
                                                        value={
                                                            year
                                                        }
                                                    >
                                                        {
                                                            year
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* PASSING OUT YEAR */}

                                    {/* <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Passing Out Year
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            // name="passingOutYear"
                                            className="form-control"
                                            value={
                                                // formData.passingOutYear
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength={4}
                                            inputMode="numeric"
                                            required
                                        />
                                    </div> */}

                                    {/* DISTRICT */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            District
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="district"
                                            className="form-control"
                                            list="district-list"
                                            value={
                                                formData.district
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Type district..."
                                            required
                                        />

                                        <datalist
                                            id="district-list"
                                        >
                                            {[
                                                ...tamilNaduDistricts,
                                            ]
                                                .sort(
                                                    (
                                                        a,
                                                        b
                                                    ) =>
                                                        a.localeCompare(
                                                            b
                                                        )
                                                )
                                                .map(
                                                    (
                                                        district
                                                    ) => (
                                                        <option
                                                            key={
                                                                district
                                                            }
                                                            value={
                                                                district
                                                            }
                                                        />
                                                    )
                                                )}
                                        </datalist>
                                    </div>

                                    {/* TEAM NAME */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Team Name
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="teamName"
                                            className="form-control"
                                            value={
                                                formData.teamName
                                            }
                                            onChange={
                                                handleChange
                                            }
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

                        <div className="card mt-4">
                            <div className="card-header">
                                <h4 className="card-title">
                                    Hackathon Details
                                </h4>
                            </div>

                            <div className="card-body">
                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Hackathon Track
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <select
                                            name="hackathonTrack"
                                            className="form-select"
                                            value={
                                                formData.hackathonTrack
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Hackathon Track
                                            </option>

                                            {hackathonTrackOptions.map(
                                                (
                                                    track
                                                ) => (
                                                    <option
                                                        key={
                                                            track
                                                        }
                                                        value={
                                                            track
                                                        }
                                                    >
                                                        {
                                                            track
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Primary Technical Skill
                                            <span className="text-danger">
                                                {" "}*
                                            </span>
                                        </label>

                                        <select
                                            name="primaryTechnicalSkill"
                                            className="form-select"
                                            value={
                                                formData.primaryTechnicalSkill
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Primary Technical Skill
                                            </option>

                                            {technicalSkillOptions.map(
                                                (
                                                    skill
                                                ) => (
                                                    <option
                                                        key={
                                                            skill
                                                        }
                                                        value={
                                                            skill
                                                        }
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* =========================================
                            TEAM MEMBERS
                        ========================================= */}

                        <div className="card mt-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">
                                    Team Members
                                </h4>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        addTeamMember
                                    }
                                    disabled={
                                        formData.teamMembers.length >=
                                        4
                                    }
                                >
                                    + Add Member
                                </button>
                            </div>

                            <div className="card-body">

                                <p className="text-muted">
                                    Minimum 2 members and maximum
                                    4 members are allowed.
                                </p>

                                {formData.teamMembers.map(
                                    (
                                        member,
                                        index
                                    ) => (
                                        <div
                                            className="border rounded p-3 mb-3"
                                            key={index}
                                        >

                                            <div className="d-flex justify-content-between mb-3">
                                                <h5>
                                                    Team Member{" "}
                                                    {index + 1}

                                                    {index ===
                                                        0 && (
                                                            <span className="text-muted">
                                                                {" "}
                                                                (Team Lead)
                                                            </span>
                                                        )}
                                                </h5>

                                                {index >=
                                                    2 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() =>
                                                                removeTeamMember(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                            </div>

                                            <div className="row">

                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">
                                                        Name
                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            member.name
                                                        }
                                                        readOnly={
                                                            index ===
                                                            0
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleTeamMemberChange(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">
                                                        Phone Number
                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        value={
                                                            member.phone
                                                        }
                                                        maxLength={
                                                            10
                                                        }
                                                        inputMode="numeric"
                                                        readOnly={
                                                            index ===
                                                            0
                                                        }
                                                        onChange={(
                                                            e
                                                        ) => {
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

                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">
                                                        College Roll No
                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            member.collegeRollNo
                                                        }
                                                        readOnly={
                                                            index ===
                                                            0
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
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
                            DECLARATIONS
                        ========================================= */}

                        <div className="card mt-4">
                            <div className="card-header">
                                <h4 className="card-title">
                                    Declaration & Agreement
                                </h4>
                            </div>

                            <div className="card-body">

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        id="studentDeclaration"
                                        className="form-check-input"
                                        checked={
                                            studentDeclaration
                                        }
                                        onChange={
                                            handleStudentDeclarationChange
                                        }
                                    />

                                    <label
                                        htmlFor="studentDeclaration"
                                        className="form-check-label"
                                    >
                                        I confirm that I am
                                        currently enrolled as
                                        a college student and
                                        that the information
                                        provided is correct.

                                        <span className="text-danger">
                                            {" "}*
                                        </span>
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="termsAgreement"
                                        className="form-check-input"
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
                                        className={`form-check-label ${!studentDeclaration
                                            ? "text-muted"
                                            : ""
                                            }`}
                                    >
                                        I agree to the
                                        Hackathon Rules &
                                        Terms & Conditions.

                                        <span className="text-danger">
                                            {" "}*
                                        </span>
                                    </label>

                                    {!studentDeclaration && (
                                        <small className="d-block text-muted mt-1">
                                            Please accept the
                                            first declaration
                                            before viewing the
                                            Terms & Conditions.
                                        </small>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* =========================================
                            PAYMENT
                        ========================================= */}

                        <div className="card mt-4">
                            <div className="card-body text-center">

                                <h5 className="mb-3">
                                    Registration Fee
                                </h5>

                                <h2 className="mb-3">
                                    ₹
                                    {formData.teamMembers.length *
                                        125}
                                </h2>

                                <p className="text-muted">
                                    ₹125 per team member
                                </p>

                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg px-5"
                                    disabled={
                                        paymentLoading ||
                                        !studentDeclaration ||
                                        !termsAccepted
                                    }
                                >
                                    {paymentLoading
                                        ? "Processing..."
                                        : "Proceed to Payment"}
                                </button>

                                {(!studentDeclaration ||
                                    !termsAccepted) && (
                                        <small className="d-block text-muted mt-2">
                                            Please complete both
                                            declarations before
                                            proceeding to payment.
                                        </small>
                                    )}

                            </div>
                        </div>

                    </form>
                </div>
            </div>

            {/* =========================================
                TERMS MODAL
            ========================================= */}

            {showTermsModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Hackathon Rules & Terms &
                                    Conditions
                                </h5>
                            </div>

                            <div className="modal-body">

                                <h6>
                                    Terms & Conditions
                                </h6>

                                <p>
                                    By participating in the
                                    Nexila Hackathon, I confirm
                                    that the information provided
                                    during registration is true
                                    and accurate.
                                </p>

                                <p>
                                    I understand that I am
                                    responsible for the project
                                    submitted by my team and
                                    agree to participate according
                                    to the rules and instructions
                                    provided by the hackathon
                                    organizers.
                                </p>

                                <p>
                                    I agree that the project
                                    submitted should be created
                                    by the registered team and
                                    should not violate any
                                    applicable laws, copyrights,
                                    trademarks, or third-party
                                    rights.
                                </p>

                                <p>
                                    The hackathon organizers
                                    reserve the right to verify
                                    registration information and
                                    take appropriate action if
                                    incorrect or misleading
                                    information is provided.
                                </p>

                                <p>
                                    Registration fees, once paid,
                                    are subject to the applicable
                                    registration and refund policy
                                    of the hackathon.
                                </p>

                                <p className="mb-0">
                                    By clicking{" "}
                                    <strong>OK</strong>, you confirm
                                    that you have read and understood
                                    these Terms & Conditions.
                                </p>

                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                    onClick={
                                        handleTermsOk
                                    }
                                >
                                    OK
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                SUCCESS MODAL
            ========================================= */}

            {showSuccessModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body text-center p-5">

                                <div
                                    className="mb-4"
                                    style={{
                                        fontSize: "60px",
                                    }}
                                >
                                    ✓
                                </div>

                                <h3 className="mb-3">
                                    Registration Successful!
                                </h3>

                                <p className="text-muted mb-4">
                                    Your Nexila Hackathon
                                    registration has been
                                    successfully completed.

                                    <br />

                                    Payment received
                                    successfully.

                                    <br />

                                    Registration details have
                                    been sent to your email.

                                    <br />
                                    <br />

                                    Please check your email
                                    for the link to submit
                                    your project details.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-primary px-5"
                                    onClick={() => {
                                        setShowSuccessModal(
                                            false
                                        );

                                        setStudentDeclaration(
                                            false
                                        );

                                        setTermsAccepted(
                                            false
                                        );

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
                </div>
            )}

        </div>
    );
};

export default NexilaHackathon;