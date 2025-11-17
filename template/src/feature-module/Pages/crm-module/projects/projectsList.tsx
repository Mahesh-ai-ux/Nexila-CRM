import { Link } from "react-router";
import Footer from "../../../../components/footer/footer";
import PageHeader from "../../../../components/page-header/pageHeader";
import SearchInput from "../../../../components/dataTable/dataTableSearch";
import { useState,useEffect } from "react";
// import PredefinedDatePicker from "../../../../components/common-dateRangePicker/PredefinedDatePicker";
// import { ProjectListData } from "../../../../core/json/projectsListData";
import { all_routes } from "../../../../routes/all_routes";
// import ImageWithBasePath from "../../../../components/imageWithBasePath";
import Datatable from "../../../../components/dataTable";
import ModalProject from "./modal/modalProject";
// import CommonDatePicker from "../../../../components/common-datePicker/commonDatePicker";
import axios from "axios";
import API_URL from "../../../../api/apiconfig";
import dayjs from "dayjs";
interface Student {
  _id: string;
  name: string;
  domain: string;
  phone: string;
  category: string;
  leadsource: string;
  location: string;
  assignfrom: string;
  assignto: string;
  leadstatus: string;
  date?: string;
  time?: string;
  followdate?:string;
  demodate?:string;
  createdAt?: string;
}

const ProjectsList = () => {
  const [searchText, setSearchText] = useState<string>("");

  const [data, setData] = useState<Student[]>([]);

const fetchLeads = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("🚫 No token found in localStorage");
      return;
    }

    const res = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ FIXED: Detect correct array field
    const studentsData = Array.isArray(res.data)
      ? res.data
      : res.data.students || [];

    const formatted = studentsData.map((student: any) => ({
      key: student._id,
      _id: student._id,
      name: student.name || "N/A",
      phone: student.phone || "N/A",
      leadstatus: student.leadstatus || "Pending",
      leadsource: student.leadSource || student.leadsource || "N/A",
      category: student.category || "N/A",
      location: student.location || "N/A",
      domain: student.domain || "N/A",
      assignfrom: student.assignfrom?.name || "N/A",
      assignto: student.assignto?.name || "N/A",
      followdate:student.followdate,
      demodate:student.demodate,
      createdAt: student.createdAt,
    }));

    setData(formatted);
    console.log("✅ students loaded:", formatted);
  } catch (error: any) {
    console.error("❌ Error fetching students:", error.message);
  }
};

useEffect(() => {
  fetchLeads();
}, []);

