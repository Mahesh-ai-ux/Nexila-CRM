// import { Link } from "react-router";
// import ImageWithBasePath from "../../../../../components/imageWithBasePath";
import { useState, useEffect } from "react";
import {

  Industry,
  Lookingfor, Feetype,
  Internshipduration,

} from "../../../../../core/json/selectOption";
import CommonSelect from "../../../../../components/common-select/commonSelect";
// import MultipleSelect from "../../../../../components/multiple-Select/multipleSelect";
import CommonDatePicker from "../../../../../components/common-datePicker/commonDatePicker";
// import { all_routes } from "../../../../../routes/all_routes";
import dayjs from "dayjs";
import API_URL from "../../../../../api/apiconfig";
import axios from "axios";
interface Student {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  collegename?: string;
  category?: string;
  location?: string;
  domain?: string;
  assignto?: string | { _id: string; name: string };
  graduate?: string;
  lookingfor?: string;
  internshipduration?: string;
  noofday?: string;
  dateofjoin?: string;
  fees: number;
  feetype: string;
  feepaid: number;
  pendingfee: number;
}
interface ModalStudentsProps {
  selectedStudent: Student | null;
  actionType: "edit" | "payment" | null;
  onUpdate: () => void;
}

const ModalProject: React.FC<ModalStudentsProps> = ({
  selectedStudent,
  actionType = null, // ✅ CORRECT
  onUpdate,
}) => {

  // const disableFutureAndOldDates = (current: dayjs.Dayjs) => {
  //   const today = dayjs().startOf("day");
  //   return current.isBefore(today);
  // };

  const [userList, setUserList] = useState<any[]>([]);
  const [payamount, setPayAmount] = useState<number>(0);
  const [formData, setFormData] = useState<Student>({
    name: "",
    phone: "",
    // email: "",
    // collegename: "",
    // location: "",
    // category: "",
    domain: "",
    assignto: "",
    // graduate: "",
    lookingfor: "",
    internshipduration: "",
    noofday: "",
    dateofjoin: "",
    fees: 0,
    feepaid: 0,
    feetype: "",
    pendingfee: 0,
  });
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);





  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ get token from localStorage

        const res = await axios.get(`${API_URL}/users/list`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ include JWT in header
          },
        });

        console.log("Fetched users:", res.data);
        const formatted = res.data.map((u: any) => ({
          label: u.name,
          value: u._id,
        }));
        setUserList(formatted);
      } catch (err: any) {
        console.error("Failed to load users:", err.response?.data || err);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    if (userList.length && formData.assignto) {
      const user = userList.find(u => u.label === formData.assignto);
      if (user) {
        setFormData(prev => ({
          ...prev,
          assignto: user.value,
        }));
      }
    }
  }, [userList, formData.assignto]);


  useEffect(() => {
    const pending = Number(formData.fees) - Number(formData.feepaid);

    setFormData(prev => ({
      ...prev,
      pendingfee: pending >= 0 ? pending : 0,
    }));
  }, [formData.fees, formData.feepaid]);

  useEffect(() => {
    if (!selectedStudent || !selectedStudent._id) return;

    if (actionType === "payment") {
      console.log("selectedStudent:", selectedStudent);
      fetchPayments(selectedStudent._id);
      fetchStudent(selectedStudent._id);



    }

    if (actionType === "edit") {
      setFormData({
        ...selectedStudent,
        assignto:
          typeof selectedStudent.assignto === "object"
            ? selectedStudent.assignto._id
            : selectedStudent.assignto ?? "",
      });
    }
  }, [selectedStudent, actionType]);

  if (!selectedStudent) {
    return null; // ✅ SAFE now
  }


  const fetchPayments = async (studentId: string) => {
    try {
      setLoadingPayments(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/students/${studentId}/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setPayments(res.data.payments);

    } catch (err) {
      console.error("❌ Failed to load payments", err);
    } finally {
      setLoadingPayments(false);
    }
  };
  const fetchStudent = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const s = res.data.student;

      setFormData({
        _id: s._id,
        name: s.name ?? "",
        phone: s.phone ?? "",
        fees: selectedStudent.fees ?? 0,
        feepaid: selectedStudent.feepaid ?? 0,
        pendingfee: selectedStudent.pendingfee ?? 0,
        feetype: selectedStudent.feetype ?? "",

        assignto:
          typeof s.assignto === "object" ? s.assignto._id : s.assignto ?? "",
      });

      setPayAmount(0); // 🔥 reset payment input
    } catch (err) {
      console.error("❌ Failed to load student", err);
    }
  };


  const validateForm = () => {
    // Always optional fields (base)
    const alwaysIgnore = [
      "email",
      "collegename", "pendingfee", "followdate"
    ];

    // Conditions

    const isInternship =
      (formData.lookingfor === "Internship" || formData.lookingfor === "Project with Internship");

    // Conditionally ignored fields
    const conditionalIgnore = [
      ...(isInternship ? [] : ["internshipduration"]),
    ];

    const fieldsToIgnore = [...alwaysIgnore, ...conditionalIgnore];

    // ❌ EMPTY FIELD VALIDATION
    const emptyFields = Object.entries(formData).filter(
      ([key, value]) =>
        !fieldsToIgnore.includes(key) &&
        (!value || value.toString().trim() === "")
    );

    if (emptyFields.length > 0) {
      alert(`Please fill required fields: ${emptyFields.map(([k]) => k).join(", ")}`);
      return false;
    }

    return true;
  };

  // ✅ Handle text inputs
  // 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numberFields = ["fees", "feepaid", "pendingfee", "payamount", "noofday"];

    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? Number(value || 0)
        : value
    }));
  };

  // ✅ Handle selects (from CommonSelect)

  // For CommonSelect dropdowns:
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // ✅ AUTO-FILL noofday when internship duration changes
      if (name === "internshipduration") {
        updated.noofday = value; // value already = days
      }

      return updated;
    });
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!formData?._id) return;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        assignto: formData.assignto || null,
      };

      await axios.put(
        `${API_URL}/students/${formData._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Student updated successfully");
      onUpdate();

    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ Failed to update student");
    }
  };
  // useEffect(() => {
  //   if (payamount > formData.pendingfee) {
  //     setFormData(prev => ({
  //       ...prev,
  //       payamount: prev.pendingfee,
  //     }));
  //   }
  // }, [payamount, formData.pendingfee]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent?._id) return;

    if (payamount <= 0) {
      alert("Enter valid payment amount");
      return;
    }

    // if (payamount > formData.pendingfee) {
    //   alert("Payment exceeds pending fee");
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(`${API_URL}/students/pay-fee/${selectedStudent._id}`,
        { payamount: payamount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.student;

      setFormData(prev => ({
        ...prev,
        feepaid: updated.feepaid ?? prev.feepaid,
        pendingfee: updated.pendingfee ?? prev.pendingfee,
      }));

      setPayAmount(0);
      alert("✅ Payment successful");
      fetchPayments(selectedStudent._id);
      onUpdate();
    } catch (err: any) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  // const handlePayment = async (e) => {
  //   e.preventDefault();

  //   if (!formData.payamount) {
  //     alert("Enter payment amount");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.put(
  //       `/api/student/pay-fee/${formData._id}`,
  //       { payamount: formData.payamount },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     alert("Payment successful");

  //     // ✅ Update UI with latest values
  //     setFormData(prev => ({
  //       ...prev,
  //       feepaid: res.data.student.feepaid,
  //       pendingfee: res.data.student.pendingfee,
  //       payamount: ""
  //     }));

  //   } catch (err) {
  //     alert(err.response?.data?.message || "Payment failed");
  //   }
  // };


  //    const options = [
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-02.jpg"
  //               alt="Robert"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Robert Johnson
  //         </div>
  //       ),
  //       value: "robert-johnson",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/users/user-01.jpg"
  //               alt="Sharon"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Sharon Roy
  //         </div>
  //       ),
  //       value: "sharon-roy",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-21.jpg"
  //               alt="Vaughan"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Vaughan Lewis
  //         </div>
  //       ),
  //       value: "vaughan-lewis",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-23.jpg"
  //               alt="Jessica"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Jessica Louise
  //         </div>
  //       ),
  //       value: "jessica-louise",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-16.jpg"
  //               alt="Carol"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Carol Thomas
  //         </div>
  //       ),
  //       value: "carol-thomas",
  //     },
  //   ];

  //   const [selectedItems2, setSelectedItems2] = useState<string[]>([]);

  //   const handleChange2 = (value: string[]) => {
  //     setSelectedItems2(value);
  //   };
  //  const options2 = [
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-19.jpg"
  //               alt="Robert"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //          Darlee Robertson
  //         </div>
  //       ),
  //       value: "robert-johnson",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/users/user-01.jpg"
  //               alt="Sharon"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Sharon Roy
  //         </div>
  //       ),
  //       value: "sharon-roy",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-21.jpg"
  //               alt="Vaughan"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Vaughan Lewis
  //         </div>
  //       ),
  //       value: "vaughan-lewis",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-23.jpg"
  //               alt="Jessica"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Jessica Louise
  //         </div>
  //       ),
  //       value: "jessica-louise",
  //     },
  //     {
  //       label: (
  //         <div className="d-flex align-items-center gap-2">
  //           <div
  //             style={{
  //               borderRadius: "50%",
  //               overflow: "hidden",
  //               width: 24,
  //               height: 24,
  //             }}
  //           >
  //             <ImageWithBasePath
  //               src="assets/img/profiles/avatar-16.jpg"
  //               alt="Carol"
  //               width={24}
  //               height={24}
  //             />
  //           </div>
  //           Carol Thomas
  //         </div>
  //       ),
  //       value: "carol-thomas",
  //     },
  //   ];
  return (
    <>
      {/* Add Canvas */}
      {/* <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Project</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project ID<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Type <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Project_Type}
                    className="select"
                    defaultValue={Project_Type[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Client <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Client}
                    className="select"
                    defaultValue={Client[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Category}
                    className="select"
                    defaultValue={Category[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Timing <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Project_Timing}
                    className="select"
                    defaultValue={Project_Timing[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Responsible Persons <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems}
                    onChange={handleChange}
                    options={options}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Team Leader <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems2}
                    onChange={handleChange2}
                    options={options2}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <CommonSelect name=""
                    options={Priority}
                    className="select"
                    defaultValue={Priority[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CommonSelect name=""
                    options={StatusActive}
                    className="select"
                    defaultValue={StatusActive[0]}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#create_success"
              >
                Create New
              </button>
            </div>
          </form>
        </div>
      </div> */}
      {/* /Add Canvas */}
      {/* Add Canvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_edit"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Edit Student</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {formData && (
            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input name="name" type="text" value={formData.name ?? ""} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Mobile No<span className="text-danger">*</span>
                    </label>
                    <input name="phone" type="tel" value={formData.phone ?? ""} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Domain <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="domain"
                      value={formData.domain ?? ""}
                      onChange={handleSelectChange}
                      options={Industry}
                      className="select"
                      defaultValue={Industry[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Date of Joining <span className="text-danger">*</span>
                    </label>
                    <div className="input-group w-auto input-group-flat">



























                      {/*                       
                      Nexila changes 24/04/2025 */}


                      <CommonDatePicker
                        placeholder="dd/mm/yyyy"
                        format="DD/MM/YYYY"
                        value={formData.dateofjoin ? dayjs(formData.dateofjoin) : null}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            dateofjoin: date ? date.format("YYYY-MM-DD") : "",
                          }))
                        }
                      />


                      {/* <CommonDatePicker
                        placeholder="dd/mm/yyyy"
                        format="DD/MM/YYYY"
                        value={formData.dateofjoin ? dayjs(formData.dateofjoin) : null}
                        disabledDate={disableFutureAndOldDates}
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            dateofjoin: date ? date.format("YYYY-MM-DD") : "",
                          }))
                        }


                      /> */}














                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Fees<span className="text-danger">*</span>
                    </label>
                    <input name="fees" type="text" value={formData.fees ?? 0} onChange={handleInputChange} disabled className="form-control" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Pending Fees<span className="text-danger"></span>
                    </label>
                    <input name="pendingfee" type="text" value={formData.pendingfee ?? 0} onChange={handleInputChange} disabled className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Fees Paid<span className="text-danger">*</span>
                    </label>
                    <input name="feepaid" type="text" value={formData.feepaid ?? 0} onChange={handleInputChange} disabled className="form-control" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      FeeType<span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="feetype"
                      value={formData.feetype ?? ""}
                      onChange={handleSelectChange}
                      options={Feetype}
                      className="select"

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Trainer<span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="assignto"
                      value={typeof formData.assignto === "object"
                        ? formData.assignto._id
                        : formData.assignto || ""}
                      onChange={handleSelectChange}
                      options={userList}
                      className="select"

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Looking for<span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="lookingfor"
                      value={formData.lookingfor ?? ""}
                      onChange={handleSelectChange}
                      options={Lookingfor}
                      className="select"

                    />
                  </div>
                </div>
                {(formData.lookingfor === "Internship" || formData.lookingfor === "Project with Internship") && (
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Internship Duration in Days
                        <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="internshipduration"
                        value={formData.internshipduration ?? ""}
                        onChange={handleSelectChange}
                        options={Internshipduration}
                        className="select"

                      />
                    </div>
                  </div>
                )}

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      No of Days<span className="text-danger">*</span>
                    </label>
                    <input name="noofday" type="text" value={formData.noofday ?? ""} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>


                {/*  <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Client <span className="text-danger">*</span>
                  </label> 
                  <CommonSelect name=""
                    options={Client}
                    className="select"
                    defaultValue={Client[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Category}
                    className="select"
                    defaultValue={Category[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Timing <span className="text-danger">*</span>
                  </label>
                  <CommonSelect name=""
                    options={Project_Timing}
                    className="select"
                    defaultValue={Project_Timing[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="2,15,000"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Responsible Persons <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems}
                    onChange={handleChange}
                    options={options}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Team Leader <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems2}
                    onChange={handleChange2}
                    options={options2}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <CommonSelect name=""
                    options={Priority}
                    className="select"
                    defaultValue={Priority[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CommonSelect name=""
                    options={StatusActive}
                    className="select"
                    defaultValue={StatusActive[1]}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    defaultValue={
                     "Provides a multiple ondemand service marketplace"
                     }
                  />
                </div>
              </div> */}
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <button
                  type="button"
                  data-bs-dismiss="offcanvas"
                  className="btn btn-light me-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                // data-bs-toggle="modal"
                // data-bs-target="#create_success"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
      {/* /Add Canvas */}
      {/* success modal */}
      {/* <div className="modal fade" id="create_success">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-info border-0 text-info rounded-circle">
                  <i className="ti ti-atom-2 fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Project Created Successfully!!!</h5>
              <p className="mb-3">View the details of project, created</p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to={all_routes.projectDetails}
                  className="btn btn-primary position-relative z-1 w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* success modal */}
      {/* delete modal */}
      <div className="modal fade" id="delete_project">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <h5 className="mb-1">Update Fees</h5>
              {/* <i className="ti ti-trash fs-24" />
               <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove project you selected.
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary position-relative z-1 w-100"
                  data-bs-dismiss="modal"
                >
                  Yes, Delete
                </Link>
              </div>*/}
              <form onSubmit={handlePayment}>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Fees<span className="text-danger">*</span>
                    </label>
                    <input name="fees" type="text" value={formData.fees} onChange={handleInputChange} className="form-control" disabled required />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Pending Fees<span className="text-danger"></span>
                    </label>
                    <input name="pendingfee" type="text" value={formData.pendingfee} onChange={handleInputChange} disabled className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Fees Paid<span className="text-danger">*</span>
                    </label>
                    <input name="feepaid" type="text" value={formData.feepaid} onChange={handleInputChange} disabled className="form-control" required />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Pay Amount<span className="text-danger">*</span>
                    </label>
                    <input name="payamount" type="text" placeholder="Enter payment amount" value={payamount}
                      onChange={(e) => setPayAmount(Number(e.target.value))} disabled={formData.pendingfee === 0} className="form-control" required />
                    {formData.pendingfee === 0 && (
                      <small className="text-success">✅ Fees fully paid</small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">
                      FeeType<span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="feetype"
                      value={formData.feetype}
                      onChange={handleSelectChange}
                      options={Feetype}
                      className="select"

                    />
                  </div>
                </div>
                {/* <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary position-relative z-1 w-100"
                  data-bs-dismiss="modal"
                >
                  Update
                </Link>
              </div> */}
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-light me-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formData.pendingfee === 0}
                  // data-bs-toggle="modal"
                  // data-bs-target="#create_success"
                  >
                    Save
                  </button>

                </div>
              </form>
              {actionType === "payment" && (
                <div className="mt-4">
                  <h5>Payment History</h5>

                  {loadingPayments ? (
                    <p>Loading payments...</p>
                  ) : payments.length === 0 ? (
                    <p>No payments yet</p>
                  ) : (
                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Amount</th>
                          {/* <th>Mode</th> */}
                          <th>Date</th>
                          <th>Collected By</th>
                        </tr>
                      </thead>

                      {payments.map((p, index) => (
                        <tr key={p._id}>
                          <td>{index + 1}</td>
                          <td>₹{p.payment.amount}</td>
                          {/* <td>{p.payment.paymentMode}</td> */}
                          <td>
                            {new Date(p.payment.paidAt).toLocaleDateString()}
                          </td>
                          <td>{p.updatedby?.name || "System"}</td>
                        </tr>
                      ))}

                    </table>
                  )}
                </div>
              )}


            </div>

          </div>
        </div>
      </div>
      {/* delete modal */}
    </>
  );
};

export default ModalProject;