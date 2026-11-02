import { useState, useEffect } from "react";
import Footer from "../../../../components/footer/footer";
import PageHeader from "../../../../components/page-header/pageHeader";
import SearchInput from "../../../../components/dataTable/dataTableSearch";
import { Link } from "react-router";
import Datatable from "../../../../components/dataTable";
// import { LeadsListData } from "../../../../core/json/leadsListData";
import { all_routes } from "../../../../routes/all_routes";
import ModalLeads from "./modal/modalLeads";
import axios from "axios";
// 🔹 Define the type for each lead
import API_URL from "../../../../api/apiconfig";
import dayjs from "dayjs";
// import { Lookingfor } from "../../../../core/json/selectOption";

interface Lead {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    leadstatus?: string;
    leadsource?: string;
    collegename?: string;
    category?: string;
    location?: string;
    domain?: string;
    assignfrom?: string;
    assignto?: string;
    graduate?: string;
    createdAt?: string;
    followdate?: string;
    demodate?: string;
    lookingfor?: string;
    domainreason?: string;
    remark?: string;
    dropreason?: string;
    internshipduration?: string;
    dateofjoin?: string;
    fees?: string;
    feetype?: string;
    feepaid?: string;
    pendingfee?: string;
    noofday?: string;
}

const LeadsList = () => {
    const [data, setData] = useState<Lead[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    // const [filledStars, setFilledStars] = useState<Record<string, boolean>>({});
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // ✅ Fetch Leads from backend
    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("🚫 No token found in localStorage");
                return;
            }

            const res = await axios.get(`${API_URL}/leads`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const leadsData = Array.isArray(res.data)
                ? res.data
                : res.data.leads || [];

            const formatted = leadsData.map((lead: any) => ({
                key: lead._id,
                _id: lead._id,
                name: lead.name || "N/A",
                phone: lead.phone || "N/A",
                email: lead.email || "N/A",
                leadstatus: lead.leadStatus || lead.leadstatus || "Pending",
                leadsource: lead.leadSource || lead.leadsource || "N/A",
                collegename: lead.collegeName || lead.collegename || "N/A",
                category: lead.category || "N/A",
                location: lead.location || "N/A",
                domain: lead.domain || "N/A",
                assignfrom: lead.assignfrom?.name,
                assignto: lead.assignto?.name,
                graduate: lead.graduate || "N/A",
                followdate: lead.followdate,
                demodate: lead.demodate,
                lookingfor: lead.lookingfor || "N/A",
                remark: lead.remark || "New Lead Added",
                domainreason: lead.domainreason || "N/A",
                dropreason: lead.dropreason || "N/A",
                internshipduration: lead.internshipduration || "N/A",
                dateofjoin: lead.dateofjoin,
                fees: lead.fees,
                feetype: lead.feetype,
                feepaid: lead.feepaid,
                pendingfee: lead.pendingfee,
                noofday: lead.noofday,
                createdAt: lead.createdAt,
            }));

            setData(formatted);
            console.log("✅ Leads loaded:", formatted);
        } catch (error: any) {
            console.error("❌ Error fetching leads:", error.message);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const totalLeads = data.length;

    // ✅ Edit lead handler
    const handleEditClick = (lead: Lead) => {
        setSelectedLead(lead);
        setActionType("edit");
    };

    const columns = [
        {
            title: "Lead Name",
            dataIndex: "name",
            render: (text: string, record: any) => (
                <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
                    <Link
                        to={`${all_routes.leadsDetails}/${record._id}`}   // ✅ FIX
                        className="d-flex flex-column"
                    >
                        {text}
                    </Link>
                </h6>
            ),
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        }, //nexila changes

        {
            title: "Phone",
            dataIndex: "phone",
            sorter: (a: Lead, b: Lead) => a.phone.localeCompare(b.phone),
        },

        {
            title: "Program Looking For",
            dataIndex: "lookingfor",
            sorter: (a: Lead, b: Lead) =>
                (a.lookingfor || "").localeCompare(b.lookingfor || ""),
        },
        {
            title: "Lead Source",
            dataIndex: "leadsource",
            sorter: (a: Lead, b: Lead) =>
                (a.leadsource || "").localeCompare(b.leadsource || ""),
        },

        {
            title: "Graduate",
            dataIndex: "graduate",
            sorter: (a: Lead, b: Lead) =>
                (a.graduate || "").localeCompare(b.graduate || ""),
        },
        {
            title: "Domain",
            dataIndex: "domain",
            sorter: (a: Lead, b: Lead) =>
                (a.domain || "").localeCompare(b.domain || ""),
        },
        {
            title: "Location",
            dataIndex: "location",
            sorter: (a: Lead, b: Lead) =>
                (a.location || "").localeCompare(b.location || ""),
        },

        {
            title: "Lead Status",
            dataIndex: "leadstatus",
            render: (text: string) => (
                <span
                // className={`badge badge-pill badge-status ${
                //   text === "Demo Sheduled"
                //     ? "bg-success"
                //     : text === "New Lead"
                //     ? "bg-warning"
                //     : text === "Not Contacted"
                //     ? "bg-info"
                //     : "bg-danger"
                // }`}
                >
                    {text}
                </span>
            ),
            sorter: (a: Lead, b: Lead) =>
                (a.leadstatus || "").localeCompare(b.leadstatus || ""),
        },
        {
            title: "Follow-UP Date",
            dataIndex: "followdate",
            render: (date: string) => (date ? dayjs(date).format("DD-MM-YYYY") : "-"),
            sorter: (a: Lead, b: Lead) =>
                (a.followdate || "").localeCompare(b.followdate || ""),
        },
        {
            title: "Created On",
            dataIndex: "createdAt",
            render: (date: string) => (date ? dayjs(date).format("DD-MM-YYYY") : "-"),
            sorter: (a: Lead, b: Lead) =>
                (a.createdAt || "").localeCompare(b.createdAt || ""),
        },

        {
            title: "Action",
            dataIndex: "Action",
            render: (_: any, record: Lead) => (
                <div className="dropdown table-action">
                    <Link
                        to="#"
                        className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="ti ti-dots-vertical" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link
                            className="dropdown-item"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_edit"
                            to="#"
                            onClick={() => handleEditClick(record)}
                        >
                            <i className="ti ti-edit text-blue" /> Edit
                        </Link>
                        {/* <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_lead"
              onClick={() => handleDeleteClick(record)}
            >
              <i className="ti ti-trash" /> Delete
            </Link>*/}
                        {/* <Link className="dropdown-item" to="#">
              <i className="ti ti-clipboard-copy text-blue-light" /> Clone
            </Link> */}
                    </div>
                </div>
            ),
            sorter: (a: any, b: any) => a.Action.length - b.Action.length,
        },
    ];
    return (
        <>
            {/* ========================
			Start Page Content
		========================= */}
            <div className="page-wrapper">
                {/* Start Content */}
                <div className="content pb-0">
                    {/* Page Header */}
                    <PageHeader
                        title="Leads"
                        badgeCount={totalLeads}
                        showModuleTile={false}
                    // showExport={true} //nexila changes
                    >
















                        <div className="dropdown">
                            <Link
                                to="#"
                                className="btn btn-outline-light shadow px-2"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                            >
                                <i className="ti ti-filter me-2" />
                                Filter
                                <i className="ti ti-chevron-down ms-2" />
                            </Link>
                            <div className="filter-dropdown-menu dropdown-menu dropdown-menu-lg p-0">
                                <div className="filter-header d-flex align-items-center justify-content-between border-bottom">
                                    <h6 className="mb-0">
                                        <i className="ti ti-filter me-1" />
                                        Filter
                                    </h6>
                                    <button
                                        type="button"
                                        className="btn-close close-filter-btn"
                                        data-bs-dismiss="dropdown-menu"
                                        aria-label="Close"
                                    />
                                </div>


















                                <div className="filter-set-view p-3">


                                    {/* dropdown Nexila Changes */}
                                    {/* Lead Status */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <Link
                                                to="#"
                                                className="collapsed"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#leadStatus"
                                                aria-expanded="false"
                                                aria-controls="leadStatus"
                                            >
                                                Lead Status
                                            </Link>
                                        </div>

                                        <div
                                            className="filter-set-contents accordion-collapse collapse"
                                            id="leadStatus"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                                <div className="mb-1">
                                                    <div className="input-icon-start input-icon position-relative">
                                                        <span className="input-icon-addon fs-12">
                                                            <i className="ti ti-search" />
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="form-control form-control-md"
                                                            placeholder="Search"
                                                        />
                                                    </div>
                                                </div>

                                                <ul className="mb-0">
                                                    <li>
                                                        <label className="dropdown-item px-2 d-flex align-items-center">
                                                            <input
                                                                className="form-check-input m-0 me-1"
                                                                type="checkbox"
                                                            />
                                                            Closed
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead Owner */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <Link
                                                to="#"
                                                className="collapsed"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#leadOwner"
                                                aria-expanded="false"
                                                aria-controls="leadOwner"
                                            >
                                                Lead Owner
                                            </Link>
                                        </div>

                                        <div
                                            className="filter-set-contents accordion-collapse collapse"
                                            id="leadOwner"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                                <div className="mb-1">
                                                    <div className="input-icon-start input-icon position-relative">
                                                        <span className="input-icon-addon fs-12">
                                                            <i className="ti ti-search" />
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="form-control form-control-md"
                                                            placeholder="Search"
                                                        />
                                                    </div>
                                                </div>

                                                <ul className="mb-0">
                                                    <li>
                                                        <label className="dropdown-item px-2 d-flex align-items-center">
                                                            <input
                                                                className="form-check-input m-0 me-1"
                                                                type="checkbox"
                                                            />
                                                            Isabella Cooper
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Created On */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <Link
                                                to="#"
                                                className="collapsed"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#createdOn"
                                                aria-expanded="false"
                                                aria-controls="createdOn"
                                            >
                                                Created On
                                            </Link>
                                        </div>

                                        <div
                                            className="filter-set-contents accordion-collapse collapse"
                                            id="createdOn"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                                <div className="mb-1">
                                                    <div className="input-icon-start input-icon position-relative">
                                                        <span className="input-icon-addon fs-12">
                                                            <i className="ti ti-search" />
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="form-control form-control-md"
                                                            placeholder="Search"
                                                        />
                                                    </div>
                                                </div>

                                                <ul className="mb-0">
                                                    <li>
                                                        <label className="dropdown-item px-2 d-flex align-items-center">
                                                            <input
                                                                className="form-check-input m-0 me-1"
                                                                type="checkbox"
                                                            />
                                                            Today
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Program Type */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <Link
                                                to="#"
                                                className="collapsed"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#programType"
                                                aria-expanded="false"
                                                aria-controls="programType"
                                            >
                                                Program Type
                                            </Link>
                                        </div>

                                        <div
                                            className="filter-set-contents accordion-collapse collapse"
                                            id="programType"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                                <div className="mb-1">
                                                    <div className="input-icon-start input-icon position-relative">
                                                        <span className="input-icon-addon fs-12">
                                                            <i className="ti ti-search" />
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="form-control form-control-md"
                                                            placeholder="Search"
                                                        />
                                                    </div>
                                                </div>

                                                <ul className="mb-0">
                                                    <li>
                                                        <label className="dropdown-item px-2 d-flex align-items-center">
                                                            <input
                                                                className="form-check-input m-0 me-1"
                                                                type="checkbox"
                                                            />
                                                            Full Stack Development
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enquiry Source */}
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <Link
                                                to="#"
                                                className="collapsed"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#enquirySource"
                                                aria-expanded="false"
                                                aria-controls="enquirySource"
                                            >
                                                Enquiry Source
                                            </Link>
                                        </div>

                                        <div
                                            className="filter-set-contents accordion-collapse collapse"
                                            id="enquirySource"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                                <div className="mb-1">
                                                    <div className="input-icon-start input-icon position-relative">
                                                        <span className="input-icon-addon fs-12">
                                                            <i className="ti ti-search" />
                                                        </span>

                                                        <input
                                                            type="text"
                                                            className="form-control form-control-md"
                                                            placeholder="Search"
                                                        />
                                                    </div>
                                                </div>

                                                <ul className="mb-0">
                                                    <li>
                                                        <label className="dropdown-item px-2 d-flex align-items-center">
                                                            <input
                                                                className="form-check-input m-0 me-1"
                                                                type="checkbox"
                                                            />
                                                            Website
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>






                                    <div className="d-flex align-items-center gap-2">
                                        <Link to="#" className="btn btn-outline-light w-100">
                                            Reset
                                        </Link>
                                        <Link to="" className="btn btn-primary w-100">
                                            Filter
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>















































































                    </PageHeader>



                    {/* card start */}
                    <div className="card border-0 rounded-0">
                        <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
                            <div className="input-icon input-icon-start position-relative">
                                <span className="input-icon-addon text-dark">
                                    <i className="ti ti-search" />
                                </span>
                                <SearchInput value={searchText} onChange={handleSearch} />
                            </div>
                            <Link
                                to="#"
                                className="btn btn-primary"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvas_add"
                            >
                                <i className="ti ti-square-rounded-plus-filled me-1" />
                                Add Lead
                            </Link>
                        </div>
                        <div className="card-body">







                            {/* nexila changes */}






                            {/* table header */}
                            {/* leads List */}
                            <div className=" table-nowrap custom-table">
                                <Datatable
                                    columns={columns}
                                    dataSource={data}
                                    Selection={true}
                                    searchText={searchText}
                                />
                            </div>
                            {/* ✅ Import shared ModalLeads */}

                            {/* /leads List */}
                        </div>
                    </div>
                    {/* card end */}
                </div>
                {/* End Content */}
                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
            {/* ========================
			End Page Content
		========================= */}
            <ModalLeads
                selectedLead={selectedLead}
                actionType={actionType}
                onUpdate={fetchLeads}
            />
        </>
    );
};

export default LeadsList;