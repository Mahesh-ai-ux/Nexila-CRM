import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import PageHeader from "../../components/page-header/pageHeader";
import { all_routes } from "../../routes/all_routes";

// =====================================================
// TYPES
// =====================================================

type TeamMember = {
    name: string;
    phone: string;
    collegeRollNo: string;
};

type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | string;

type RegistrationStatus =
    | "REGISTERED"
    | "QUALIFIED"
    | "SHORTLISTED"
    | "SEMI_FINALIST"
    | "FINALIST"
    | "WINNER"
    | string;

type HackathonStudent = {
    // =================================================
    // REGISTRATION
    // =================================================

    _id: string;
    registrationId: string;

    // =================================================
    // STUDENT
    // =================================================

    fullName: string;
    phone: string;
    email: string;

    // =================================================
    // EDUCATION
    // =================================================

    collegeName: string;
    degree: string;
    department: string;
    collegeRollNo: string;
    yearOfStudy: string;
    district: string;

    // =================================================
    // TEAM
    // =================================================

    teamName: string;
    teamMembers: TeamMember[];

    // =================================================
    // HACKATHON
    // =================================================

    hackathonTrack: string;
    primaryTechnicalSkill: string;

    // =================================================
    // PROJECT
    // =================================================

    projectTitle: string | null;
    projectDescription: string | null;
    projectAbstract: string | null;
    problemStatement: string | null;
    proposedSolution: string | null;
    techStack: string | null;
    architectureDiagram: string | null;
    expectedOutcome: string | null;
    demoLink: string | null;
    githubLink: string | null;

    // =================================================
    // PAYMENT
    // =================================================

    paymentStatus: PaymentStatus;
    amount: number;

    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    paidAt: string | null;

    // =================================================
    // TERMS
    // =================================================

    termsAccepted: boolean;

    // =================================================
    // PROJECT OTP
    // =================================================

    projectOtpHash: string | null;
    projectOtpExpiresAt: string | null;
    projectOtpAttempts: number;
    projectOtpLastSentAt: string | null;

    // =================================================
    // STATUS
    // =================================================

    status: RegistrationStatus;

    // =================================================
    // TIMESTAMPS
    // =================================================

    createdAt: string | null;
    updatedAt: string | null;
};

// =====================================================
// API
// =====================================================

const HACKATHON_API =
    "https://crm.nexilatechnologies.com:5000/api/hackathon";

// =====================================================
// STATUS OPTIONS
// =====================================================

const STATUS_OPTIONS: RegistrationStatus[] = [
    "REGISTERED",
    "QUALIFIED",
    "SHORTLISTED",
    "SEMI_FINALIST",
    "FINALIST",
    "WINNER",
];

// =====================================================
// HELPER - DISPLAY VALUE
// =====================================================

const displayValue = (
    value: string | number | null | undefined
): string | number => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return value;
};

// =====================================================
// HELPER - NORMALIZE ID
// =====================================================

const normalizeId = (value: any): string => {
    if (!value) {
        return "";
    }

    // MongoDB ObjectId / Extended JSON
    if (typeof value === "object") {
        if (value.$oid) {
            return String(value.$oid);
        }

        if (value.toString) {
            return String(value.toString());
        }
    }

    return String(value);
};

// =====================================================
// HELPER - NORMALIZE DATE
// =====================================================

const normalizeDate = (
    value: any
): string | null => {
    if (!value) {
        return null;
    }

    // MongoDB Extended JSON
    if (
        typeof value === "object" &&
        value.$date
    ) {
        return String(value.$date);
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === "string") {
        return value;
    }

    return null;
};

// =====================================================
// HELPER - NORMALIZE URL
// =====================================================

const normalizeUrl = (
    value: any
): string | null => {
    if (!value) {
        return null;
    }

    let url = String(value).trim();

    if (!url) {
        return null;
    }

    // Convert Markdown URL:
    // [https://github.com/example](https://github.com/example)
    //
    // into:
    // https://github.com/example

    const markdownMatch = url.match(
        /^\[.*?\]\((.*?)\)$/
    );

    if (markdownMatch) {
        url = markdownMatch[1];
    }

    return url.trim() || null;
};

