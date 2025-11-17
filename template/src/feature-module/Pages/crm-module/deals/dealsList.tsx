import { Link } from "react-router";
import Footer from "../../../../components/footer/footer";
import PageHeader from "../../../../components/page-header/pageHeader";
import SearchInput from "../../../../components/dataTable/dataTableSearch";
import { useState,useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";

import Datatable from "../../../../components/dataTable";
import ModalDeals from "./modal/modalDeals";
import axios from "axios";
import API_URL from "../../../../api/apiconfig";
import dayjs from "dayjs";

interface Deal {
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

const DealsList = () => {
// const [filledStars, setFilledStars] = useState<{ [key: string]: boolean }>({});

 const [data, setData] = useState<Deal[]>([]);

const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

    if (!token) {
      console.error("🚫 No token found in localStorage");
      return;
    }

   const res = await axios.get(`${API_URL}/deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      
      const dealsData = Array.isArray(res.data)
        ? res.data
        : res.data.deals || [];

      const formatted = dealsData.map((deal: any) => ({
        key: deal._id,
        _id: deal._id,
        name: deal.name || "N/A",
        phone: deal.phone || "N/A",
        leadstatus:  deal.leadstatus || "Pending",
        leadsource: deal.leadsource || "N/A",
        category: deal.category || "N/A",
        location: deal.location || "N/A",
        domain: deal.domain || "N/A",
        assignfrom: deal.assignfrom?.name || "N/A",
        assignto: deal.assignto?.name || "N/A",
        followdate:deal.followdate,
        demodate:deal.demodate,
        createdAt:deal.createdAt,
        
      }));

      setData(formatted);
      console.log("✅ Deals loaded:", formatted);
    } catch (error: any) {
      console.error("❌ Error fetching leads:", error.message);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

const totalDeals = data.length;
// const handleClick = (key: string) => {
//   setFilledStars((prev) => ({
//     ...prev,
//     [key]: !prev[key], // toggle on/off
//   }));
// };
  // const data = DealsListData;
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
      title: "Demo Name",
      dataIndex: "name",
      render: (text: string) => (
        <Link to={all_routes.dealsDetails} className="title-name">
          {text}
        </Link>
      ),
      sorter: (a: Deal, b: Deal) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Stage",
    //   dataIndex: "Stage",
    //   sorter: (a: any, b: any) => a.Stage.length - b.Stage.length,
    // },
    // {
    //   title: "Deal Value",
    //   dataIndex: "DealValue",
    //   sorter: (a: any, b: any) => a.DealValue.length - b.DealValue.length,
    // },
    // {
    //   title: "Tags",
    //   dataIndex: "Tags",
    //   render: (text: any) => (
    //     <span
    //       className={`badge badge-tag ${
    //         text === "Collab"
    //           ? "badge-soft-success"
    //           : text === "Rated"
    //           ? "badge-soft-warning"
    //           : text === "Promotion"
    //           ? "badge-soft-info"
    //           : "badge-soft-danger"
    //       } `}
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a: any, b: any) => a.Tags.length - b.Tags.length,
    // },
    // {
    //   title: "Expected Close Date",
    //   dataIndex: "ExpectedCloseDate",
    //   sorter: (a: any, b: any) =>
    //     a.ExpectedCloseDate.length - b.ExpectedCloseDate.length,
    // },
    // {
    //   title: "Probability",
    //   dataIndex: "Probability",
    //   sorter: (a: any, b: any) => a.Probability.length - b.Probability.length,
    // },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   render: (text: any) => (
    //     <span
    //       className={`badge badge-pill badge-status ${
    //         text === "Won"
    //           ? "bg-success"
    //           : text === "Open"
    //           ? "bg-purple"
    //           : "bg-danger"
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
    //         <Link className="dropdown-item" to="#">
    //           <i className="ti ti-bounce-right" /> Add Activity
    //         </Link>
    //         <Link
    //           className="dropdown-item"
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
    //           data-bs-target="#delete_deal"
    //         >
    //           <i className="ti ti-trash" /> Delete
    //         </Link>
    //         <Link className="dropdown-item" to={all_routes.dealsDetails}>
    //           <i className="ti ti-eye text-blue-light" /> Preview
    //         </Link>
    //       </div>
    //     </div>
    //   ),
    //   sorter: (a: any, b: any) => a.Action.length - b.Action.length,
    // },
     {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: Deal, b: Deal) => a.phone.localeCompare(b.phone),
    },
   
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: Deal, b: Deal) =>
        (a.category || "").localeCompare(b.category || ""),
    },
    {
      title: "Lead Source",
      dataIndex: "leadsource",
      sorter: (a: Deal, b: Deal) =>
        (a.leadsource || "").localeCompare(b.leadsource || ""),
    },
    {
      title: "Domain",
      dataIndex: "domain",
      sorter: (a: Deal, b: Deal) =>
        (a.domain || "").localeCompare(b.domain || ""),
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a: Deal, b: Deal) =>
        (a.location || "").localeCompare(b.location || ""),
    },
    {
      title: "Assigned From",
      dataIndex: "assignfrom",
      sorter: (a: Deal, b: Deal) =>
        (a.assignfrom || "").localeCompare(b.assignfrom || ""),
    },
    {
      title: "Assigned To",
      dataIndex: "assignto",
      sorter: (a: Deal, b: Deal) =>
        (a.assignto || "").localeCompare(b.assignto || ""),
    },
     {
      title: "Follow-UP Date",
      dataIndex: "followdate",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "-",
      sorter: (a: Deal, b: Deal) =>
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
      sorter: (a: Deal, b: Deal) =>
        (a.leadstatus || "").localeCompare(b.leadstatus || ""),
    },
    
    {
      title: "Demo Date",
      dataIndex: "demodate",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "-",
      sorter: (a: Deal, b: Deal) =>
        (a.demodate || "").localeCompare(b.demodate || "")
    },
  ];

  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };
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
            title="Demos"
            badgeCount={totalDeals}
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
                Add Deal
              </Link> */}
            </div>
            <div className="card-body">
              {/* table header */}
             <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="dropdown">
                    {/* <Link
                      to="#"
                      className="dropdown-toggle btn btn-outline-light px-2 shadow"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort By
                    </Link> */}
                    {/* <div className="dropdown-menu">
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
                    </div> */}
                  </div>
                 {/* <PredefinedDatePicker/> */}
                </div>
               {/*<div className="d-flex align-items-center gap-2 flex-wrap">
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
                                className="collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Deals Name
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseThree"
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
                                <ul>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Konopelski
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Adams
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Gutkowski
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Walter
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
                                Owner
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
                                      Hendry Milner
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Guilory Berggren
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Jami Carlile
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Theresa Nelson
                                    </label>
                                  </li>
                                  <li className="mb-1">
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Smith Cooper
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
                                      Won
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Open
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
                                data-bs-target="#collapseOne"
                                aria-expanded="false"
                                aria-controls="collapseOne"
                              >
                                Rating
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="collapseOne"
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
                                      <span className="rating">
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <span className="ms-1">5.0</span>
                                      </span>
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="rating">
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled" />
                                        <span className="ms-1">4.0</span>
                                      </span>
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="rating">
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <span className="ms-1">3.0</span>
                                      </span>
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="rating">
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <span className="ms-1">2.0</span>
                                      </span>
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      <span className="rating">
                                        <i className="ti ti-star-filled text-warning" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <i className="ti ti-star-filled" />
                                        <span className="ms-1">1.0</span>
                                      </span>
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
                                data-bs-target="#tags"
                                aria-expanded="false"
                                aria-controls="tags"
                              >
                                Tags
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="tags"
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
                                      Promotion
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Rated
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Rejected
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Collab
                                    </label>
                                  </li>
                                  <li>
                                    <label className="dropdown-item px-2 d-flex align-items-center">
                                      <input
                                        className="form-check-input m-0 me-1"
                                        type="checkbox"
                                      />
                                      Calls
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
                
                  
                </div>*/}
              </div>
              {/* table header */}
              {/* Deals List */}
              <div className=" custom-table table-nowrap">
                <Datatable
                  columns={columns}
                  dataSource={data}
                  Selection={true}
                  searchText={searchText}
                />
              </div>

              {/* /Deals List */}
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
    <ModalDeals/>
    </>
  );
};

export default DealsList;
