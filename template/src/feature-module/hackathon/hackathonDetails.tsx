import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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

type HackathonStudent = {
    _id: string;

    fullName: string;
    phone: string;
    email: string;

    collegeName: string;
    degree: string;
    department: string;
    collegeRollNo: string;
    city: string;

    projectTitle: string;
    projectDescription: string;
    projectAbstract: string;

    teamMembers: TeamMember[];

    paymentStatus: "Pending" | "Paid";
    registrationStatus: "Registered" | "Cancelled";

    createdAt?: string;
    updatedAt?: string;
};


// =====================================================
// API
// =====================================================

const HACKATHON_API = "http://3.16.128.134:5000/api/hackathon"; //http://3.16.128.134


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

    // ===================================================
    // FETCH HACKATHON STUDENT
    // ===================================================

    useEffect(() => {

        if (!id) {
            setError("Hackathon student ID not found");
            setLoading(false);
            return;
        }

        const fetchStudent = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `${HACKATHON_API}/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",

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
                        "Failed to fetch hackathon student"
                    );
                }

                const data =
                    await response.json();

                console.log(
                    "Hackathon Student:",
                    data
                );

                // =============================================
                // SUPPORT BOTH:
                //
                // { success: true, student: {...} }
                //
                // OR
                //
                // { student: {...} }
                //
                // OR
                //
                // {...student}
                // =============================================

                const studentData =
                    data.student ||
                    data.data ||
                    data;

                if (!studentData?._id) {

                    setError(
                        "Hackathon student not found"
                    );

                    setLoading(false);

                    return;
                }

                setStudent({
                    _id:
                        studentData._id,

                    fullName:
                        studentData.fullName || "-",

                    phone:
                        studentData.phone || "-",

                    email:
                        studentData.email || "-",

                    collegeName:
                        studentData.collegeName || "-",

                    degree:
                        studentData.degree || "-",

                    department:
                        studentData.department || "-",

                    collegeRollNo:
                        studentData.collegeRollNo || "-",

                    city:
                        studentData.city || "-",

                    projectTitle:
                        studentData.projectTitle || "-",

                    projectDescription:
                        studentData.projectDescription || "-",

                    projectAbstract:
                        studentData.projectAbstract || "-",

                    teamMembers:
                        Array.isArray(
                            studentData.teamMembers
                        )
                            ? studentData.teamMembers
                            : [],

                    paymentStatus:
                        studentData.paymentStatus ||
                        "Pending",

                    registrationStatus:
                        studentData.registrationStatus ||
                        "Registered",

                    createdAt:
                        studentData.createdAt,

                    updatedAt:
                        studentData.updatedAt,
                });

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


    // ===================================================
    // LOADING
    // ===================================================

    if (loading) {

        return (
            <div className="page-wrapper">

                <div className="content">

                    <div className="text-center py-5">

                        <p className="mb-0">
                            Loading hackathon student details...
                        </p>

                    </div>

                </div>

            </div>
        );

    }


    // ===================================================
    // ERROR
    // ===================================================

    if (error || !student) {

        return (
            <div className="page-wrapper">

                <div className="content">

                    <div className="alert alert-danger">

                        {error || "Hackathon student not found"}

                    </div>

                    <Link
                        to={all_routes.hackathonList}
                        className="btn btn-primary"
                    >
                        ← Back to Hackathon Students
                    </Link>

                </div>

            </div>
        );

    }


    // ===================================================
    // INITIAL
    // ===================================================

    const firstLetter =
        student.fullName
            ?.charAt(0)
            ?.toUpperCase() || "S";


    // ===================================================
    // RETURN
    // ===================================================

    return (

        <div className="page-wrapper">

            <div className="content pb-0">


                {/* =================================================
            PAGE HEADER
        ================================================= */}

                <PageHeader
                    title="Hackathon Students"
                    badgeCount={1}
                    showModuleTile={false}
                    showExport={false}
                />


                <div className="row">


                    {/* =================================================
              BACK BUTTON
          ================================================= */}

                    <div className="col-md-12 mb-3">

                        <Link
                            to={all_routes.hackathonList}
                            className="text-primary"
                        >
                            ← Back to Hackathon Students
                        </Link>

                    </div>


                    {/* =================================================
              TOP STUDENT CARD
          ================================================= */}

                    <div className="col-md-12">

                        <div className="card">

                            <div className="card-body">

                                <div className="d-flex align-items-center gap-3">


                                    {/* Avatar */}

                                    <div
                                        className="avatar bg-primary d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "65px",
                                            height: "65px",
                                            borderRadius: "50%",
                                            color: "#fff",
                                            fontSize: "24px",
                                            fontWeight: 600,
                                        }}
                                    >

                                        {firstLetter}

                                    </div>


                                    {/* Student Information */}

                                    <div>

                                        <h5 className="mb-1">
                                            {student.fullName}
                                        </h5>

                                        <p className="mb-1">
                                            <i className="ti ti-school me-1" />
                                            {student.collegeName}
                                        </p>

                                        <p className="mb-0 text-muted">

                                            <i className="ti ti-phone me-1" />

                                            {student.phone}

                                        </p>

                                    </div>


                                    {/* STATUS */}

                                    <div className="ms-auto d-flex gap-2">


                                        <span
                                            className={
                                                `badge ${student.paymentStatus === "Paid"
                                                    ? "bg-success"
                                                    : "bg-warning"
                                                }`
                                            }
                                        >

                                            Payment:{" "}
                                            {student.paymentStatus}

                                        </span>


                                        <span
                                            className={
                                                `badge ${student.registrationStatus ===
                                                    "Registered"
                                                    ? "bg-primary"
                                                    : "bg-danger"
                                                }`
                                            }
                                        >

                                            {student.registrationStatus}

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
                                        {student.fullName}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Phone
                                    </small>

                                    <div className="fw-medium">
                                        {student.phone}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Email
                                    </small>

                                    <div className="fw-medium">
                                        {student.email}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        College
                                    </small>

                                    <div className="fw-medium">
                                        {student.collegeName}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        College Roll No
                                    </small>

                                    <div className="fw-medium">
                                        {student.collegeRollNo}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Degree
                                    </small>

                                    <div className="fw-medium">
                                        {student.degree}
                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Department
                                    </small>

                                    <div className="fw-medium">
                                        {student.department}
                                    </div>

                                </div>


                                <div className="mb-0">

                                    <small className="text-muted">
                                        City
                                    </small>

                                    <div className="fw-medium">
                                        {student.city}
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                REGISTRATION INFORMATION
            ================================================= */}

                        <div className="card">

                            <div className="card-body">

                                <h5 className="mb-3">
                                    Registration Information
                                </h5>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Payment Status
                                    </small>

                                    <div>

                                        <span
                                            className={
                                                `badge ${student.paymentStatus === "Paid"
                                                    ? "bg-success"
                                                    : "bg-warning"
                                                }`
                                            }
                                        >

                                            {student.paymentStatus}

                                        </span>

                                    </div>

                                </div>


                                <div className="mb-3">

                                    <small className="text-muted">
                                        Registration Status
                                    </small>

                                    <div>

                                        <span
                                            className={
                                                `badge ${student.registrationStatus ===
                                                    "Registered"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                                }`
                                            }
                                        >

                                            {student.registrationStatus}

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

                    </div>


                    {/* =================================================
              RIGHT SIDE
          ================================================= */}

                    <div className="col-xl-8">


                        {/* =================================================
                PROJECT INFORMATION
            ================================================= */}

                        <div className="card">

                            <div className="card-body">

                                <h5 className="mb-3">
                                    Project Information
                                </h5>


                                <div className="mb-4">

                                    <small className="text-muted">
                                        Project Title
                                    </small>

                                    <h4 className="mb-0">
                                        {student.projectTitle}
                                    </h4>

                                </div>


                                <div className="mb-4">

                                    <small className="text-muted">
                                        Project Description
                                    </small>

                                    <p className="mt-2 mb-0">
                                        {student.projectDescription}
                                    </p>

                                </div>


                                <div>

                                    <small className="text-muted">
                                        Project Abstract
                                    </small>

                                    <div
                                        className="bg-light rounded p-3 mt-2"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >

                                        {student.projectAbstract}

                                    </div>

                                </div>

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

                                        {student.teamMembers.length} Members

                                    </span>

                                </div>


                                {student.teamMembers.length === 0 ? (

                                    <p className="text-muted mb-0">
                                        No team members found.
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
                                                        College Roll No
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
                                                            key={index}
                                                        >

                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td>

                                                                <div className="d-flex align-items-center">

                                                                    <span
                                                                        className="avatar avatar-sm bg-light me-2"
                                                                    >

                                                                        {member.name
                                                                            ?.charAt(0)
                                                                            ?.toUpperCase()}

                                                                    </span>

                                                                    <span>
                                                                        {member.name}
                                                                    </span>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                {member.phone}
                                                            </td>

                                                            <td>
                                                                {member.collegeRollNo}
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
                HACKATHON ACTIVITY
            ================================================= */}

                        <div className="card">

                            <div className="card-body pb-0 pt-2">

                                <ul className="nav nav-tabs nav-bordered border-0 mb-0">

                                    <li className="nav-item">

                                        <button
                                            className="nav-link active"
                                            type="button"
                                        >
                                            Hackathon Activity
                                        </button>

                                    </li>

                                </ul>

                            </div>


                            <div className="card-body">


                                {/* Registration */}

                                <div className="card border shadow-none mb-3">

                                    <div className="card-body p-3">

                                        <div className="d-flex">


                                            <span className="avatar avatar-md me-2 bg-success">

                                                <i className="ti ti-user-plus fs-20" />

                                            </span>


                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">
                                                    Hackathon Registration
                                                </h6>

                                                <p className="text-muted mb-0">

                                                    Student registered for the hackathon.

                                                </p>

                                                {student.createdAt && (

                                                    <small className="text-muted">

                                                        {new Date(
                                                            student.createdAt
                                                        ).toLocaleString()}

                                                    </small>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* Payment */}

                                <div className="card border shadow-none mb-3">

                                    <div className="card-body p-3">

                                        <div className="d-flex">


                                            <span
                                                className={
                                                    `avatar avatar-md me-2 ${student.paymentStatus ===
                                                        "Paid"
                                                        ? "bg-success"
                                                        : "bg-warning"
                                                    }`
                                                }
                                            >

                                                <i className="ti ti-cash fs-20" />

                                            </span>


                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">

                                                    Payment Status

                                                </h6>


                                                <p className="mb-0">

                                                    Payment:{" "}

                                                    <b>
                                                        {student.paymentStatus}
                                                    </b>

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* Registration Status */}

                                <div className="card border shadow-none mb-3">

                                    <div className="card-body p-3">

                                        <div className="d-flex">


                                            <span
                                                className={
                                                    `avatar avatar-md me-2 ${student.registrationStatus ===
                                                        "Registered"
                                                        ? "bg-primary"
                                                        : "bg-danger"
                                                    }`
                                                }
                                            >

                                                <i className="ti ti-refresh fs-20" />

                                            </span>


                                            <div className="flex-grow-1">

                                                <h6 className="fw-semibold mb-1">

                                                    Registration Status

                                                </h6>


                                                <p className="mb-0">

                                                    Status:{" "}

                                                    <b>
                                                        {student.registrationStatus}
                                                    </b>

                                                </p>

                                            </div>

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