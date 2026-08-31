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

const NexilaHackathonNormal: React.FC = () => {
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
    //normal payment
    const handleSubmit = async (e: React.FormEvent) => {
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
            alert("Minimum 2 team members are required");
            return;
        }

        if (formData.teamMembers.length > 4) {
            alert("Maximum 4 team members are allowed");
            return;
        }

        for (let i = 0; i < formData.teamMembers.length; i++) {
            const member = formData.teamMembers[i];

            if (
                !member.name.trim() ||
                !member.phone.trim() ||
                !member.collegeRollNo.trim()
            ) {
                alert(`Please complete Team Member ${i + 1} details`);
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
            alert("Phone number must contain 10 digits");
            return;
        }

        try {
            setPaymentLoading(true);

            // =========================================
            // MANUAL REGISTRATION
            // =========================================

            const finalFormData = {
                ...formData,
                termsAccepted: true,
            };

            console.log("Sending Registration Data:", finalFormData);

            const response = await fetch(
                "/api/hackathon/public/manual-register",

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(finalFormData),
                }
            );

            const result = await response.json();

            console.log("Registration Response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message || "Registration failed"
                );
            }

            setRegistrationId(result.registrationId);
            // =========================================
            // SUCCESS
            // =========================================

            setPaymentLoading(false);
            setShowSuccessModal(true);

        } catch (error) {
            console.error(
                "Manual Registration Error:",
                error
            );

            setPaymentLoading(false);

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to complete registration"
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
                                            College Name<span className="text-danger">
                                                {" "}*
                                            </span> <small className="text-muted">
                                                If your college is not available in the list, you can type the college name manually.
                                            </small>


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
                            <div className="card-body">

                                <h5 className="mb-3 text-center">
                                    Registration Fee
                                </h5>

                                <h2 className="mb-4 text-center">
                                    ₹500
                                </h2>

                                <div className="row align-items-center">

                                    {/* LEFT SIDE - SUBMIT */}
                                    <div className="col-md-6 text-center">
                                        <small className="d-block text-danger px-3">
                                            <strong>Important:</strong> You may submit your registration
                                            before completing the payment. After submission, the QR code and
                                            payment instructions will be sent to your registered email address.
                                            <strong>
                                                {" "}Payment must be completed and successfully verified by the
                                                Nexila Hackathon Team for your registration/project to be
                                                considered for the next stage of the hackathon.
                                            </strong>
                                        </small>

                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg px-5 mt-3"
                                            disabled={
                                                paymentLoading ||
                                                !studentDeclaration ||
                                                !termsAccepted
                                            }
                                        >
                                            {paymentLoading
                                                ? "Submitting..."
                                                : "Submit Registration"}
                                        </button>

                                        {(!studentDeclaration ||
                                            !termsAccepted) && (
                                                <small className="d-block text-muted mt-3">
                                                    Please complete both
                                                    declarations before
                                                    submitting your registration.
                                                </small>
                                            )}

                                    </div>

                                    {/* RIGHT SIDE - QR */}
                                    <div className="col-md-6 text-center">

                                        <h6 className="mb-3">
                                            Scan & Pay ₹500
                                        </h6>

                                        <img
                                            src="/hackathon500payment.jpeg"
                                            alt="Hackathon Payment QR Code"
                                            className="img-fluid"
                                            style={{
                                                maxWidth: "250px",
                                                height: "auto",
                                            }}
                                        />

                                        <p className="mt-3 mb-1">
                                            {/* <strong>UPI ID:</strong> YOUR_UPI_ID */}
                                        </p>

                                        <small className="text-muted">
                                            After making the payment, click
                                            "Submit Registration".
                                        </small>

                                    </div>

                                </div>

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

                                <div className="mb-4">
                                    <h5 className="mb-2">
                                        Terms & Conditions
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Please read the following Terms & Conditions carefully
                                        before registering for the Nexila Hackathon.
                                    </p>
                                </div>


                                {/* =================================================
        I. REGISTRATION & PARTICIPATION
    ================================================= */}

                                <div className="mb-4">

                                    <h6 className="fw-semibold mb-3">
                                        I. Registration & Participation
                                    </h6>

                                    <ol className="ps-4 mb-0">

                                        <li className="mb-2">
                                            Participants must register for the Hackathon through
                                            the official Nexila Hackathon registration page.
                                        </li>

                                        <li className="mb-2">
                                            The Hackathon is open to eligible college students
                                            across Tamil Nadu, subject to the eligibility
                                            requirements specified by Nexila.
                                        </li>

                                        <li className="mb-2">
                                            Each team must consist of a minimum of
                                            <strong> 2 </strong> and a maximum of
                                            <strong> 4 members</strong>.
                                        </li>

                                        <li className="mb-2">
                                            Each individual participant may register and
                                            participate in only one team.
                                        </li>

                                        <li className="mb-2">
                                            Participants must provide their team name at the
                                            time of registration.
                                        </li>

                                        <li className="mb-2">
                                            Each team must nominate one member as the
                                            <strong> Team Leader</strong>.
                                        </li>

                                        <li className="mb-2">
                                            The Team Leader will be responsible for providing
                                            accurate information relating to all team members
                                            and for receiving official communications from Nexila.
                                        </li>

                                        <li className="mb-2">
                                            All participants must provide genuine and accurate
                                            information, including their name, college,
                                            department, year of study, roll/registration number,
                                            contact details and other information requested
                                            during registration.
                                        </li>

                                        <li className="mb-2">
                                            Nexila reserves the right to verify the eligibility
                                            and student status of any participant at any stage
                                            of the Hackathon.
                                        </li>

                                        <li className="mb-2">
                                            Participants may be required to present a valid
                                            college/student identity card or other acceptable
                                            proof of student status.
                                        </li>

                                        <li className="mb-2">
                                            Participants must actively participate in all required
                                            stages, checkpoints, mentoring sessions, submissions
                                            and final presentations as communicated by Nexila.
                                        </li>

                                        <li>
                                            Failure to comply with the Hackathon requirements or
                                            failure to respond to official communications may
                                            result in disqualification of the participant or
                                            the entire team.
                                        </li>

                                    </ol>

                                </div>


                                {/* =================================================
        II. REGISTRATION FEE & PAYMENT
    ================================================= */}

                                <div className="mb-4">

                                    <h6 className="fw-semibold mb-3">
                                        II. Registration Fee & Payment
                                    </h6>

                                    <ol className="ps-4 mb-0">

                                        <li className="mb-2">
                                            Participation in the Hackathon requires payment of
                                            the registration fee displayed on the official
                                            Hackathon registration page.
                                        </li>

                                        <li className="mb-2">
                                            The applicable registration fee must be paid through
                                            the payment method provided by Nexila or its
                                            authorized payment service provider.
                                        </li>

                                        <li className="mb-2">
                                            Registration will be considered successfully completed
                                            only after successful payment and confirmation by the
                                            registration system/Nexila.
                                        </li>

                                        <li className="mb-2">
                                            Participants are responsible for ensuring that the
                                            information submitted during registration is accurate
                                            before making payment.
                                        </li>

                                        <li className="mb-2">
                                            Participants should retain their payment transaction
                                            or reference number for future communication or
                                            verification.
                                        </li>

                                        <li className="mb-2">
                                            Payment of the registration fee confirms registration
                                            but does not guarantee selection for the final round,
                                            winning a prize, internship, placement, or any other
                                            opportunity.
                                        </li>

                                        <li>
                                            Any applicable payment gateway charges, taxes or
                                            statutory deductions, if separately applicable, will
                                            be handled in accordance with the applicable payment
                                            terms and laws.
                                        </li>

                                    </ol>

                                </div>


                                {/* =================================================
        III. CANCELLATION & REFUND POLICY
    ================================================= */}

                                <div className="mb-4">

                                    <h6 className="fw-semibold mb-3">
                                        III. Cancellation & Refund Policy
                                    </h6>

                                    <ol className="ps-4 mb-0">

                                        <li className="mb-2">
                                            The registration fee is non-refundable once the
                                            registration has been successfully completed, except
                                            where a refund is required under applicable law or
                                            where Nexila specifically decides otherwise.
                                        </li>

                                        <li className="mb-2">
                                            Refunds will generally not be provided due to:

                                            <ul className="mt-2 ps-4">

                                                <li className="mb-1">
                                                    Change of mind
                                                </li>

                                                <li className="mb-1">
                                                    Failure to attend the Hackathon
                                                </li>

                                                <li className="mb-1">
                                                    Failure to form or maintain a complete team
                                                </li>

                                                <li className="mb-1">
                                                    Failure to qualify for the next stage
                                                </li>

                                                <li className="mb-1">
                                                    Failure to submit the required project or idea
                                                </li>

                                                <li className="mb-1">
                                                    Disqualification due to violation of the
                                                    Hackathon rules
                                                </li>

                                                <li className="mb-1">
                                                    Personal, academic or other commitments
                                                </li>

                                                <li>
                                                    Failure to respond to official communications
                                                </li>

                                            </ul>

                                        </li>

                                        <li className="mb-2">
                                            If Nexila cancels the Hackathon entirely, Nexila will
                                            communicate the applicable refund or alternative
                                            arrangement to registered participants.
                                        </li>

                                        <li className="mb-2">
                                            If the Hackathon is postponed, Nexila may, at its
                                            discretion, carry forward the participant's
                                            registration to the rescheduled event.
                                        </li>

                                        <li>
                                            Where a refund is approved, it will generally be
                                            processed to the original payment method, subject to
                                            applicable payment gateway and banking processing
                                            timelines.
                                        </li>

                                    </ol>

                                </div>


                                {/* =================================================
        ACKNOWLEDGEMENT
    ================================================= */}

                                <div className="alert alert-light border mb-0">

                                    <div className="d-flex align-items-start">

                                        <i className="ti ti-info-circle me-2 mt-1" />

                                        <p className="mb-0">
                                            By clicking <strong>OK</strong>, you confirm that
                                            you have read, understood and agreed to the above
                                            Terms & Conditions, including the Registration,
                                            Payment, Cancellation and Refund Policies of the
                                            Nexila Hackathon.
                                        </p>

                                    </div>

                                </div>

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

                                    Your Nexila Hackathon registration has been
                                    successfully completed.

                                    <br />
                                    <br />

                                    <strong>
                                        Registration ID:
                                    </strong>

                                    <br />

                                    <span className="fs-4 text-dark fw-bold">
                                        {registrationId}
                                    </span>

                                    <br />
                                    <br />

                                    Please take a screenshot of this Registration ID
                                    and keep it safely for future reference.

                                    <br />
                                    <br />

                                    Your registration details have been sent to your email.

                                    <br />
                                    <br />

                                    Please check your email for the link to submit
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

export default NexilaHackathonNormal;