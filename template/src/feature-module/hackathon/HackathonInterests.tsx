import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import Footer from "../../components/footer/footer";
import PageHeader from "../../components/page-header/pageHeader";
import SearchInput from "../../components/dataTable/dataTableSearch";
import Datatable from "../../components/dataTable";
import API_URL from "../../api/apiconfig";

// =====================================================
// STATUS TYPE
// =====================================================

type InterestStatus = "interested" | "not interested" | "link sent" | string;

// =====================================================
// STATUS OPTIONS
// =====================================================

const STATUS_OPTIONS: InterestStatus[] = [
    "interested",
    "not interested",
    "link sent"
];

// =====================================================
// HACKATHON INTEREST
// =====================================================

interface HackathonInterest {
    _id: string;

    name: string;

    email: string;

    mobileNumber: string;

    status: InterestStatus;

    createdAt?: string;

    updatedAt?: string;
}

// =====================================================
// COMPONENT
// =====================================================

const HackathonInterests = () => {

    // =================================================
    // STATES
    // =================================================

    const [data, setData] =
        useState<HackathonInterest[]>([]);

    const [searchText, setSearchText] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [changingStatusId, setChangingStatusId] =
        useState<string | null>(null);

    // =================================================
    // FILTER
    // =================================================

    const [statusFilter, setStatusFilter] =
        useState<string>("ALL");

    // =================================================
    // SEARCH
    // =================================================

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // =================================================
    // FETCH HACKATHON INTERESTS
    // =================================================

    const fetchHackathonInterests = useCallback(
        async () => {

            try {

                setLoading(true);

                // -----------------------------------------
                // TOKEN
                // -----------------------------------------

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    console.error(
                        "No token found"
                    );

                    setData([]);

                    return;
                }

                // -----------------------------------------
                // API
                // -----------------------------------------

                const response = await axios.get(
                    `${API_URL}/hackathon-interest`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                // -----------------------------------------
                // RESPONSE DATA
                // -----------------------------------------

                const interestsData =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data?.interests ||
                        response.data?.hackathonInterests ||
                        response.data?.data ||
                        [];

                // -----------------------------------------
                // FORMAT DATA
                // -----------------------------------------

                const formattedData: HackathonInterest[] =
                    interestsData.map(
                        (student: any) => {

                            return {

                                _id:
                                    student._id,

                                name:
                                    student.name ||
                                    "N/A",

                                email:
                                    student.email ||
                                    "N/A",

                                mobileNumber:
                                    student.mobileNumber ||
                                    student.mobile ||
                                    student.phone ||
                                    "N/A",

                                status:
                                    student.status ||
                                    "interested",

                                createdAt:
                                    student.createdAt,

                                updatedAt:
                                    student.updatedAt,

                            };

                        }
                    );

                // -----------------------------------------
                // SET DATA
                // -----------------------------------------

                setData(formattedData);

                console.log(
                    "Hackathon interests:",
                    formattedData
                );

            } catch (error: any) {

                console.error(
                    "Error fetching hackathon interests:",
                    error?.response?.data ||
                    error?.message ||
                    error
                );

                setData([]);

            } finally {

                setLoading(false);

            }

        },
        []
    );

    // =================================================
    // INITIAL FETCH
    // =================================================

    useEffect(() => {

        fetchHackathonInterests();

    }, [fetchHackathonInterests]);

    // =================================================
    // FILTERED DATA
    // =================================================

    const filteredData = useMemo(() => {

        const search =
            searchText
                .toLowerCase()
                .trim();

        return data.filter(
            (student) => {

                // -----------------------------------------
                // STATUS FILTER
                // -----------------------------------------

                if (
                    statusFilter !== "ALL" &&
                    student.status !== statusFilter
                ) {

                    return false;

                }

                // -----------------------------------------
                // SEARCH
                // -----------------------------------------

                if (!search) {

                    return true;

                }

                // -----------------------------------------
                // SEARCH FIELDS
                // -----------------------------------------

                return (

                    student.name
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    student.email
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    student.mobileNumber
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    student.status
                        ?.toLowerCase()
                        .includes(search)

                );

            }
        );

    }, [
        data,
        searchText,
        statusFilter,
    ]);

    // =====================================================
    // STATUS BADGE STYLE
    // =====================================================

    const getStatusStyle = (
        status: string
    ) => {

        switch (
        status?.toLowerCase()
        ) {

            case "interested":

                return {
                    backgroundColor:
                        "#ffee00",

                    color:
                        "#050505",
                };

            case "link sent":

                return {
                    backgroundColor:
                        "#198754",

                    color:
                        "#ffffff",
                };

            case "not interested":

                return {
                    backgroundColor:
                        "#dc3545",

                    color:
                        "#ffffff",
                };

            default:

                return {
                    backgroundColor:
                        "#6c757d",

                    color:
                        "#ffffff",
                };

        }

    };

    // =====================================================
    // CHANGE STATUS
    // =====================================================

    const handleChangeStatus = async (
        studentId: string,
        newStatus: string
    ) => {

        if (
            !studentId ||
            !newStatus
        ) {

            return;

        }

        // -----------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------

        const student =
            data.find(
                (item) =>
                    item._id === studentId
            );

        if (!student) {

            return;

        }

        // -----------------------------------------------
        // CURRENT STATUS
        // -----------------------------------------------

        const currentStatus =
            student.status ||
            "interested";

        // -----------------------------------------------
        // NO CHANGE
        // -----------------------------------------------

        if (
            newStatus === currentStatus
        ) {

            return;

        }

        // -----------------------------------------------
        // CONFIRM
        // -----------------------------------------------

        const confirmChange =
            window.confirm(
                `Change status from "${currentStatus}" to "${newStatus}"?`
            );

        if (!confirmChange) {

            // Restore UI

            setData(
                (previous) =>
                    [...previous]
            );

            return;

        }

        try {

            setChangingStatusId(
                studentId
            );

            // -------------------------------------------
            // TOKEN
            // -------------------------------------------

            const token =
                localStorage.getItem("token");

            // -------------------------------------------
            // API
            // -------------------------------------------

            const response =
                await axios.patch(
                    `${API_URL}/hackathon-interest/${studentId}/status`,
                    {
                        status:
                            newStatus,
                    },
                    {
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
                    }
                );

            console.log(
                "INTEREST STATUS UPDATE RESPONSE:",
                response.data
            );

            // -------------------------------------------
            // UPDATE UI IMMEDIATELY
            // -------------------------------------------

            setData(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id === studentId
                                ? {
                                    ...item,
                                    status:
                                        newStatus,
                                }
                                : item
                    )
            );

            // -------------------------------------------
            // SUCCESS
            // -------------------------------------------

            window.alert(
                `Status changed to ${newStatus}`
            );

        } catch (error: any) {

            console.error(
                "Change interest status error:",
                error?.response?.data ||
                error?.message ||
                error
            );

            window.alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to change status"
            );

        } finally {

            setChangingStatusId(null);

        }

    };

    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const columns = [

        // =================================================
        // NAME
        // =================================================

        {
            title: "Name",

            dataIndex: "name",

            key: "name",

            render: (
                text: string
            ) => (

                <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">

                    <span>
                        {text || "-"}
                    </span>

                </h6>

            ),

            sorter: (
                a: HackathonInterest,
                b: HackathonInterest
            ) =>
                (a.name || "")
                    .localeCompare(
                        b.name || ""
                    ),
        },

        // =================================================
        // EMAIL
        // =================================================

        {
            title: "Email",

            dataIndex: "email",

            key: "email",

            render: (
                text: string
            ) => (

                <span
                    title={text}
                    style={{
                        display: "block",
                        maxWidth: "250px",
                        whiteSpace:
                            "nowrap",
                        overflow:
                            "hidden",
                        textOverflow:
                            "ellipsis",
                    }}
                >
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonInterest,
                b: HackathonInterest
            ) =>
                (a.email || "")
                    .localeCompare(
                        b.email || ""
                    ),
        },

        // =================================================
        // MOBILE
        // =================================================

        {
            title: "Mobile",

            dataIndex:
                "mobileNumber",

            key:
                "mobileNumber",

            render: (
                text: string
            ) => (

                <span>
                    {text || "-"}
                </span>

            ),

            sorter: (
                a: HackathonInterest,
                b: HackathonInterest
            ) =>
                (
                    a.mobileNumber ||
                    ""
                ).localeCompare(
                    b.mobileNumber ||
                    ""
                ),
        },

        // =================================================
        // STATUS
        // =================================================

        {
            title: "Status",

            dataIndex: "status",

            key: "status",

            render: (
                status: InterestStatus
            ) => {

                const style =
                    getStatusStyle(
                        status
                    );

                return (

                    <span
                        className="badge"
                        style={{
                            ...style,

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
                                "120px",

                            textAlign:
                                "center",

                            textTransform:
                                "capitalize",
                        }}
                    >
                        {status ||
                            "interested"}
                    </span>

                );

            },

            sorter: (
                a: HackathonInterest,
                b: HackathonInterest
            ) =>
                (
                    a.status || ""
                ).localeCompare(
                    b.status || ""
                ),
        },

        // =================================================
        // REGISTERED DATE
        // =================================================

        {
            title: "Registered On",

            dataIndex:
                "createdAt",

            key:
                "createdAt",

            render: (
                date: string
            ) => {

                if (!date) {

                    return "-";

                }

                return new Date(
                    date
                ).toLocaleDateString(
                    "en-GB"
                );

            },

            sorter: (
                a: HackathonInterest,
                b: HackathonInterest
            ) =>
                new Date(
                    a.createdAt || 0
                ).getTime() -
                new Date(
                    b.createdAt || 0
                ).getTime(),
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
                record: HackathonInterest
            ) => (

                <div
                    style={{
                        minWidth:
                            "150px",
                    }}
                >

                    <select
                        className="form-select form-select-sm"
                        value={
                            record.status ||
                            "interested"
                        }
                        disabled={
                            changingStatusId ===
                            record._id
                        }
                        onChange={(
                            event
                        ) =>
                            handleChangeStatus(
                                record._id,
                                event.target.value
                            )
                        }
                    >

                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status === "not interested"
                                    ? "Not Interested"
                                    : status === "link sent"
                                        ? "Link Sent"
                                        : "Interested"}
                            </option>
                        ))}

                    </select>

                </div>

            ),

            sorter: () => 0,
        },

    ];

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setStatusFilter(
            "ALL"
        );

        setSearchText("");

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
                        title="Hackathon Interests"
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
                                        fetchHackathonInterests
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

                                <div className="col-md-3">

                                    <label className="form-label mb-1">

                                        Status

                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            statusFilter
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatusFilter(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Status
                                        </option>

                                        <option value="interested">
                                            Interested
                                        </option>

                                        <option value="link sent">
                                            Link Sent
                                        </option>

                                        <option value="not interested">
                                            Not Interested
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

                {/* =================================================
                    FOOTER
                ================================================= */}

                <Footer />

            </div>

        </>

    );

};

export default HackathonInterests;