const totalStudents = data.length;

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
  // const data = ProjectListData;
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
    //   sorter: (a: any, b: any) => a.Name.length - b.Name.length,
    // },
    {
      title: "Students Name",
            dataIndex: "name",
            render: (text: string) => (
              <Link to={all_routes.dealsDetails} className="title-name">
                {text}
              </Link>
            ),
            sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Client",
    //   dataIndex: "Client",
    //   render: (text: string, render: any) => (
    //     <h6 className="d-flex align-items-center fs-14 fw-medium">
    //       <Link
    //         to={all_routes.companiesDetails}
    //         className="avatar avatar-sm border rounded-circle me-2"
    //       >
    //         <ImageWithBasePath
    //           className="w-auto h-auto"
    //           src={`assets/img/company/${render.ClientImage}`}
    //           alt="User Image"
    //         />
    //       </Link>
    //       <Link to={all_routes.companyDetails}>{text}</Link>
    //     </h6>
    //   ),
    //   sorter: (a: any, b: any) => a.Client.length - b.Client.length,
    // },
    // {
    //   title: "Priority",
    //   dataIndex: "Priority",
    //   render: (text: any) => (
    //     <span
    //       className={`priority badge badge-tag ${
    //         text === "High"
    //           ? "badge-soft-danger"
    //           : text === "Medium"
    //           ? "badge-soft-warning"
    //           : "badge-soft-success"
    //       }`}
    //     >
    //       <i className="ti ti-square-rounded-filled me-1"></i>
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a: any, b: any) => a.Priority.length - b.Priority.length,
    // },
    // {
    //   title: "Start Date",
    //   dataIndex: "StartDate",
    //   sorter: (a: any, b: any) => a.StartDate.length - b.StartDate.length,
    // },
    // {
    //   title: "End Date",
    //   dataIndex: "EndDate",
    //   sorter: (a: any, b: any) => a.EndDate.length - b.EndDate.length,
    // },
    // {
    //   title: "Pipeline Stage",
    //   dataIndex: "PipelineStage",
    //   render: (text: string) => (
    //     <div className="pipeline-progress d-flex align-items-center">
    //       <div className="progress">
    //         <div
    //           className={`progress-bar  ${
    //             text === "Plan"
    //               ? "progress-bar-violet"
    //               : text === "Develop"
    //               ? "progress-bar-info"
    //               : text === "Design"
    //               ? "progress-bar-warning"
    //               : "progress-bar-success"
    //           }`}
    //           role="progressbar"
    //         />
    //       </div>
    //       <span>{text}</span>
    //     </div>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     a.PipelineStage.length - b.PipelineStage.length,
    // },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   render: (text: any) => (
    //     <span
    //       className={`badge badge-pill badge-status  ${
    //         text === "Active" ? "bg-success" : "bg-danger"
    //       } `}
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    // },

    // {
    //   title: "Action",
    //   dataIndex: "Action",
    //   render: () => (
    //     <div className="dropdown table-action">
    //       <Link
    //         to="#"
    //         className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
    //         data-bs-toggle="dropdown"
    //         aria-expanded="false"
    //       >
    //         <i className="ti ti-dots-vertical" />
    //       </Link>
    //       <div className="dropdown-menu dropdown-menu-right">
    //         <Link
    //           className="dropdown-item "
    //           data-bs-toggle="offcanvas"
    //           data-bs-target="#offcanvas_edit"
    //           to="#"
    //         >
    //           <i className="ti ti-edit text-blue" /> Edit
    //         </Link>
    //         <Link
    //           className="dropdown-item"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#delete_project"
    //         >
    //           <i className="ti ti-trash" /> Delete
    //         </Link>
    //         <Link className="dropdown-item" to="#">
    //           <i className="ti ti-clipboard-copy text-green" /> Clone this
    //           Project
    //         </Link>
    //         <Link className="dropdown-item" to="#">
    //           <i className="ti ti-printer" /> Print
    //         </Link>
    //         <Link className="dropdown-item" to="#">
    //           <i className="ti ti-subtask" /> Add New Task
    //         </Link>
    //       </div>
    //     </div>
    //   ),
    //   sorter: (a: any, b: any) => a.Action.length - b.Action.length,
    // },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: Student, b: Student) => a.phone.localeCompare(b.phone),
    },
   
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: Student, b: Student) =>
        (a.category || "").localeCompare(b.category || ""),
    },
    {
      title: "Lead Source",
      dataIndex: "leadsource",
      sorter: (a: Student, b: Student) =>
        (a.leadsource || "").localeCompare(b.leadsource || ""),
    },
    {
      title: "Domain",
      dataIndex: "domain",
      sorter: (a: Student, b: Student) =>
        (a.domain || "").localeCompare(b.domain || ""),
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a: Student, b: Student) =>
        (a.location || "").localeCompare(b.location || ""),
    },
    {
      title: "Assigned From",
      dataIndex: "assignfrom",
      sorter: (a: Student, b: Student) =>
        (a.assignfrom || "").localeCompare(b.assignfrom || ""),
    },
    {
      title: "Assigned To",
      dataIndex: "assignto",
      sorter: (a: Student, b: Student) =>
        (a.assignto || "").localeCompare(b.assignto || ""),
    },
     {
      title: "Follow-UP Date",
      dataIndex: "followdate",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "-",
      sorter: (a: Student, b: Student) =>
        (a.followdate || "").localeCompare(b.followdate || "")
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
      sorter: (a: Student, b: Student) =>
        (a.leadstatus || "").localeCompare(b.leadstatus || ""),
    },
      {
          title: "Demo Date",
          dataIndex: "demodate",
          render: (date: string) =>
            date ? dayjs(date).format("DD-MM-YYYY") : "-",
          sorter: (a: Student, b: Student) =>
            (a.demodate || "").localeCompare(b.demodate || "")
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
            title="Students"
            badgeCount={totalStudents}
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
              {/* <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas_add"
              >
                <i className="ti ti-square-rounded-plus-filled me-1" />
                Add New Project
              </Link> */}
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
                  </div>
                  {/* <PredefinedDatePicker/> */}
                </div>
                 <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/*<div className="dropdown">
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
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Project Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Turelysell
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Dreamschat
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Servbook
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      DreamsPOS
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Kofejob
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Doccure
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Best@laundry
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Dreamsports
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      SmartHR
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Dreamsports
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
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
                                data-bs-target="#owner"
                                aria-expanded="false"
                                aria-controls="owner"
                              >
                                Client Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="owner"
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
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      NovaWave LLC
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      BlueSky Industries
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Silver Hawk
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Summit Peak
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      RiverStone Ltd
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Bright Bridge Grp
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      CoastalStar Co.
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      HarborView
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Golden Gate Ltd
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Redwood Inc
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
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
                                data-bs-target="#type"
                                aria-expanded="false"
                                aria-controls="type"
                              >
                                Type
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="type"
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
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Web App
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Client Meeting
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Mobile App
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      UI/UX Design
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Product Lanuch
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Bug Fixing
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Content creation
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Sales Demo
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      QA Testing
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Customer Support
                                    </label>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="link-primary text-decoration-underline p-2 pt-0 d-flex"
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
                                data-bs-target="#date"
                                aria-expanded="false"
                                aria-controls="date"
                              >
                                Start Date
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="date"
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
                                data-bs-target="#date2"
                                aria-expanded="false"
                                aria-controls="date2"
                              >
                                End Date
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
                                data-bs-target="#Status"
                                aria-expanded="false"
                                aria-controls="Status"
                              >
                                Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Active
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Inactive
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
                                data-bs-target="#stage"
                                aria-expanded="false"
                                aria-controls="stage"
                              >
                                Pipeline Stage
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="stage"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list bg-light rounded border p-2 shadow mt-2">
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Develop
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Meeting
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Design
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Launch
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Fix
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Write
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Demo
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Test
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Support
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
                              <span>Name</span>
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
                              <span>Client</span>
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
                              <span>Priority</span>
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
                              <span>Start Date</span>
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
                              <span>End Date</span>
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
                              <span>Type</span>
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
                              <span>Pipeline Stage</span>
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
                              <span>Status</span>
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
                  </div>
                  <div className="d-flex align-items-center shadow p-1 rounded border view-icons bg-white">
                    <Link
                      to={all_routes.projectsList}
                      className="btn btn-sm p-1 border-0 fs-14 active"
                    >
                      <i className="ti ti-list-tree" />
                    </Link>
                    <Link
                      to={all_routes.projectsGrid}
                      className="flex-shrink-0 btn btn-sm p-1 border-0 ms-1 fs-14"
                    >
                      <i className="ti ti-grid-dots" />
                    </Link>
                  </div> */}
                </div>
              </div>
              {/* table header */}
              {/* Projects List */}
              <div className=" custom-table table-nowrap">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={true}
                  searchText={searchText}
                />
              </div>
              {/* /Projects List */}
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
        <ModalProject/>
    </>
  );
};

export default ProjectsList;
