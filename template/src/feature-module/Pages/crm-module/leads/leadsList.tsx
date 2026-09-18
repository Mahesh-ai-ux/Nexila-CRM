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
  nexilaID?: string;
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
  // nexila changes - filter states
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string[]>([]);
  const [selectedProgramType, setSelectedProgramType] = useState<string[]>([]);
  const [selectedCreatedDate, setSelectedCreatedDate] = useState<string>("");
  // nexila changes - users state
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEnquirySource, setSelectedEnquirySource] = useState<string[]>(
    [],
  );
  const [selectedLeadOwner, setSelectedLeadOwner] = useState<string[]>([]);
  // const [filledStars, setFilledStars] = useState<Record<string, boolean>>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // nexila changes - Lead Status Filter
  const handleLeadStatusFilter = (status: string) => {
    setSelectedLeadStatus((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );
  };

  // nexila changes - Program Type Filter
  const handleProgramTypeFilter = (program: string) => {
    setSelectedProgramType((prev) =>
      prev.includes(program)
        ? prev.filter((item) => item !== program)
        : [...prev, program],
    );
  };

  // nexila changes - Created Date Filter
  const handleCreatedDateFilter = (date: string) => {
    setSelectedCreatedDate(date);
  };

  // nexila changes - Lead Owner Filter
  const handleLeadOwnerFilter = (owner: string) => {
    setSelectedLeadOwner((prev) =>
      prev.includes(owner)
        ? prev.filter((item) => item !== owner)
        : [...prev, owner],
    );
  };
  const handleEnquirySourceFilter = (source: string) => {
    setSelectedEnquirySource((prev) =>
      prev.includes(source)
        ? prev.filter((item) => item !== source)
        : [...prev, source],
    );
  };
  // nexila changes - Reset Filters
  const handleResetFilters = () => {
    setSelectedLeadStatus([]);
    setSelectedProgramType([]);
    setSelectedCreatedDate("");
    setSelectedLeadOwner([]);
    setSelectedEnquirySource([]);
  };

  // nexila changes - fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/users/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usersData = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];

      setUsers(usersData);
    } catch (error: any) {
      console.error("❌ Error fetching users:", error.message);
    }
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
        nexilaID: lead.nexilaID || "NT",
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
    fetchUsers();
  }, []);
  // nexila changes - filtered data
  const filteredData = data.filter((lead) => {
    const ownerMatch =
      selectedLeadOwner.length === 0 ||
      selectedLeadOwner.includes(lead.assignto || lead.assignfrom || "");
    // Lead Status Filter
    const statusMatch =
      selectedLeadStatus.length === 0 ||
      selectedLeadStatus.includes(lead.leadstatus || "");

    const enquirySourceMatch =
      selectedEnquirySource.length === 0 ||
      selectedEnquirySource.includes(lead.leadsource || "");
    // Program Type Filter
    const programMatch =
      selectedProgramType.length === 0 ||
      selectedProgramType.includes(lead.lookingfor || "");

    // Created Date Filter
    let createdDateMatch = true;

    if (selectedCreatedDate) {
      createdDateMatch =
        dayjs(lead.createdAt).format("YYYY-MM-DD") === selectedCreatedDate;
    }

    return (
      statusMatch &&
      programMatch &&
      createdDateMatch &&
      ownerMatch &&
      enquirySourceMatch
    );
  });
  // const totalLeads = data.length;
  const totalLeads = filteredData.length;
  // ✅ Edit lead handler
  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setActionType("edit");
  };

  const columns = [
    {
      title: "Nexila ID",
      dataIndex: "nexilaID",
      key: "nexilaID",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link
            to={`${all_routes.leadsDetails}/${record._id}`} // ✅ FIX
            className="d-flex flex-column"
          >
            {text || "-"}
          </Link>
        </h6>

      ),
      sorter: (a: Lead, b: Lead) =>
        (a.nexilaID || "").localeCompare(b.nexilaID || ""),
    },
    {
      title: "Lead Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link
            to={`${all_routes.leadsDetails}/${record._id}`} // ✅ FIX
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
                          {[
                            "Pending",
                            "New Lead",
                            "Demo Scheduled",
                            "Follow-Up 1",
                            "Follow-Up 2",
                            "Student",
                          ].map((status) => (
                            <li key={status}>
                              <label className="dropdown-item px-2 d-flex align-items-center">
                                <input
                                  className="form-check-input m-0 me-1"
                                  type="checkbox"
                                  checked={selectedLeadStatus.includes(status)}
                                  onChange={() =>
                                    handleLeadStatusFilter(status)
                                  }
                                />
                                {status}
                              </label>
                            </li>
                          ))}
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
                          {users.map((user) => (
                            <li key={user._id}>
                              <label className="dropdown-item px-2 d-flex align-items-center">
                                <input
                                  className="form-check-input m-0 me-1"
                                  type="checkbox"
                                  checked={selectedLeadOwner.includes(
                                    user.name,
                                  )}
                                  onChange={() =>
                                    handleLeadOwnerFilter(user.name)
                                  }
                                />
                                {user.name}
                              </label>
                            </li>
                          ))}
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
                        <ul className="mb-2">
                          {/* Today Date */}
                          {/* Today Date */}
                          <li className="mb-2">
                            <label className="dropdown-item px-2 d-flex align-items-center">
                              <input
                                className="form-check-input m-0 me-2"
                                type="checkbox"
                                checked={
                                  selectedCreatedDate ===
                                  dayjs().format("YYYY-MM-DD")
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleCreatedDateFilter(
                                      dayjs().format("YYYY-MM-DD"),
                                    );
                                  } else {
                                    handleCreatedDateFilter("");
                                  }
                                }}
                              />
                              Today - {dayjs().format("DD-MM-YYYY")}
                            </label>
                          </li>

                          {/* Calendar Input */}
                          <li>
                            <input
                              type="date"
                              className="form-control form-control-md"
                              value={selectedCreatedDate}
                              onChange={(e) =>
                                handleCreatedDateFilter(e.target.value)
                              }
                            />
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
                          {[
                            "Course",
                            "Internship",
                            "Project Guidance",
                            "Project with Internship",
                          ].map((program) => (
                            <li key={program}>
                              <label className="dropdown-item px-2 d-flex align-items-center">
                                <input
                                  className="form-check-input m-0 me-1"
                                  type="checkbox"
                                  checked={selectedProgramType.includes(
                                    program,
                                  )}
                                  onChange={() =>
                                    handleProgramTypeFilter(program)
                                  }
                                />
                                {program}
                              </label>
                            </li>
                          ))}
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
                          {[
                            "Google",
                            "Instagram",
                            "Reference",
                            "Direct Walk-In",
                            "Others",
                          ].map((source) => (
                            <li key={source}>
                              <label className="dropdown-item px-2 d-flex align-items-center">
                                <input
                                  className="form-check-input m-0 me-1"
                                  type="checkbox"
                                  checked={selectedEnquirySource.includes(
                                    source,
                                  )}
                                  onChange={() =>
                                    handleEnquirySourceFilter(source)
                                  }
                                />
                                {source}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-light w-100"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </button>
                    <button type="button" className="btn btn-primary w-100">
                      Filter
                    </button>
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
                  dataSource={filteredData}
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