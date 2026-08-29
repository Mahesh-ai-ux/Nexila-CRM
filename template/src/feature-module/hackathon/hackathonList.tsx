import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import dayjs from "dayjs";

import Footer from "../../components/footer/footer";
import PageHeader from "../../components/page-header/pageHeader";
import SearchInput from "../../components/dataTable/dataTableSearch";
import Datatable from "../../components/dataTable";
import { all_routes } from "../../routes/all_routes";
import API_URL from "../../api/apiconfig";

// =====================================================
// TEAM MEMBER
// =====================================================

interface TeamMember {
    name: string;
    phone: string;
    collegeRollNo: string;
}

// =====================================================
// REGISTRATION STATUS
// =====================================================

type RegistrationStatus =
    | "REGISTERED"
    | "QUALIFIED"
    | "SHORTLISTED"
    | "SEMI_FINALIST"
    | "FINALIST"
    | "WINNER"
    | string;

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
// HACKATHON STUDENT
// =====================================================

interface HackathonStudent {
    _id: string;

    registrationId: string;

    fullName: string;
    phone: string;
    email: string;

    collegeName: string;

    teamName: string;
    teamMembers: TeamMember[];

    hackathonTrack: string;

    primaryTechnicalSkill: string;

    yearOfStudy: string;

    teamSize: number | string;

    projectTitle: string;

    paymentStatus: string;

    status: RegistrationStatus;

    createdAt?: string;
    updatedAt?: string;
}

// =====================================================
// COMPONENT
// =====================================================

const HackathonList = () => {

    // =================================================
    // STATES
    // =================================================

    const [data, setData] = useState<HackathonStudent[]>([]);

    const [searchText, setSearchText] = useState("");

    const [loading, setLoading] = useState(false);

    const [changingStatusId, setChangingStatusId] =
        useState<string | null>(null);

    // =================================================
    // FILTER STATES
    // =================================================

    const [statusFilter, setStatusFilter] =
        useState<string>("ALL");

    const [trackFilter, setTrackFilter] =
        useState<string>("ALL");

    const [skillFilter, setSkillFilter] =
        useState<string>("ALL");

    const [yearFilter, setYearFilter] =
        useState<string>("ALL");

    const [teamSizeFilter, setTeamSizeFilter] =
        useState<string>("ALL");

    const [projectFilter, setProjectFilter] =
        useState<string>("ALL");

    // =================================================
    // SEARCH
    // =================================================

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // =================================================
    // FETCH DATA
    // =================================================

    const fetchHackathonStudents = useCallback(async () => {

        try {

            setLoading(true);

            // ---------------------------------------------
            // TOKEN
            // ---------------------------------------------

            const token = localStorage.getItem("token");

            if (!token) {

                console.error("No token found");

                setData([]);

                return;
            }

            // ---------------------------------------------
            // API
            // ---------------------------------------------

            const response = await axios.get(
                `${API_URL}/hackathon`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ---------------------------------------------
            // RESPONSE DATA
            // ---------------------------------------------

            const studentsData =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.students ||
                    response.data?.hackathonStudents ||
                    response.data?.data ||
                    [];

            // ---------------------------------------------
            // FORMAT DATA
            // ---------------------------------------------

            const formattedData: HackathonStudent[] =
                studentsData.map((student: any) => {

                    // -----------------------------------------
                    // TEAM MEMBERS
                    // -----------------------------------------

                    const teamMembers =
                        Array.isArray(student.teamMembers)
                            ? student.teamMembers
                            : [];

                    // -----------------------------------------
                    // TEAM SIZE
                    // -----------------------------------------

                    const calculatedTeamSize =
                        student.teamSize ??
                        student.teamMembersCount ??
                        (
                            teamMembers.length > 0
                                ? teamMembers.length + 1
                                : ""
                        );

                    // -----------------------------------------
                    // PROJECT TITLE
                    // -----------------------------------------

                    const projectTitle =
                        student.projectTitle ||
                        student.project?.title ||
                        "";

                    return {

                        _id: student._id,

                        registrationId:
                            student.registrationId ||
                            student.registrationID ||
                            student.registration_id ||
                            "N/A",

                        fullName:
                            student.fullName ||
                            student.teamLeadName ||
                            "N/A",

                        phone:
                            student.phone ||
                            "N/A",

                        email:
                            student.email ||
                            "N/A",

                        collegeName:
                            student.collegeName ||
                            "N/A",

                        teamName:
                            student.teamName ||
                            "N/A",

                        teamMembers,

                        hackathonTrack:
                            student.hackathonTrack ||
                            student.track ||
                            "N/A",

                        primaryTechnicalSkill:
                            student.primaryTechnicalSkill ||
                            student.primarySkill ||
                            student.technicalSkill ||
                            "N/A",

                        yearOfStudy:
                            student.yearOfStudy !== undefined &&
                                student.yearOfStudy !== null
                                ? String(student.yearOfStudy)
                                : "N/A",

                        teamSize:
                            calculatedTeamSize,

                        projectTitle,

                        paymentStatus:
                            student.paymentStatus ||
                            "Pending",

                        status:
                            student.status ||
                            "REGISTERED",

                        createdAt:
                            student.createdAt,

                        updatedAt:
                            student.updatedAt,
                    };
                });

            // ---------------------------------------------
            // SET DATA
            // ---------------------------------------------

            setData(formattedData);

            console.log(
                "Hackathon students:",
                formattedData
            );

        } catch (error: any) {

            console.error(
                "Error fetching hackathon students:",
                error?.response?.data ||
                error?.message ||
                error
            );

            setData([]);

        } finally {

            setLoading(false);

        }

    }, []);

    // =================================================
    // INITIAL FETCH
    // =================================================

    useEffect(() => {

        fetchHackathonStudents();

    }, [fetchHackathonStudents]);

    // =================================================
    // GET UNIQUE FILTER VALUES
    // =================================================

    const trackOptions = useMemo(() => {

        return Array.from(
            new Set(
                data
                    .map(
                        (student) =>
                            student.hackathonTrack
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "N/A"
                    )
            )
        ).sort();

    }, [data]);

    // =================================================

    const skillOptions = useMemo(() => {

        return Array.from(
            new Set(
                data
                    .map(
                        (student) =>
                            student.primaryTechnicalSkill
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "N/A"
                    )
            )
        ).sort();

    }, [data]);

    // =================================================

    const yearOptions = useMemo(() => {

        return Array.from(
            new Set(
                data
                    .map(
                        (student) =>
                            student.yearOfStudy
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "N/A"
                    )
            )
        ).sort();

    }, [data]);

    // =================================================

    const teamSizeOptions = useMemo(() => {

        return Array.from(
            new Set(
                data
                    .map(
                        (student) =>
                            String(student.teamSize || "")
                    )
                    .filter(
                        (value) => value !== ""
                    )
            )
        ).sort(
            (a, b) =>
                Number(a) - Number(b)
        );

    }, [data]);

    // =================================================
    // PROJECT SUBMISSION CHECK
    // =================================================

    const hasProjectSubmitted = (
        student: HackathonStudent
    ) => {

        return (
            typeof student.projectTitle === "string" &&
            student.projectTitle.trim() !== ""
        );

    };

    // =================================================
    // SEARCH FILTER
    // =================================================

    const filteredData = useMemo(() => {

        const search = searchText
            .toLowerCase()
            .trim();

        return data.filter((student) => {

            // =============================================
            // STATUS FILTER
            // =============================================

            if (
                statusFilter !== "ALL" &&
                student.status !== statusFilter
            ) {
                return false;
            }

            // =============================================
            // TRACK FILTER
            // =============================================

            if (
                trackFilter !== "ALL" &&
                student.hackathonTrack !== trackFilter
            ) {
                return false;
            }

            // =============================================
            // SKILL FILTER
            // =============================================

            if (
                skillFilter !== "ALL" &&
                student.primaryTechnicalSkill !==
                skillFilter
            ) {
                return false;
            }

            // =============================================
            // YEAR FILTER
            // =============================================

            if (
                yearFilter !== "ALL" &&
                student.yearOfStudy !== yearFilter
            ) {
                return false;
            }

            // =============================================
            // TEAM SIZE FILTER
            // =============================================

            if (
                teamSizeFilter !== "ALL" &&
                String(student.teamSize) !==
                teamSizeFilter
            ) {
                return false;
            }

            // =============================================
            // PROJECT FILTER
            // =============================================

            if (
                projectFilter === "SUBMITTED" &&
                !hasProjectSubmitted(student)
            ) {
                return false;
            }

            if (
                projectFilter === "NOT_SUBMITTED" &&
                hasProjectSubmitted(student)
            ) {
                return false;
            }

            // =============================================
            // SEARCH
            // =============================================

            if (!search) {
                return true;
            }

            // =============================================
            // TEAM MEMBER SEARCH
            // =============================================

            const teamMemberMatch =
                student.teamMembers?.some(
                    (member) => {

                        return (

                            member.name
                                ?.toLowerCase()
                                .includes(search)

                            ||

                            member.phone
                                ?.toLowerCase()
                                .includes(search)

                            ||

                            member.collegeRollNo
                                ?.toLowerCase()
                                .includes(search)

                        );

                    }
                );

            // =============================================
            // MAIN SEARCH
            // =============================================

            return (

                // Registration ID
                student.registrationId
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Team Lead
                student.fullName
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Phone
                student.phone
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Email
                student.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                // College
                student.collegeName
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Team
                student.teamName
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Track
                student.hackathonTrack
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Primary Technical Skill
                student.primaryTechnicalSkill
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Year
                student.yearOfStudy
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Team Size
                String(student.teamSize)
                    .toLowerCase()
                    .includes(search)

                ||

                // Project Title
                student.projectTitle
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Payment
                student.paymentStatus
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Status
                student.status
                    ?.toLowerCase()
                    .includes(search)

                ||

                // Team Members
                teamMemberMatch

            );

        });

    }, [
        data,
        searchText,
        statusFilter,
        trackFilter,
        skillFilter,
        yearFilter,
        teamSizeFilter,
        projectFilter,
    ]);

    // =====================================================
    // STATUS BADGE STYLE
    // =====================================================

    const getStatusStyle = (
        status: string
    ) => {

        switch (status) {

            case "REGISTERED":

                return {
                    backgroundColor: "#0d6efd",
                    color: "#ffffff",
                };

            case "QUALIFIED":

                return {
                    backgroundColor: "#198754",
                    color: "#ffffff",
                };

            case "SHORTLISTED":

                return {
                    backgroundColor: "#0dcaf0",
                    color: "#000000",
                };

            case "SEMI_FINALIST":

                return {
                    backgroundColor: "#6f42c1",
                    color: "#ffffff",
                };

            case "FINALIST":

                return {
                    backgroundColor: "#fd7e14",
                    color: "#ffffff",
                };

            case "WINNER":

                return {
                    backgroundColor: "#ffc107",
                    color: "#000000",
                };

            default:

                return {
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                };

        }

    };

    // =====================================================
    // CHANGE STATUS
    // =====================================================

    // const handleChangeStatus = async (
    //     studentId: string,
    //     newStatus: string
    // ) => {

    //     if (!studentId || !newStatus) {
    //         return;
    //     }

    //     const student = data.find(
    //         (item) =>
    //             item._id === studentId
    //     );

    //     if (!student) {
    //         return;
    //     }

    //     const currentStatus =
    //         student.status || "REGISTERED";

    //     // -----------------------------------------------
    //     // NO CHANGE
    //     // -----------------------------------------------

    //     if (
    //         newStatus === currentStatus
    //     ) {
    //         return;
    //     }

    //     // -----------------------------------------------
    //     // CONFIRM
    //     // -----------------------------------------------

    //     const confirmChange =
    //         window.confirm(
    //             `Change status from "${currentStatus}" to "${newStatus}"?`
    //         );

    //     if (!confirmChange) {

    //         // Refresh the table so the select
    //         // returns to the previous value.
    //         setData((previous) => [...previous]);

    //         return;
    //     }

    //     try {

    //         setChangingStatusId(studentId);

    //         // -------------------------------------------
    //         // TOKEN
    //         // -------------------------------------------

    //         const token =
    //             localStorage.getItem("token");

    //         // -------------------------------------------
    //         // API
    //         // -------------------------------------------

    //         const response =
    //             await axios.put(
    //                 `${API_URL}/hackathon/${studentId}`,
    //                 {
    //                     status: newStatus,
    //                 },
    //                 {
    //                     headers: {
    //                         "Content-Type":
    //                             "application/json",

    //                         Accept:
    //                             "application/json",

    //                         ...(token
    //                             ? {
    //                                 Authorization:
    //                                     `Bearer ${token}`,
    //                             }
    //                             : {}),
    //                     },
    //                 }
    //             );

    //         console.log(
    //             "STATUS UPDATE RESPONSE:",
    //             response.data
    //         );

    //         // -------------------------------------------
    //         // UPDATE UI IMMEDIATELY
    //         // -------------------------------------------

    //         setData((previous) =>
    //             previous.map(
    //                 (item) =>
    //                     item._id === studentId
    //                         ? {
    //                             ...item,
    //                             status:
    //                                 newStatus,
    //                         }
    //                         : item
    //             )
    //         );

    //         window.alert(
    //             `Status changed to ${newStatus}`
    //         );

    //     } catch (error: any) {

    //         console.error(
    //             "Change status error:",
    //             error?.response?.data ||
    //             error?.message ||
    //             error
    //         );

    //         window.alert(
    //             error?.response?.data?.message ||
    //             error?.message ||
    //             "Unable to change status"
    //         );

    //     } finally {

    //         setChangingStatusId(null);

    //     }

    // };

    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // REGISTRATION ID
        // =================================================

        {
            title: "Registration ID",

            dataIndex: "registrationId",

            key: "registrationId",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "160px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.registrationId || "")
                    .localeCompare(
                        b.registrationId || ""
                    ),
        },

        // =================================================
        // TEAM LEAD
        // =================================================

        {
            title: "Team Lead",

            dataIndex: "fullName",

            key: "fullName",

            render: (
                text: string,
                record: HackathonStudent
            ) => (

                <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">

                    <Link
                        to={all_routes.hackathonDetails.replace(
                            ":id",
                            record._id
                        )}
                        className="d-flex flex-column"
                    >
                        {text || "-"}
                    </Link>

                </h6>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.fullName || "")
                    .localeCompare(
                        b.fullName || ""
                    ),
        },

        // =================================================
        // TEAM NAME
        // =================================================

        {
            title: "Team Name",

            dataIndex: "teamName",

            key: "teamName",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "180px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.teamName || "")
                    .localeCompare(
                        b.teamName || ""
                    ),
        },

        // =================================================
        // PHONE
        // =================================================

        {
            title: "Phone",

            dataIndex: "phone",

            key: "phone",

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.phone || "")
                    .localeCompare(
                        b.phone || ""
                    ),
        },

        // =================================================
        // EMAIL
        // =================================================

        {
            title: "Email",

            dataIndex: "email",

            key: "email",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "220px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.email || "")
                    .localeCompare(
                        b.email || ""
                    ),
        },

        // =================================================
        // COLLEGE
        // =================================================

        {
            title: "College",

            dataIndex: "collegeName",

            key: "collegeName",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "220px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.collegeName || "")
                    .localeCompare(
                        b.collegeName || ""
                    ),
        },

        // =================================================
        // TRACK
        // =================================================

        {
            title: "Track",

            dataIndex: "hackathonTrack",

            key: "hackathonTrack",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "180px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.hackathonTrack || "")
                    .localeCompare(
                        b.hackathonTrack || ""
                    ),
        },

        // =================================================
        // PRIMARY TECHNICAL SKILL
        // =================================================

        {
            title: "Primary Skill",

            dataIndex:
                "primaryTechnicalSkill",

            key:
                "primaryTechnicalSkill",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "180px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (
                    a.primaryTechnicalSkill ||
                    ""
                ).localeCompare(
                    b.primaryTechnicalSkill ||
                    ""
                ),
        },

        // =================================================
        // YEAR OF STUDY
        // =================================================

        {
            title: "Year",

            dataIndex: "yearOfStudy",

            key: "yearOfStudy",

            render: (text: string) => (

                <span>
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (
                    a.yearOfStudy || ""
                ).localeCompare(
                    b.yearOfStudy || ""
                ),
        },

        // =================================================
        // TEAM SIZE
        // =================================================

        {
            title: "Team Size",

            dataIndex: "teamSize",

            key: "teamSize",

            render: (
                value: number | string
            ) => (

                <span
                    className="badge"
                    style={{
                        backgroundColor:
                            "#6c757d",
                        color: "#ffffff",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 500,
                    }}
                >
                    {value || "-"}
                </span>

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                Number(a.teamSize || 0) -
                Number(b.teamSize || 0),
        },

        // =================================================
        // PROJECT TITLE
        // =================================================

        {
            title: "Project Title",

            dataIndex: "projectTitle",

            key: "projectTitle",

            render: (text: string) => {

                const submitted =
                    text &&
                    text.trim() !== "";

                return (

                    <div
                        style={{
                            maxWidth: "220px",
                        }}
                    >

                        {submitted ? (

                            <span
                                title={text}
                                style={{
                                    display:
                                        "block",
                                    whiteSpace:
                                        "nowrap",
                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                }}
                            >
                                {text}
                            </span>

                        ) : (

                            <span
                                className="badge"
                                style={{
                                    backgroundColor:
                                        "#6c757d",
                                    color:
                                        "#ffffff",
                                    padding:
                                        "6px 10px",
                                    borderRadius:
                                        "6px",
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        500,
                                }}
                            >
                                Not Submitted
                            </span>

                        )}

                    </div>

                );

            },

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (
                    a.projectTitle || ""
                ).localeCompare(
                    b.projectTitle || ""
                ),
        },

        // =================================================
        // PAYMENT STATUS
        // =================================================

        {
            title: "Payment",

            dataIndex: "paymentStatus",

            key: "paymentStatus",

            render: (status: string) => {

                const isPaid =
                    status?.toLowerCase() ===
                    "paid";

                return (

                    <span
                        className="badge"
                        style={{
                            backgroundColor:
                                isPaid
                                    ? "#198754"
                                    : "#ffc107",

                            color:
                                isPaid
                                    ? "#ffffff"
                                    : "#000000",

                            padding:
                                "6px 10px",

                            borderRadius:
                                "6px",

                            fontSize:
                                "12px",

                            fontWeight:
                                500,

                            display:
                                "inline-block",

                            minWidth:
                                "65px",

                            textAlign:
                                "center",
                        }}
                    >
                        {status || "Pending"}
                    </span>

                );

            },

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (
                    a.paymentStatus || ""
                ).localeCompare(
                    b.paymentStatus || ""
                ),
        },

        // =====================================================
        // STATUS
        // =====================================================

        {
            title: "Status",

            dataIndex: "status",

            key: "status",

            render: (status: RegistrationStatus) => {

                const style = getStatusStyle(status);

                return (
                    <span
                        className="badge"
                        style={{
                            ...style,

                            padding: "6px 10px",

                            borderRadius: "6px",

                            fontSize: "12px",

                            fontWeight: 500,

                            display: "inline-block",

                            minWidth: "110px",

                            textAlign: "center",
                        }}
                    >
                        {status || "REGISTERED"}
                    </span>
                );

            },

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.status || "").localeCompare(
                    b.status || ""
                ),
        },

        // =================================================
        // REGISTERED DATE
        // =================================================

        {
            title: "Registered On",

            dataIndex: "createdAt",

            key: "createdAt",

            render: (date: string) => (

                date
                    ? dayjs(date).format(
                        "DD-MM-YYYY"
                    )
                    : "-"

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                dayjs(
                    a.createdAt || 0
                ).valueOf()
                -
                dayjs(
                    b.createdAt || 0
                ).valueOf(),
        },

        // =================================================
        // ACTION
        // =================================================

        {
            title: "Action",

            dataIndex: "Action",

            key: "Action",

            render: (
                _: any,
                record: HackathonStudent
            ) => (

                <div className="dropdown table-action">

                    {/* ACTION BUTTON */}

                    <Link
                        to="#"
                        className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="ti ti-dots-vertical" />
                    </Link>

                    {/* DROPDOWN */}

                    <div className="dropdown-menu dropdown-menu-right">

                        {/* VIEW */}

                        <Link
                            className="dropdown-item"
                            to={all_routes.hackathonDetails.replace(
                                ":id",
                                record._id
                            )}
                        >

                            <i className="ti ti-eye text-blue" />

                            <span className="ms-2">
                                View
                            </span>

                        </Link>

                    </div>

                </div>

            ),

            sorter: () => 0,
        },

    ];

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setStatusFilter("ALL");

        setTrackFilter("ALL");

        setSkillFilter("ALL");

        setYearFilter("ALL");

        setTeamSizeFilter("ALL");

        setProjectFilter("ALL");

    };

    // =====================================================
    // RETURN
    // =====================================================

    return (

        <>

            <div className="page-wrapper">

                <div className="content pb-0">

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <PageHeader
                        title="Hackathon Students"
                        badgeCount={
                            filteredData.length
                        }
                        showModuleTile={false}
                    />

                    {/* =================================================
                        MAIN CARD
                    ================================================= */}

                    <div className="card border-0 rounded-0">

                        {/* =================================================
                            CARD HEADER
                        ================================================= */}

                        <div className="card-header">

                            {/* =================================================
                                TOP ROW
                            ================================================= */}

                            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">

                                {/* SEARCH */}

                                <div className="input-icon input-icon-start position-relative">

                                    <span className="input-icon-addon text-dark">

                                        <i className="ti ti-search" />

                                    </span>

                                    <SearchInput
                                        value={
                                            searchText
                                        }
                                        onChange={
                                            handleSearch
                                        }
                                    />

                                </div>

                                {/* REFRESH */}

                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={
                                        fetchHackathonStudents
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    <i className="ti ti-refresh me-1" />

                                    {loading
                                        ? "Loading..."
                                        : "Refresh"}

                                </button>

                            </div>

                            {/* =================================================
                                FILTER ROW
                            ================================================= */}

                            <div className="row g-2 mt-3">

                                {/* STATUS */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            statusFilter
                                        }
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Status
                                        </option>

                                        {STATUS_OPTIONS.map(
                                            (status) => (

                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {
                                                        status
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                {/* TRACK */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Hackathon Track
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            trackFilter
                                        }
                                        onChange={(event) =>
                                            setTrackFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Tracks
                                        </option>

                                        {trackOptions.map(
                                            (track) => (

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

                                {/* PRIMARY SKILL */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Primary Technical Skill
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            skillFilter
                                        }
                                        onChange={(event) =>
                                            setSkillFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Skills
                                        </option>

                                        {skillOptions.map(
                                            (skill) => (

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

                                {/* YEAR */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Year of Study
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            yearFilter
                                        }
                                        onChange={(event) =>
                                            setYearFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Years
                                        </option>

                                        {yearOptions.map(
                                            (year) => (

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

                                {/* TEAM SIZE */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Team Size
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            teamSizeFilter
                                        }
                                        onChange={(event) =>
                                            setTeamSizeFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Team Sizes
                                        </option>

                                        {teamSizeOptions.map(
                                            (size) => (

                                                <option
                                                    key={
                                                        size
                                                    }
                                                    value={
                                                        size
                                                    }
                                                >
                                                    {size}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                {/* PROJECT */}

                                <div className="col-md-2">

                                    <label className="form-label mb-1">
                                        Project Title
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            projectFilter
                                        }
                                        onChange={(event) =>
                                            setProjectFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All
                                        </option>

                                        <option value="SUBMITTED">
                                            Submitted
                                        </option>

                                        <option value="NOT_SUBMITTED">
                                            Not Submitted
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* =================================================
                                RESET FILTER
                            ================================================= */}

                            <div className="mt-3">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={
                                        resetFilters
                                    }
                                >

                                    <i className="ti ti-filter-off me-1" />

                                    Reset Filters

                                </button>

                                <span className="ms-3 text-muted fs-13">

                                    Showing{" "}

                                    <strong>
                                        {
                                            filteredData.length
                                        }
                                    </strong>

                                    {" "}of{" "}

                                    <strong>
                                        {
                                            data.length
                                        }
                                    </strong>

                                    {" "}students

                                </span>

                            </div>

                        </div>

                        {/* =================================================
                            CARD BODY
                        ================================================= */}

                        <div className="card-body">

                            <div className="table-nowrap custom-table">

                                <Datatable
                                    columns={
                                        columns
                                    }
                                    dataSource={
                                        filteredData
                                    }
                                    Selection={
                                        true
                                    }
                                    searchText={
                                        searchText
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}

                <Footer />

            </div>

        </>

    );

};

export default HackathonList;