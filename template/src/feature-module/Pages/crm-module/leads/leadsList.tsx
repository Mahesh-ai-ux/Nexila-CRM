import { useState,useEffect} from "react";
import Footer from "../../../../components/footer/footer";
import PageHeader from "../../../../components/page-header/pageHeader";
import SearchInput from "../../../../components/dataTable/dataTableSearch";
import { Link } from "react-router";
import Datatable from "../../../../components/dataTable";
// import { LeadsListData } from "../../../../core/json/leadsListData";
import { all_routes } from "../../../../routes/all_routes";
// import ImageWithBasePath from "../../../../components/imageWithBasePath";
import ModalLeads from "./modal/modalLeads";
// import CommonDatePicker from "../../../../components/common-datePicker/commonDatePicker";
import axios from "axios";
// 🔹 Define the type for each lead
import API_URL from "../../../../api/apiconfig";
import dayjs from "dayjs";

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
  createdAt?:string;
  followdate?:string;
  demodate?:string;
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
  // const [filledStars, setFilledStars] = useState<{ [key: string]: boolean }>(
  //   {}
  // );

  // const handleClick = (key: string) => {
  //   setFilledStars((prev) => ({
  //     ...prev,
  //     [key]: !prev[key], // toggle on/off
  //   }));
  // };
  // const data = LeadsListData;

  // const parseLeadsResponse = (resData: any): RawLead[] => {
  //   if (!resData) return [];
  //   if (Array.isArray(resData)) return resData;
  //   if (Array.isArray(resData.leads)) return resData.leads;
  //   // If the backend wrapped data under another key, try common names:
  //   if (Array.isArray(resData.data)) return resData.data;
  //   return [];
  // };

  // const fetchLeads = async () => {
  //   try {
  //     console.log("Fetching leads from backend...");
  //     const res = await axios.get("http://localhost:5000/api/leads");
  //     console.log("Raw response:", res.data);

  //     const leadsArr = parseLeadsResponse(res.data);
  //     if (!Array.isArray(leadsArr)) {
  //       console.error("Unexpected leads response shape:", res.data);
  //       setData([]);
  //       return;
  //     }

  //     const formatted: LeadRow[] = leadsArr.map((lead: RawLead) => {
  //       const id = lead._id || lead.id || String(lead.key || Math.random());
  //       // map fields with fallback to multiple possible names
  //       const name = lead.name || lead.LeadName || lead.fullName || "Unknown";
  //       const phone = lead.phone || lead.Phone || "N/A";
  //       const email = lead.email || "N/A";
  //       const leadstatus =
  //         lead.leadstatus || lead.LeadStatus || lead.status || "N/A";
       

  //       return {
  //         key: id,
  //         _id: id,
  //         name,
  //         phone,
  //         email,
  //         leadstatus,
         
  //       };
  //     });

  //     console.log("Formatted leads:", formatted);
  //     setData(formatted);
  //   } catch (err: any) {
  //     console.error("Error fetching leads:", err?.response?.data || err.message || err);
  //     setData([]);
  //   }
  // };

  // useEffect(() => {
  //   fetchLeads();
  // }, []);

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
        assignfrom: lead.assignFrom ||  lead.assignfrom?.name || "N/A",
        assignto: lead.assignTo ||    lead.assignto?.name || "N/A",
        graduate: lead.graduate || "N/A",
        followdate:lead.followdate,
        demodate:lead.demodate,
        createdAt:lead.createdAt,
        
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

  const handleDeleteClick = (lead: Lead) => {
    setSelectedLead(lead);
    setActionType("delete");
  };


  const columns = [
    // {
    //   title: "",
    //   dataIndex: "Name",
    //   render: (_: any, record: any) => (
    //     <div
    //       className={`set-star rating-select ${
    //         filledStars[record.key] ? "filled" : ""
    //       }`}
    //       onClick={() => handleClick(record.key)}
    //     >
    //       <i className="ti ti-star-filled fs-16" />
    //     </div>
    //   ),
    //   // sorter: (a: any, b: any) => a.Name.length - b.Name.length,
    // },
    {
      title: "Lead Name",
      dataIndex: "name",
      render: (text: string) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          {/* <Link to={all_routes.leadsDetails} className="avatar me-2">
            <ImageWithBasePath
              className="img-fluid rounded-circle"
              src={`assets/img/profiles/${render.LeadImage}`}
              alt="User Image"
            />
          </Link> */}
          <Link to={all_routes.leadsDetails} className="d-flex flex-column">
            {text}
          </Link>
        </h6>
      ),
     sorter: (a: Lead, b: Lead) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Company Name",
    //   dataIndex: "CompanyName",
    //   render: (text: string, render: any) => (
    //     <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
    //       <Link
    //         to={all_routes.companiesDetails}
    //         className="avatar border rounded p-1 me-2 rounded-circle"
    //       >
    //         <ImageWithBasePath
    //           className="w-auto h-auto"
    //           src={`assets/img/icons/${render.CompanyImage}`}
    //           alt="User Image"
    //         />
    //       </Link>
    //       <Link to={all_routes.companyDetails} className="d-flex flex-column">
    //         {text}
    //         <span className="text-body fs-13 mt-1 fw-normal">
    //           {render.Location}
    //         </span>
    //       </Link>
    //     </h6>
    //   ),
    //   sorter: (a: any, b: any) => a.CompanyName.length - b.CompanyName.length,
    // },
  {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: Lead, b: Lead) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: Lead, b: Lead) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: Lead, b: Lead) =>
        (a.category || "").localeCompare(b.category || ""),
    },
    {
      title: "Lead Source",
      dataIndex: "leadsource",
      sorter: (a: Lead, b: Lead) =>
        (a.leadsource || "").localeCompare(b.leadsource || ""),
    },
    {
      title: "College Name",
      dataIndex: "collegename",
      sorter: (a: Lead, b: Lead) =>
        (a.collegename || "").localeCompare(b.collegename || ""),
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
      title: "Assigned From",
      dataIndex: "assignfrom",
      sorter: (a: Lead, b: Lead) =>
        (a.assignfrom || "").localeCompare(b.assignfrom || ""),
    },
    {
      title: "Assigned To",
      dataIndex: "assignto",
      sorter: (a: Lead, b: Lead) =>
        (a.assignto || "").localeCompare(b.assignto || ""),
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
  render: (date: string) =>
    date ? dayjs(date).format("DD-MM-YYYY") : "-",
  sorter: (a: Lead, b: Lead) =>
    (a.followdate || "").localeCompare(b.followdate || "")
},
{
  title: "Demo Date",
  dataIndex: "demodate",
  render: (date: string) =>
    date ? dayjs(date).format("DD-MM-YYYY") : "-",
  sorter: (a: Lead, b: Lead) =>
    (a.demodate || "").localeCompare(b.demodate || "")
},
    //  {
    //   title: "AssignFrom",
    //   dataIndex: "assignfrom",
    //   render: (text: string, record: any) => (
    //     <div className="d-flex align-items-center mb-0">
    //       {text}
    //     </div>
    //   ),
    //   sorter: (a: Lead, b: Lead) =>
    //     (a.assignfrom || "").localeCompare(b.assignfrom || ""),
    // },
    // {
    //   title: "Created Date",
    //   dataIndex: "CreatedDate",
    //  sorter: (a: Lead, b: Lead) =>
    //     (a.createdAt || "").localeCompare(b.createdAt || ""),
    // },

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
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_lead"
              onClick={() => handleDeleteClick(record)}
            >
              <i className="ti ti-trash" /> Delete
            </Link>
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
            showExport={true}
          />
          {/* End Page Header */}
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
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/* <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn btn-outline-light px-2 shadow"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort By
                    </Link>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <Link to="#" className="dropdown-item">
                            Newest
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            Oldest
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                  {/* <div
                    id="reportrange"
                    className="reportrange-picker d-flex align-items-center shadow"
                  >
                    <i className="ti ti-calendar-due text-dark fs-14 me-1" />
                    <span className="reportrange-picker-field">
                      9 Jun 25 - 9 Jun 25
                    </span>
                  </div> */}
                </div>
                {/* <div className="d-flex align-items-center gap-2 flex-wrap">
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
                        <div className="accordion" id="accordionExample">
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                to="#"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="true"
                                aria-controls="collapseTwo"
                              >
                                Lead Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse show"
                              id="collapseTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-2">
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
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-06.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Elizabeth Morgan
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-40.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Katherine Brooks
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-05.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Sophia Lopez
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-10.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      John Michael
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-15.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Natalie Brooks
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-01.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      William Turner
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-13.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Ava Martinez
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-12.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Nathan Reed
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-03.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Lily Anderson
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-18.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Ryan Coleman
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="link-primary text-decoration-underline p-2 d-flex"
                                    >
                                      Load More
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                to="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Company Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-2">
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
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      NovaWave LLC
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      BlueSky Industries
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Silver Hawk
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Summit Peak
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                to="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#status"
                                aria-expanded="false"
                                aria-controls="status"
                              >
                                Lead Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="status"
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
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Not Closed
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Contacted
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Lost
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                to="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#date2"
                                aria-expanded="false"
                                aria-controls="date2"
                              >
                                Created Date
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="date2"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="input-group w-auto input-group-flat">
                                  <div className="input-group w-100 input-group-flat">
                                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="filter-set-content">
                            <div className="filter-set-content-head">
                              <Link
                                to="#"
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#owner"
                                aria-expanded="false"
                                aria-controls="owner"
                              >
                                Lead Owner
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="owner"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <div className="mb-2">
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
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-17.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Robert Johnson
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-16.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Isabella Cooper
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-14.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      John Smith
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-22.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Sophia Parker
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-25.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Emma Reynolds
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-24.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Liam Carter
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-39.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Noah Mitchell
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-31.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Mason Hayes
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-21.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Ron Thompson
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="avatar avatar-xs rounded-circle me-2">
                                        <ImageWithBasePath
                                          src="assets/img/users/user-10.jpg"
                                          className="flex-shrink-0 rounded-circle"
                                          alt="img"
                                        />
                                      </span>
                                      Laura Bennett
                                    </label>
                                  </li>
                                </ul>
                              </div>
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
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="btn bg-soft-indigo px-2 border-0"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-columns-3 me-2" />
                      Manage Columns
                    </Link>
                    <div className="dropdown-menu dropdown-menu-md dropdown-md p-3">
                      <ul>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Lead Name</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Phone</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Email</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Company Name</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Lead Status</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Lead Status</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-2">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Lead Owner</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                        <li className="gap-1 d-flex align-items-center mb-0">
                          <i className="ti ti-columns me-1" />
                          <div className="form-check form-switch w-100 ps-0">
                            <label className="form-check-label d-flex align-items-center gap-2 w-100">
                              <span>Action</span>
                              <input
                                className="form-check-input switchCheckDefault ms-auto"
                                type="checkbox"
                                role="switch"
                                defaultChecked
                              />
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                  {/* <div className="d-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                    <Link
                      to={all_routes.leadsList}
                      className="btn btn-sm p-1 border-0 fs-14 active"
                    >
                      <i className="ti ti-list-tree" />
                    </Link>
                    <Link
                      to={all_routes.leadsKanban}
                      className="flex-shrink-0 btn btn-sm p-1 border-0 ms-1 fs-14"
                    >
                      <i className="ti ti-grid-dots" />
                    </Link>
                  </div> 
                </div>*/}
              </div>
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
