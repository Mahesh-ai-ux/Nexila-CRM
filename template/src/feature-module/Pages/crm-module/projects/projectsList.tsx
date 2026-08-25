import { Link } from "react-router";
import Footer from "../../../../components/footer/footer";
import PageHeader from "../../../../components/page-header/pageHeader";
import SearchInput from "../../../../components/dataTable/dataTableSearch";
import { useState, useEffect } from "react";

import Datatable from "../../../../components/dataTable";
import ModalProject from "./modal/modalProject";

import axios from "axios";
import API_URL from "../../../../api/apiconfig";
import dayjs from "dayjs";
import { all_routes } from "../../../../routes/all_routes";

interface Student {
  _id: string;
  nexilaID?: string;
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
  followdate?: string;
  demodate?: string;
  lookingfor?: string;
  internshipduration?: string,
  dateofjoin?: string;
  fees: number;
  feetype: string;
  feepaid: number;
  pendingfee: number;
  noofday: string;
  createdAt?: string;
}

//nexila change - pending fee
const ProjectsList = ({ isPendingOnly = false }: { isPendingOnly?: boolean }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionType, setActionType] = useState<"edit" | "payment" | null>(null);
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
      //nexila change - pending fee
      // const formatted = studentsData.map((student: any) => ({
      const formatted = studentsData.map((student: any) => ({

        key: student._id,
        _id: student._id,
        nexilaID: student.nexilaID || "N/A",
        name: student.name || "N/A",
        phone: student.phone || "N/A",
        domain: student.domain || "N/A",
        assignfrom: student.assignfrom?.name || "N/A",
        assignto: student.assignto?.name || "N/A",
        followdate: student.followdate,
        internshipduration: student.internshipduration,
        lookingfor: student.lookingfor,
        noofday: student.noofday || "120",
        // demodate:student.demodate,
        dateofjoin: student.dateofjoin,
        fees: student.fees,
        feepaid: student.feepaid,
        pendingfee: student.pendingfee,
        feetype: student.feetype,
        createdAt: student.createdAt,

        leadId: student.leadId //nexila change
      }));
      //nexila change - pending fee

      let finalData = formatted;

      if (isPendingOnly) {
        finalData = formatted.filter(
          (student: any) => Number(student.pendingfee) > 0
        );
      }

      setData(finalData);


      console.log("✅ students loaded:", formatted);
    } catch (error: any) {
      console.error("❌ Error fetching students:", error.message);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Edit lead handler
  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setActionType("edit");
  };

  const handleUpdateFeeClick = (student: Student) => {
    setSelectedStudent(student);
    setActionType("payment"); // 🔥 IMPORTANT
  };

  const totalStudents = data.length;

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [

    {
      title: "Nexila ID",
      dataIndex: "nexilaID",
      key: "nexilaID",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link
            to={`${all_routes.leadsDetails}/${record.leadId}`}   // ✅ FIX
            className="d-flex flex-column"
          >
            {text}
          </Link>
        </h6>
      ),
      sorter: (a: Student, b: Student) =>
        (a.nexilaID || "").localeCompare(b.nexilaID || ""),
    },
    {
      title: "Student Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <h6 className="d-flex align-items-center fs-14 fw-medium mb-0">
          <Link
            to={`${all_routes.leadsDetails}/${record.leadId}`}   // ✅ FIX
            className="d-flex flex-column"
          >
            {text}
          </Link>
        </h6>
      ),
      // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: Student, b: Student) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Domain",
      dataIndex: "domain",
      sorter: (a: Student, b: Student) =>
        (a.domain || "").localeCompare(b.domain || ""),
    },
    {
      title: "No of Days",
      dataIndex: "noofday",
      sorter: (a: Student, b: Student) => a.noofday.localeCompare(b.noofday),
    },
    {
      title: "Date of Joining",
      dataIndex: "dateofjoin",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "-",
      sorter: (a: Student, b: Student) =>
        (a.dateofjoin || "").localeCompare(b.dateofjoin || "")
    },
    {
      title: "Fees",
      dataIndex: "fees",
      sorter: (a: Student, b: Student) =>
        (a.fees ?? 0) - (b.fees ?? 0),
    },
    {
      title: "Pending Fees",
      dataIndex: "pendingfee",
      sorter: (a: Student, b: Student) =>
        (a.pendingfee ?? 0) - (b.pendingfee ?? 0),
    },


    {
      title: "Trainer",
      dataIndex: "assignto",
      sorter: (a: Student, b: Student) =>
        (a.assignto || "").localeCompare(b.assignto || ""),
    },


    {
      title: "Action",
      dataIndex: "Action",
      render: (_: any, record: Student) => (
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
              className="dropdown-item "
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
              data-bs-target="#delete_project"
              onClick={() => handleUpdateFeeClick(record)}
            >
              <i className="ti ti-trash" /> Update Fee
            </Link>

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

            </div>
            <div className="card-body">
              {/* table header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">

                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">


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
      <ModalProject
        selectedStudent={selectedStudent}
        actionType={actionType}
        onUpdate={fetchLeads}
      />



    </>
  );
};

export default ProjectsList;