// =====================================================
// HELPER - CHECK IMAGE URL
// =====================================================

const isImageUrl = (
    value: string | null
): boolean => {
    if (!value) {
        return false;
    }

    const url = value.trim();

    if (!url) {
        return false;
    }

    // Base64 image
    if (url.startsWith("data:image/")) {
        return true;
    }

    // Normal image URL
    return (
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(
            url
        )
    );
};

// =====================================================
// HELPER - STATUS BADGE
// =====================================================

const getStatusBadgeClass = (
    status: string
): string => {
    switch (status) {
        case "REGISTERED":
            return "bg-primary";

        case "QUALIFIED":
            return "bg-info";

        case "SHORTLISTED":
            return "bg-success";

        case "SEMI_FINALIST":
            return "bg-warning text-dark";

        case "FINALIST":
            return "bg-dark";

        case "WINNER":
            return "bg-success";

        default:
            return "bg-secondary";
    }
};

// =====================================================
// HELPER - STATUS DISPLAY NAME
// =====================================================

const getStatusDisplayName = (
    status: string
): string => {
    switch (status) {
        case "REGISTERED":
            return "Registered";

        case "QUALIFIED":
            return "Qualified";

        case "SHORTLISTED":
            return "Shortlisted";

        case "SEMI_FINALIST":
            return "Semi Finalist";

        case "FINALIST":
            return "Finalist";

        case "WINNER":
            return "Winner";

        default:
            return status;
    }
};

// =====================================================
// COMPONENT
// =====================================================

