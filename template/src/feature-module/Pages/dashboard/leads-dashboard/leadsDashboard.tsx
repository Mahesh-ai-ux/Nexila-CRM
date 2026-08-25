import { Link } from "react-router";
import Footer from "../../../../components/footer/footer";
import CollapseIcons from "../../../../components/collapse-icons/collapseIcons";
import PredefinedDatePicker from "../../../../components/common-dateRangePicker/PredefinedDatePicker";
// import ImageWithBasePath from "../../../../components/imageWithBasePath";
// import { all_routes } from "../../../../routes/all_routes";
import LeadPieChart from "./charts/leadPieChart";
import ContactReportChart from "./charts/contactReportChart";
import LastChart from "../deals-dashboard/chats/lastChart";
import WonChart from "../deals-dashboard/chats/wonChart";
// import axios from "axios";
import {getAllLeads} from "../../../../api/leadApi";
import { useEffect, useState } from "react";
type Lead = {
  _id: string
  name: string
  domain: string
  phone: string
  leadstatus: string
}

const LeadsDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [days, setDays] = useState(30);


 useEffect(() => {
    async function fetchLeads() {
      try {
        const data = await getAllLeads(); // ✅ fetch from API
        setLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    }
    fetchLeads();
  }, []);


  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div>
              <h4 className="mb-0">Leads Dashboard</h4>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <PredefinedDatePicker />
              <CollapseIcons />
            </div>
          </div>
          {/* End Page Header */}
          {/* start row */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h6 className="mb-0">Recently Created Leads</h6>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        Last 30 days
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item">
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item">
                          Last 30 days
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body leads-table">
                  <div className=" custom-table overflow-auto">
                    <table
                      className="table table-nowrap dataTable no-footer"
                      id="lead-project"
                      style={{ width: 570 }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            className="sorting_disabled"
                            rowSpan={1}
                            colSpan={1}
                            style={{ width: 83 }}
                          >
                            Lead Name
                          </th>
                          <th
                            className="sorting_disabled"
                            rowSpan={1}
                            colSpan={1}
                            style={{ width: 195 }}
                          >
                            Domain
                          </th>
                          <th
                            className="sorting_disabled"
                            rowSpan={1}
                            colSpan={1}
                            style={{ width: 106 }}
                          >
                            Phone
                          </th>
                          <th
                            className="sorting_disabled"
                            rowSpan={1}
                            colSpan={1}
                            style={{ width: 78 }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.length > 0 ? (
                           leads.map((lead) => (
                        <tr key={lead._id}>
                          <td>
                        <Link to={`/lead-details/${lead._id}`}>{lead.name}</Link>
                         </td>
                        <td>
                        <div className="d-flex align-items-center">
                        <div className="ms-2">
                        <h6 className="fs-14 fw-medium mb-0">{lead.domain || "N/A"}</h6>
                        </div>
                        </div>
                        </td>
                       <td>{lead.phone || "N/A"}</td>
                        <td>
                        <span className="badge bg-success">
                       {lead.leadstatus || "New"}
                        </span>
                       </td>
                       </tr>
                        ))
                          ) : (
                          <tr>
                          <td  className="text-center text-muted"> 
                            {/* colSpan="4" */}
                           No recent leads found
                          </td>
                          </tr>
                        )}
                      </tbody>

                    </table>
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h6 className="mb-0">Lead By Stage</h6>
                    <div className="dropdown">
                      <Link
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                       Last {days} Days
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={() => setDays(30)}>
                          Last 30 Days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={() => setDays(15)}>
                          Last 15 Days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={() => setDays(7)}>
                          Last 7 Days
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="leadpiechart" className="text-center">
                    <LeadPieChart days={days}  />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h6 className="mb-0">Projects By Stage</h6>
                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                      <div className="dropdown me-2">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Sales Pipeline
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Marketing Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Sales Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Email
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Chats
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Operational
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 30 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 30 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 15 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body py-0">
                  <div id="contact-report">
                    <ContactReportChart />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h6 className="mb-0">Lost Deals Stage</h6>
                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                      <div className="dropdown me-2">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Marketing Pipeline
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Marketing Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Sales Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Email
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Chats
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Operational
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 3 months
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 3 months
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 6 months
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 12 months
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body py-0">
                  <div id="last-chart">
                    <LastChart />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
            <div className="col-md-6 d-flex">
              <div className="card w-100">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h6 className="mb-0">Won Deals Stage</h6>
                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                      <div className="dropdown me-2">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Marketing Pipeline
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Marketing Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Sales Pipeline
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Email
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Chats
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Operational
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          className="dropdown-toggle btn btn-outline-light shadow"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 3 months
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 3 months
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 6 months
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 12 months
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body py-0">
                  <div id="won-chart">
                    <WonChart />
                  </div>
                </div>{" "}
                {/* end card body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* End Content */}
        {/* Start Footer */}

        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default LeadsDashboard;
