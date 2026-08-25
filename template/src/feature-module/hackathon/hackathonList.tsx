import { useEffect, useState } from "react";
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
// TEAM MEMBER INTERFACE
// =====================================================

interface TeamMember {
    name: string;
    phone: string;
    collegeRollNo: string;
}


// =====================================================
// HACKATHON STUDENT INTERFACE
// =====================================================

interface HackathonStudent {
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
}


// =====================================================
// COMPONENT
// =====================================================

const HackathonList = () => {

    // =====================================================
    // STATES
    // =====================================================

    const [data, setData] = useState<HackathonStudent[]>([]);

    const [searchText, setSearchText] =
        useState<string>("");

    const [loading, setLoading] =
        useState<boolean>(false);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (value: string) => {

        setSearchText(value);

    };


    // =====================================================
    // FETCH HACKATHON STUDENTS
    // =====================================================

    const fetchHackathonStudents = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");


            // =================================================
            // TOKEN CHECK
            // =================================================

            if (!token) {

                console.error(
                    "No token found in localStorage"
                );

                return;
            }


            // =================================================
            // API REQUEST
            // =================================================

            const response = await axios.get(
                `${API_URL}/hackathon`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            // =================================================
            // HANDLE DIFFERENT RESPONSE STRUCTURES
            // =================================================

            const studentsData =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.students ||
                    response.data.hackathonStudents ||
                    response.data.data ||
                    [];


            // =================================================
            // FORMAT DATA
            // =================================================

            const formattedData:
                HackathonStudent[] =
                studentsData.map(
                    (student: any) => ({

                        _id:
                            student._id,

                        fullName:
                            student.fullName ||
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

                        degree:
                            student.degree ||
                            "N/A",

                        department:
                            student.department ||
                            "N/A",

                        collegeRollNo:
                            student.collegeRollNo ||
                            "N/A",

                        city:
                            student.city ||
                            "N/A",

                        projectTitle:
                            student.projectTitle ||
                            "N/A",

                        projectDescription:
                            student.projectDescription ||
                            "N/A",

                        projectAbstract:
                            student.projectAbstract ||
                            "N/A",

                        teamMembers:
                            Array.isArray(
                                student.teamMembers
                            )
                                ? student.teamMembers
                                : [],

                        paymentStatus:
                            student.paymentStatus ||
                            "Pending",

                        registrationStatus:
                            student.registrationStatus ||
                            "Registered",

                        createdAt:
                            student.createdAt,

                        updatedAt:
                            student.updatedAt,
                    })
                );


            // =================================================
            // SET DATA
            // =================================================

            setData(formattedData);


            console.log(
                "Hackathon students loaded:",
                formattedData
            );

        } catch (error: any) {

            console.error(
                "Error fetching hackathon students:",
                error?.response?.data ||
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        fetchHackathonStudents();

    }, []);


    // =====================================================
    // FILTER DATA
    // =====================================================

    const filteredData =
        data.filter((student) => {

            const search =
                searchText
                    .toLowerCase()
                    .trim();


            // =================================================
            // NO SEARCH
            // =================================================

            if (!search) {

                return true;

            }


            // =================================================
            // SEARCH FIELDS
            // =================================================

            return (

                student.fullName
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.phone
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.email
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.collegeName
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.department
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.degree
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.collegeRollNo
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.city
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.projectTitle
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.paymentStatus
                    ?.toLowerCase()
                    .includes(search)

                ||

                student.registrationStatus
                    ?.toLowerCase()
                    .includes(search)
            );

        });


    // =====================================================
    // TEAM MEMBER COUNT
    // =====================================================

    const getTeamCount = (
        student: HackathonStudent
    ) => {

        return (
            student.teamMembers?.length || 0
        );

    };


    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // STUDENT NAME
        // =================================================

        {
            title: "Student Name",

            dataIndex: "fullName",

            key: "fullName",

            render: (
                text: string,
                record: HackathonStudent
            ) => (

                <h6
                    className="d-flex align-items-center fs-14 fw-medium mb-0"
                >

                    <Link
                        to={`${all_routes.hackathonDetails.replace(
                            ":id",
                            record._id
                        )}`}
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
        // DEGREE
        // =================================================

        {
            title: "Degree",

            dataIndex: "degree",

            key: "degree",

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.degree || "")
                    .localeCompare(
                        b.degree || ""
                    ),
        },


        // =================================================
        // DEPARTMENT
        // =================================================

        {
            title: "Department",

            dataIndex: "department",

            key: "department",

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.department || "")
                    .localeCompare(
                        b.department || ""
                    ),
        },


        // =================================================
        // ROLL NUMBER
        // =================================================

        {
            title: "Roll No",

            dataIndex: "collegeRollNo",

            key: "collegeRollNo",

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.collegeRollNo || "")
                    .localeCompare(
                        b.collegeRollNo || ""
                    ),
        },


        // =================================================
        // CITY
        // =================================================

        {
            title: "City",

            dataIndex: "city",

            key: "city",

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.city || "")
                    .localeCompare(
                        b.city || ""
                    ),
        },


        // =================================================
        // PROJECT TITLE
        // =================================================

        {
            title: "Project Title",

            dataIndex: "projectTitle",

            key: "projectTitle",

            render: (text: string) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "250px",
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
                (a.projectTitle || "")
                    .localeCompare(
                        b.projectTitle || ""
                    ),
        },


        // =================================================
        // TEAM MEMBERS
        // =================================================

        {
            title: "Team Members",

            dataIndex: "teamMembers",

            key: "teamMembers",

            render: (
                _teamMembers: TeamMember[],
                record: HackathonStudent
            ) => {

                const count =
                    getTeamCount(record);

                return (

                    <span
                        className="badge"
                        style={{
                            backgroundColor:
                                "#6f42c1",

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

                            minWidth:
                                "35px",

                            display:
                                "inline-block",

                            textAlign:
                                "center",
                        }}
                    >

                        {count}

                    </span>

                );

            },

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                getTeamCount(a) -
                getTeamCount(b),
        },


        // =================================================
        // PAYMENT STATUS
        // =================================================

        {
            title: "Payment Status",

            dataIndex: "paymentStatus",

            key: "paymentStatus",

            render: (status: string) => {

                const isPaid =
                    status === "Paid";


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
                (a.paymentStatus || "")
                    .localeCompare(
                        b.paymentStatus || ""
                    ),
        },


        // =================================================
        // REGISTRATION STATUS
        // =================================================

        {
            title: "Registration Status",

            dataIndex: "registrationStatus",

            key: "registrationStatus",

            render: (status: string) => {

                const isRegistered =
                    status === "Registered";


                return (

                    <span
                        className="badge"
                        style={{
                            backgroundColor:
                                isRegistered
                                    ? "#198754"
                                    : "#dc3545",

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

                            display:
                                "inline-block",

                            minWidth:
                                "85px",

                            textAlign:
                                "center",
                        }}
                    >

                        {status ||
                            "Registered"}

                    </span>

                );

            },

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (
                    a.registrationStatus ||
                    ""
                ).localeCompare(
                    b.registrationStatus ||
                    ""
                ),
        },


        // =================================================
        // REGISTERED ON
        // =================================================

        {
            title: "Registered On",

            dataIndex: "createdAt",

            key: "createdAt",

            render: (date: string) => (

                date
                    ? dayjs(date)
                        .format(
                            "DD-MM-YYYY"
                        )
                    : "-"

            ),

            sorter: (
                a: HackathonStudent,
                b: HackathonStudent
            ) =>
                (a.createdAt || "")
                    .localeCompare(
                        b.createdAt || ""
                    ),
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

                <div
                    className="dropdown table-action"
                >

                    <Link
                        to="#"
                        className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >

                        <i className="ti ti-dots-vertical" />

                    </Link>


                    <div
                        className="dropdown-menu dropdown-menu-right"
                    >

                        <Link
                            className="dropdown-item"
                            to={`${all_routes.hackathonDetails.replace(
                                ":id",
                                record._id
                            )}`}
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

                    <div
                        className="card border-0 rounded-0"
                    >


                        {/* =============================================
                            CARD HEADER
                        ============================================= */}

                        <div
                            className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap"
                        >


                            {/* =========================================
                                SEARCH
                            ========================================= */}

                            <div
                                className="input-icon input-icon-start position-relative"
                            >

                                <span
                                    className="input-icon-addon text-dark"
                                >

                                    <i
                                        className="ti ti-search"
                                    />

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


                            {/* =========================================
                                REFRESH
                            ========================================= */}

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

                                <i
                                    className="ti ti-refresh me-1"
                                />


                                {loading
                                    ? "Loading..."
                                    : "Refresh"}

                            </button>

                        </div>


                        {/* =============================================
                            CARD BODY
                        ============================================= */}

                        <div className="card-body">


                            <div
                                className="table-nowrap custom-table"
                            >

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


                {/* =================================================
                    FOOTER
                ================================================= */}

                <Footer />

            </div>

        </>

    );

};


export default HackathonList;