const HackathonDetails = () => {
    const { id } = useParams();

    const [student, setStudent] =
        useState<HackathonStudent | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [changingStatus, setChangingStatus] =
        useState(false);

    // =================================================
    // FETCH STUDENT
    // =================================================

    useEffect(() => {
        if (!id) {
            setError(
                "Hackathon student ID not found"
            );

            setLoading(false);

            return;
        }

        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `${HACKATHON_API}/${id}`,
                    {
                        method: "GET",

                        headers: {
                            Accept:
                                "application/json",

                            ...(token
                                ? {
                                    Authorization:
                                        `Bearer ${token}`,
                                }
                                : {}),
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `API Error: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                console.log(
                    "FULL HACKATHON API RESPONSE:",
                    data
                );

                // =================================================
                // SUPPORT DIFFERENT API RESPONSE STRUCTURES
                // =================================================

                const studentData =
                    data?.student ??
                    data?.data ??
                    data;

                console.log(
                    "EXTRACTED STUDENT DATA:",
                    studentData
                );

                if (
                    !studentData ||
                    !studentData._id
                ) {
                    setError(
                        "Hackathon student not found"
                    );

                    return;
                }

                // =================================================
                // TEAM MEMBERS
                // =================================================

                const rawTeamMembers =
                    Array.isArray(
                        studentData.teamMembers
                    )
                        ? studentData.teamMembers
                        : [];

                const teamMembers: TeamMember[] =
                    rawTeamMembers.map(
                        (
                            member: any
                        ) => ({
                            name:
                                member?.name ??
                                "-",

                            phone:
                                member?.phone ??
                                "-",

                            collegeRollNo:
                                member?.collegeRollNo ??
                                "-",
                        })
                    );

                // =================================================
                // MAP BACKEND DATA
                // =================================================

                const mappedStudent: HackathonStudent =
                {
                    // =========================================
                    // ID
                    // =========================================

                    _id: normalizeId(
                        studentData._id
                    ),

                    // =========================================
                    // REGISTRATION
                    // =========================================

                    registrationId:
                        studentData.registrationId ??
                        "-",

                    // =========================================
                    // STUDENT
                    // =========================================

                    fullName:
                        studentData.fullName ??
                        "-",

                    phone:
                        studentData.phone ??
                        "-",

                    email:
                        studentData.email ??
                        "-",

                    // =========================================
                    // EDUCATION
                    // =========================================

                    collegeName:
                        studentData.collegeName ??
                        "-",

                    degree:
                        studentData.degree ??
                        "-",

                    department:
                        studentData.department ??
                        "-",

                    collegeRollNo:
                        studentData.collegeRollNo ??
                        "-",

                    yearOfStudy:
                        studentData.yearOfStudy ??
                        "-",

                    district:
                        studentData.district ??
                        "-",

                    // =========================================
                    // TEAM
                    // =========================================

                    teamName:
                        studentData.teamName ??
                        "-",

                    teamMembers,

                    // =========================================
                    // HACKATHON
                    // =========================================

                    hackathonTrack:
                        studentData.hackathonTrack ??
                        "-",

                    primaryTechnicalSkill:
                        studentData.primaryTechnicalSkill ??
                        "-",

                    // =========================================
                    // PROJECT
                    // =========================================

                    projectTitle:
                        studentData.projectTitle ??
                        null,

                    projectDescription:
                        studentData.projectDescription ??
                        null,

                    projectAbstract:
                        studentData.projectAbstract ??
                        null,

                    problemStatement:
                        studentData.problemStatement ??
                        null,

                    proposedSolution:
                        studentData.proposedSolution ??
                        null,

                    techStack:
                        studentData.techStack ??
                        null,

                    architectureDiagram:
                        studentData.architectureDiagram ??
                        null,

                    expectedOutcome:
                        studentData.expectedOutcome ??
                        null,

                    demoLink:
                        normalizeUrl(
                            studentData.demoLink
                        ),

                    githubLink:
                        normalizeUrl(
                            studentData.githubLink
                        ),

                    // =========================================
                    // PAYMENT
                    // =========================================

                    paymentStatus:
                        studentData.paymentStatus ??
                        "PENDING",

                    amount:
                        typeof studentData.amount ===
                            "number"
                            ? studentData.amount
                            : Number(
                                studentData.amount
                            ) || 0,

                    razorpayOrderId:
                        studentData.razorpayOrderId ??
                        null,

                    razorpayPaymentId:
                        studentData.razorpayPaymentId ??
                        null,

                    razorpaySignature:
                        studentData.razorpaySignature ??
                        null,

                    paidAt:
                        normalizeDate(
                            studentData.paidAt
                        ),

                    // =========================================
                    // TERMS
                    // =========================================

                    termsAccepted:
                        Boolean(
                            studentData.termsAccepted
                        ),

                    // =========================================
                    // OTP
                    // =========================================

                    projectOtpHash:
                        studentData.projectOtpHash ??
                        null,

                    projectOtpExpiresAt:
                        normalizeDate(
                            studentData.projectOtpExpiresAt
                        ),

                    projectOtpAttempts:
                        Number(
                            studentData.projectOtpAttempts ??
                            0
                        ),

                    projectOtpLastSentAt:
                        normalizeDate(
                            studentData.projectOtpLastSentAt
                        ),

                    // =========================================
                    // STATUS
                    // =========================================

                    status:
                        studentData.status ??
                        "REGISTERED",

                    // =========================================
                    // TIMESTAMPS
                    // =========================================

                    createdAt:
                        normalizeDate(
                            studentData.createdAt
                        ),

                    updatedAt:
                        normalizeDate(
                            studentData.updatedAt
                        ),
                };

                console.log(
                    "MAPPED HACKATHON STUDENT:",
                    mappedStudent
                );

                setStudent(mappedStudent);
            } catch (err) {
                console.error(
                    "Hackathon details error:",
                    err
                );

                setError(
                    "Unable to load hackathon student details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    // =================================================
    // CHANGE STATUS
    // =================================================

    const handleChangeStatus = async (
        newStatus: RegistrationStatus
    ) => {
        if (!id || !student) {
            return;
        }

        const currentStatus =
            student.status || "REGISTERED";

        // =================================================
        // NO CHANGE
        // =================================================

        if (newStatus === currentStatus) {
            return;
        }

        // =================================================
        // CONFIRM
        // =================================================

        const confirmChange =
            window.confirm(
                `Change registration status from "${getStatusDisplayName(
                    currentStatus
                )}" to "${getStatusDisplayName(
                    newStatus
                )}"?`
            );

        if (!confirmChange) {
            return;
        }

        try {
            setChangingStatus(true);

            const token =
                localStorage.getItem("token");

            // =================================================
            // UPDATE ONLY STATUS
            // =================================================

            const response = await fetch(
                `${HACKATHON_API}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`,
                            }
                            : {}),
                    },

                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const responseData =
                await response
                    .json()
                    .catch(() => null);

            if (!response.ok) {
                throw new Error(
                    responseData?.message ||
                    `Unable to update status (${response.status})`
                );
            }

            console.log(
                "STATUS UPDATE RESPONSE:",
                responseData
            );

            // =================================================
            // UPDATE UI
            // =================================================

            setStudent(
                (previous) =>
                    previous
                        ? {
                            ...previous,
                            status:
                                newStatus,
                        }
                        : previous
            );

            window.alert(
                `Status changed to ${getStatusDisplayName(
                    newStatus
                )}`
            );
        } catch (err) {
            console.error(
                "Change status error:",
                err
            );

            window.alert(
                err instanceof Error
                    ? err.message
                    : "Unable to change status"
            );
        } finally {
            setChangingStatus(false);
        }
    };

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="content">
                    <div className="text-center py-5">
                        <p className="mb-0">
                            Loading hackathon student
                            details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (error || !student) {
        return (
            <div className="page-wrapper">
                <div className="content">
                    <div className="alert alert-danger">
                        {error ||
                            "Hackathon student not found"}
                    </div>

                    <Link
                        to={
                            all_routes.hackathonList
                        }
                        className="btn btn-primary"
                    >
                        ← Back to Hackathon Students
                    </Link>
                </div>
            </div>
        );
    }

    // =================================================
    // INITIAL
    // =================================================

    const firstLetter =
        student.fullName &&
            student.fullName !== "-"
            ? student.fullName
                .charAt(0)
                .toUpperCase()
            : "S";

    // =================================================
    // PAYMENT BADGE
    // =================================================

    const paymentBadgeClass =
        student.paymentStatus === "PAID"
            ? "bg-success"
            : student.paymentStatus ===
                "FAILED"
                ? "bg-danger"
                : "bg-warning";

    // =================================================
    // STATUS
    // =================================================

    const status =
        student.status || "REGISTERED";

    const statusBadgeClass =
        getStatusBadgeClass(status);

    // =================================================
    // ARCHITECTURE IMAGE
    // =================================================

    const architectureImage =
        normalizeUrl(
            student.architectureDiagram
        );

    const hasArchitectureImage =
        isImageUrl(
            architectureImage
        );

    // =================================================
    // RETURN
    // =================================================

    return (
        <div className="page-wrapper">
            <div className="content pb-0">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <PageHeader
                    title="Hackathon Student"
                    badgeCount={1}
                    showModuleTile={false}
                    showExport={false}
                />

                {/* =================================================
                    BACK + ACTIONS
                ================================================= */}

                <div className="row">
                    <div className="col-md-12 mb-3">

                        <div className="d-flex align-items-center justify-content-between">

                            {/* BACK */}

                            <Link
                                to={
                                    all_routes.hackathonList
                                }
                                className="text-primary"
                            >
                                ← Back to Hackathon
                                Students
                            </Link>

                            {/* ACTIONS */}

                            <div className="d-flex gap-2">

                                {/* =================================================
                                    EDIT
                                ================================================= */}

                                <Link
                                    to={`/hackathon/edit/${student._id}`}
                                    className="btn btn-primary"
                                >
                                    <i className="ti ti-edit me-1" />
                                    Edit
                                </Link>

                                {/* =================================================
                                    CHANGE STATUS DROPDOWN
                                ================================================= */}

                                <div className="dropdown">

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        disabled={
                                            changingStatus
                                        }
                                    >
                                        <i className="ti ti-refresh me-1" />

                                        {changingStatus
                                            ? "Updating..."
                                            : "Change Status"}
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end">

                                        {STATUS_OPTIONS.map(
                                            (
                                                statusOption
                                            ) => (
                                                <li
                                                    key={
                                                        statusOption
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className={`dropdown-item d-flex align-items-center justify-content-between ${statusOption ===
                                                            status
                                                            ? "active"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleChangeStatus(
                                                                statusOption
                                                            )
                                                        }
                                                        disabled={
                                                            changingStatus
                                                        }
                                                    >
                                                        <span>
                                                            {getStatusDisplayName(
                                                                statusOption
                                                            )}
                                                        </span>

                                                        {statusOption ===
                                                            status && (
                                                                <i className="ti ti-check ms-2" />
                                                            )}
                                                    </button>
                                                </li>
                                            )
                                        )}

                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        TOP STUDENT CARD
                    ================================================= */}

                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">

                                <div className="d-flex align-items-center gap-3">

                                    {/* AVATAR */}

                                    <div
                                        className="avatar bg-primary d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "65px",
                                            height: "65px",
                                            borderRadius:
                                                "50%",
                                            color: "#fff",
                                            fontSize:
                                                "24px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {firstLetter}
                                    </div>

                                    {/* STUDENT */}

                                    <div>
                                        <h5 className="mb-1">
                                            {
                                                student.fullName
                                            }
                                        </h5>

                                        <p className="mb-1">
                                            <i className="ti ti-school me-1" />

                                            {
                                                student.collegeName
                                            }
                                        </p>

                                        <p className="mb-0 text-muted">
                                            <i className="ti ti-phone me-1" />

                                            {
                                                student.phone
                                            }
                                        </p>
                                    </div>

                                    {/* BADGES */}

                                    <div className="ms-auto d-flex gap-2 flex-wrap">

                                        {/* PAYMENT */}

                                        <span
                                            className={`badge ${paymentBadgeClass}`}
                                        >
                                            Payment:{" "}
                                            {
                                                student.paymentStatus
                                            }
                                        </span>

                                        {/* STATUS */}

                                        <span
                                            className={`badge ${statusBadgeClass}`}
                                        >
                                            {getStatusDisplayName(
                                                status
                                            )}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div className="col-xl-4">

                        {/* =================================================
                            REGISTRATION INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Registration
                                    Information
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Registration ID
                                    </small>

                                    <div className="fw-medium text-primary">
                                        {
                                            student.registrationId
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Registration
                                        Status
                                    </small>

                                    <div>
                                        <span
                                            className={`badge ${statusBadgeClass}`}
                                        >
                                            {getStatusDisplayName(
                                                status
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Registered On
                                    </small>

                                    <div className="fw-medium">
                                        {student.createdAt
                                            ? new Date(
                                                student.createdAt
                                            ).toLocaleString()
                                            : "-"}
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Last Updated
                                    </small>

                                    <div className="fw-medium">
                                        {student.updatedAt
                                            ? new Date(
                                                student.updatedAt
                                            ).toLocaleString()
                                            : "-"}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            STUDENT INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Student Information
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Full Name
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.fullName
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Phone
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.phone
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Email
                                    </small>

                                    <div className="fw-medium text-break">
                                        {
                                            student.email
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        College
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.collegeName
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        College Roll No
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.collegeRollNo
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Degree
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.degree
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Department
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.department
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Year of Study
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.yearOfStudy
                                        }
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        District
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.district
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            TEAM INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Team Information
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Team Name
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.teamName
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Team Size
                                    </small>

                                    <div>
                                        <span className="badge bg-primary">
                                            {
                                                student
                                                    .teamMembers
                                                    .length
                                            }{" "}
                                            Members
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Hackathon Track
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.hackathonTrack
                                        }
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Primary Technical
                                        Skill
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.primaryTechnicalSkill
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            PAYMENT INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Payment Information
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Amount
                                    </small>

                                    <div className="fw-medium">
                                        ₹
                                        {
                                            student.amount
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Payment Status
                                    </small>

                                    <div>
                                        <span
                                            className={`badge ${paymentBadgeClass}`}
                                        >
                                            {
                                                student.paymentStatus
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Paid At
                                    </small>

                                    <div className="fw-medium">
                                        {student.paidAt
                                            ? new Date(
                                                student.paidAt
                                            ).toLocaleString()
                                            : "-"}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Razorpay Order ID
                                    </small>

                                    <div className="fw-medium text-break">
                                        {
                                            student.razorpayOrderId ??
                                            "-"
                                        }
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Razorpay Payment ID
                                    </small>

                                    <div className="fw-medium text-break">
                                        {
                                            student.razorpayPaymentId ??
                                            "-"
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            TERMS
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Terms & Conditions
                                </h5>

                                <span
                                    className={
                                        student.termsAccepted
                                            ? "badge bg-success"
                                            : "badge bg-danger"
                                    }
                                >
                                    {student.termsAccepted
                                        ? "Accepted"
                                        : "Not Accepted"}
                                </span>

                            </div>
                        </div>

                    </div>

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="col-xl-8">

                        {/* =================================================
                            HACKATHON INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Hackathon Information
                                </h5>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Hackathon Track
                                        </small>

                                        <div className="fw-medium">
                                            {
                                                student.hackathonTrack
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Primary Technical
                                            Skill
                                        </small>

                                        <div className="fw-medium">
                                            {
                                                student.primaryTechnicalSkill
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            Team Name
                                        </small>

                                        <div className="fw-medium">
                                            {
                                                student.teamName
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            Team Size
                                        </small>

                                        <div className="fw-medium">
                                            {
                                                student
                                                    .teamMembers
                                                    .length
                                            }{" "}
                                            Members
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            PROJECT INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Project Information
                                </h5>

                                {/* PROJECT TITLE */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Project Title
                                    </small>

                                    <h4 className="mb-0">
                                        {displayValue(
                                            student.projectTitle
                                        )}
                                    </h4>
                                </div>

                                {/* DESCRIPTION */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Project Description
                                    </small>

                                    <p className="mt-2 mb-0">
                                        {displayValue(
                                            student.projectDescription
                                        )}
                                    </p>
                                </div>

                                {/* ABSTRACT */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Project Abstract
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace:
                                                "pre-wrap",
                                        }}
                                    >
                                        {displayValue(
                                            student.projectAbstract
                                        )}
                                    </div>
                                </div>

                                {/* PROBLEM */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Problem Statement
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace:
                                                "pre-wrap",
                                        }}
                                    >
                                        {displayValue(
                                            student.problemStatement
                                        )}
                                    </div>
                                </div>

                                {/* SOLUTION */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Proposed Solution
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace:
                                                "pre-wrap",
                                        }}
                                    >
                                        {displayValue(
                                            student.proposedSolution
                                        )}
                                    </div>
                                </div>

                                {/* TECH STACK */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Technology Stack
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace:
                                                "pre-wrap",
                                        }}
                                    >
                                        {displayValue(
                                            student.techStack
                                        )}
                                    </div>
                                </div>

                                {/* EXPECTED OUTCOME */}

                                <div className="mb-4">
                                    <small className="text-muted">
                                        Expected Outcome
                                    </small>

                                    <p className="mt-2 mb-0">
                                        {displayValue(
                                            student.expectedOutcome
                                        )}
                                    </p>
                                </div>

                                {/* LINKS */}

                                <div className="row">

                                    {/* DEMO */}

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            Demo Link
                                        </small>

                                        <div className="mt-2">

                                            {student.demoLink ? (
                                                <a
                                                    href={
                                                        student.demoLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-external-link me-1" />
                                                    Open Demo
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    No demo
                                                    link
                                                </span>
                                            )}

                                        </div>
                                    </div>

                                    {/* GITHUB */}

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            GitHub Link
                                        </small>

                                        <div className="mt-2">

                                            {student.githubLink ? (
                                                <a
                                                    href={
                                                        student.githubLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-dark"
                                                >
                                                    <i className="ti ti-brand-github me-1" />
                                                    Open GitHub
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    No GitHub
                                                    link
                                                </span>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            ARCHITECTURE DIAGRAM
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Architecture Diagram
                                </h5>

                                {hasArchitectureImage &&
                                    architectureImage ? (
                                    <div className="text-center">

                                        <img
                                            src={
                                                architectureImage
                                            }
                                            alt="Architecture Diagram"
                                            className="img-fluid rounded"
                                            style={{
                                                maxHeight:
                                                    "500px",
                                            }}
                                        />

                                    </div>
                                ) : student.architectureDiagram ? (
                                    <div className="bg-light rounded p-3">

                                        <small className="text-muted d-block mb-2">
                                            Submitted
                                            Architecture
                                            Information
                                        </small>

                                        <div
                                            style={{
                                                whiteSpace:
                                                    "pre-wrap",
                                            }}
                                        >
                                            {
                                                student.architectureDiagram
                                            }
                                        </div>

                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">
                                        No architecture
                                        diagram submitted.
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* =================================================
                            TEAM MEMBERS
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <div className="d-flex align-items-center justify-content-between mb-3">

                                    <h5 className="mb-0">
                                        Team Members
                                    </h5>

                                    <span className="badge bg-primary">
                                        {
                                            student
                                                .teamMembers
                                                .length
                                        }{" "}
                                        Members
                                    </span>

                                </div>

                                {student.teamMembers
                                    .length ===
                                    0 ? (
                                    <p className="text-muted mb-0">
                                        No team members
                                        found.
                                    </p>
                                ) : (
                                    <div className="table-responsive">

                                        <table className="table table-nowrap">

                                            <thead>
                                                <tr>
                                                    <th>
                                                        #
                                                    </th>

                                                    <th>
                                                        Name
                                                    </th>

                                                    <th>
                                                        Phone
                                                    </th>

                                                    <th>
                                                        College
                                                        Roll No
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {student.teamMembers.map(
                                                    (
                                                        member,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`${member.collegeRollNo}-${index}`}
                                                        >

                                                            <td>
                                                                {
                                                                    index +
                                                                    1
                                                                }
                                                            </td>

                                                            <td>

                                                                <div className="d-flex align-items-center">

                                                                    <span className="avatar avatar-sm bg-light me-2">

                                                                        {member.name &&
                                                                            member.name !==
                                                                            "-"
                                                                            ? member.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()
                                                                            : "M"}

                                                                    </span>

                                                                    <span>
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                {
                                                                    member.phone
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    member.collegeRollNo
                                                                }
                                                            </td>

                                                        </tr>
                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                            </div>
                        </div>

                        {/* =================================================
                            PAYMENT DETAILS
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Payment Details
                                </h5>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Payment Amount
                                        </small>

                                        <div className="fw-medium">
                                            ₹
                                            {
                                                student.amount
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Payment Status
                                        </small>

                                        <div>
                                            <span
                                                className={`badge ${paymentBadgeClass}`}
                                            >
                                                {
                                                    student.paymentStatus
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Razorpay Order ID
                                        </small>

                                        <div className="fw-medium text-break">
                                            {displayValue(
                                                student.razorpayOrderId
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            Razorpay Payment ID
                                        </small>

                                        <div className="fw-medium text-break">
                                            {displayValue(
                                                student.razorpayPaymentId
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <small className="text-muted">
                                            Paid At
                                        </small>

                                        <div className="fw-medium">
                                            {student.paidAt
                                                ? new Date(
                                                    student.paidAt
                                                ).toLocaleString()
                                                : "-"}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <small className="text-muted">
                                            Razorpay Signature
                                        </small>

                                        <div className="fw-medium text-break">
                                            {displayValue(
                                                student.razorpaySignature
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            HACKATHON ACTIVITY
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-4">
                                    Hackathon Activity
                                </h5>

                                {/* REGISTRATION */}

                                <div className="card border shadow-none mb-3">

                                    <div className="card-body p-3">

                                        <div className="d-flex">

                                            <span className="avatar avatar-md me-2 bg-success">
                                                <i className="ti ti-user-plus fs-20" />
                                            </span>

                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">
                                                    Hackathon
                                                    Registration
                                                </h6>

                                                <p className="text-muted mb-1">
                                                    Student
                                                    registered
                                                    for the
                                                    hackathon.
                                                </p>

                                                <small className="text-muted">
                                                    {student.createdAt
                                                        ? new Date(
                                                            student.createdAt
                                                        ).toLocaleString()
                                                        : "-"}
                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* PAYMENT */}

                                <div className="card border shadow-none mb-3">

                                    <div className="card-body p-3">

                                        <div className="d-flex">

                                            <span
                                                className={`avatar avatar-md me-2 ${paymentBadgeClass}`}
                                            >
                                                <i className="ti ti-cash fs-20" />
                                            </span>

                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">
                                                    Payment
                                                </h6>

                                                <p className="mb-0">
                                                    Status:{" "}
                                                    <b>
                                                        {
                                                            student.paymentStatus
                                                        }
                                                    </b>
                                                </p>

                                                <p className="mb-0">
                                                    Amount:{" "}
                                                    <b>
                                                        ₹
                                                        {
                                                            student.amount
                                                        }
                                                    </b>
                                                </p>

                                                {student.paidAt && (
                                                    <small className="text-muted">
                                                        Paid
                                                        on:{" "}
                                                        {new Date(
                                                            student.paidAt
                                                        ).toLocaleString()}
                                                    </small>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* CURRENT STATUS */}

                                <div className="card border shadow-none mb-0">

                                    <div className="card-body p-3">

                                        <div className="d-flex">

                                            <span
                                                className={`avatar avatar-md me-2 ${statusBadgeClass}`}
                                            >
                                                <i className="ti ti-refresh fs-20" />
                                            </span>

                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">
                                                    Registration
                                                    Status
                                                </h6>

                                                <p className="mb-0">
                                                    Status:{" "}
                                                    <b>
                                                        {getStatusDisplayName(
                                                            status
                                                        )}
                                                    </b>
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            TECHNICAL DETAILS
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Technical Details
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        Primary Technical
                                        Skill
                                    </small>

                                    <div className="fw-medium">
                                        {
                                            student.primaryTechnicalSkill
                                        }
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Technology Stack
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace:
                                                "pre-wrap",
                                        }}
                                    >
                                        {displayValue(
                                            student.techStack
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            OTP INFORMATION
                        ================================================= */}

                        <div className="card">
                            <div className="card-body">

                                <h5 className="mb-3">
                                    Project OTP Information
                                </h5>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            OTP Attempts
                                        </small>

                                        <div className="fw-medium">
                                            {
                                                student.projectOtpAttempts
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <small className="text-muted">
                                            OTP Hash
                                        </small>

                                        <div className="fw-medium text-break">
                                            {student.projectOtpHash
                                                ? "Available"
                                                : "Not Available"}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            OTP Expires At
                                        </small>

                                        <div className="fw-medium">
                                            {student.projectOtpExpiresAt
                                                ? new Date(
                                                    student.projectOtpExpiresAt
                                                ).toLocaleString()
                                                : "-"}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted">
                                            Last OTP Sent
                                        </small>

                                        <div className="fw-medium">
                                            {student.projectOtpLastSentAt
                                                ? new Date(
                                                    student.projectOtpLastSentAt
                                                ).toLocaleString()
                                                : "-"}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackathonDetails;