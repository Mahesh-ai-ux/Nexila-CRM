// import { Link } from "react-router";
// import { all_routes } from "../../../../../routes/all_routes";
// import {
//   CATEGORYS,
//   Leadstatus,
//   Internshipduration,
//   Feetype,
//   COLLEGES,
//   DISTRICTS,
//   GRADUATES,
//   DOMAINS,
//   SOURCES,
//   PROGRAM_TYPES
// } from "../../../../../core/json/selectOption";
// import CommonSelect from "../../../../../components/common-select/commonSelect";
// import CommonDatePicker from "../../../../../components/common-datePicker/commonDatePicker";
// import { useState, useEffect } from "react";
// import { createLead } from "../../../../../api/leadApi";
// import axios from "axios";
// import LeadStatus from "./LeadStatus";
// import dayjs from "dayjs";
// import API_URL from "../../../../../api/apiconfig";

// // Connect these arrays to your existing college and location lists.
// // The fields remain usable even if these arrays are empty.


// interface SelectOption {
//   label: string;
//   value: string;
// }

// interface Lead {
//   _id?: string;
//   name?: string;
//   phone?: string;
//   email?: string;
//   leadstatus?: string;
//   leadsource?: string;
//   collegename?: string;
//   collegeRegisterId?: string;
//   category?: string;
//   location?: string;
//   domain?: string;
//   assignfrom?: string;
//   assignto?: string;
//   graduate?: string;
//   followdate?: string;
//   demodate?: string;
//   lookingfor?: string;
//   internshipduration?: string;
//   dropreason?: string;
//   remark?: string;
//   domainreason?: string;
//   dateofjoin?: string;
//   fees?: string;
//   feetype?: string;
//   feepaid?: string;
//   pendingfee?: string;
//   noofday?: string;
// }

// interface ModalLeadsProps {
//   selectedLead: Lead | null;
//   actionType: "edit" | "delete" | null;
//   onUpdate: () => void;
// }

// interface TypeableDropdownProps {
//   name: string;
//   value: string;
//   options: any[];
//   onChange: (name: string, value: string) => void;
//   placeholder?: string;
//   required?: boolean;
// }

// // Accepts existing option arrays and stores the selected/typed value as a string.
// const TypeableDropdown: React.FC<TypeableDropdownProps> = ({
//   name,
//   value,
//   options,
//   onChange,
//   placeholder,
//   required = false,
// }) => {
//   const listId = `options-${name}`;

//   const optionValues = (options || [])
//     .map((option: any) => {
//       if (typeof option === "string") return option;
//       return option?.value ?? option?.label ?? option?.name ?? "";
//     })
//     .filter((option: string) => option !== "")
//     .map(String);

//   return (
//     <>
//       <input
//         type="text"
//         name={name}
//         list={listId}
//         value={value || ""}
//         onChange={(e) => onChange(name, e.target.value)}
//         className="form-control"
//         placeholder={placeholder || "Select or type"}
//         required={required}
//         autoComplete="off"
//       />
//       <datalist id={listId}>
//         {optionValues.map((option, index) => (
//           <option key={`${name}-${index}`} value={option} />
//         ))}
//       </datalist>
//     </>
//   );
// };

// const initialLeadState: Lead = {
//   name: "",
//   phone: "",
//   email: "",
//   collegename: "",
//   collegeRegisterId: "",
//   location: "",
//   category: "",
//   leadsource: "",
//   leadstatus: "New Lead",
//   domain: "",
//   assignfrom: "",
//   assignto: "",
//   graduate: "",
//   followdate: "",
//   demodate: "",
//   lookingfor: "",
//   internshipduration: "",
//   dropreason: "",
//   domainreason: "",
//   remark: "",
//   dateofjoin: "",
//   fees: "",
//   feepaid: "",
//   feetype: "",
//   pendingfee: "",
//   noofday: "",
// };

// const formatName = (value: string) =>
//   value
//     .trim()
//     .split(/\s+/)
//     .map((word) =>
//       word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
//     )
//     .join(" ");

// const validEmail = (email: string) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// const ModalLeads: React.FC<ModalLeadsProps> = ({
//   selectedLead,
//   actionType: _actionType = null,
//   onUpdate,
// }) => {
//   const disableFutureAndOldDates = (current: dayjs.Dayjs) =>
//     current.isBefore(dayjs().startOf("day"));

//   const [leadStatusOptions, setLeadStatusOptions] = useState<SelectOption[]>(
//     []
//   );
//   const [lead, setLead] = useState<Lead>({ ...initialLeadState });
//   const [formData, setFormData] = useState<Lead>({ ...initialLeadState });
//   const [userList, setUserList] = useState<SelectOption[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch statuses from the backend.
//   useEffect(() => {
//     const fetchLeadStatuses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_URL}/leadstatus`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const formatted: SelectOption[] = res.data.map((item: any) => ({
//           value: String(item.name),
//           label: String(item.name),
//         }));

//         setLeadStatusOptions(formatted);
//       } catch (err) {
//         console.error("Error fetching lead statuses", err);
//       }
//     };

//     fetchLeadStatuses();
//   }, []);

//   // Fetch users for assignment/trainer dropdowns.
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_URL}/users/list`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUserList(
//           res.data.map((user: any) => ({
//             label: user.name,
//             value: user._id,
//           }))
//         );
//       } catch (err: any) {
//         console.error("Failed to load users:", err.response?.data || err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Keep existing string values in the edit form, including assigned users.
//   // useEffect(() => {
//   //   if (!selectedLead) return;

//   //   const fees = Number(selectedLead.fees) || 0;
//   //   const feepaid = Number(selectedLead.feepaid) || 0;

//   //   setLead({
//   //     ...initialLeadState,
//   //     ...selectedLead,
//   //     name: selectedLead.name || "",
//   //     phone: selectedLead.phone || "",
//   //     email: selectedLead.email || "",
//   //     collegename: selectedLead.collegename || "",
//   //     collegeRegisterId: selectedLead.collegeRegisterId || "",
//   //     location: selectedLead.location || "",
//   //     leadsource: selectedLead.leadsource,
//   //     leadstatus: selectedLead.leadstatus || "New Lead",
//   //     remark: selectedLead.remark || "",
//   //     demodate: selectedLead.demodate
//   //       ? selectedLead.demodate.split("T")[0]
//   //       : "",
//   //     followdate: selectedLead.followdate
//   //       ? selectedLead.followdate.split("T")[0]
//   //       : "",
//   //     dateofjoin: selectedLead.dateofjoin
//   //       ? selectedLead.dateofjoin.split("T")[0]
//   //       : "",
//   //     fees: fees.toString(),
//   //     feepaid: feepaid.toString(),
//   //     pendingfee: Math.max(fees - feepaid, 0).toString(),
//   //     feetype: selectedLead.feetype || "",
//   //   });
//   // }, [selectedLead]);
// // Load selected lead into the Edit form.

// useEffect(() => {
//   if (!selectedLead?._id) return;

//   let cancelled = false;

//   const fetchLeadDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${API_URL}/leads/${selectedLead._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (cancelled) return;

//       const fullLead = res.data.lead ?? selectedLead;

//       console.log("Full lead data:", fullLead);
//       console.log(
//         "College Register ID:",
//         fullLead.collegeRegisterId
//       );

//       const fees = Number(fullLead.fees) || 0;
//       const feepaid = Number(fullLead.feepaid) || 0;

//       setLead({
//         ...initialLeadState,
//         ...fullLead,

//         name: fullLead.name || "",
//         phone: fullLead.phone || "",
//         email: fullLead.email || "",
//         collegename: fullLead.collegename || "",

//         collegeRegisterId: String(
//           fullLead.collegeRegisterId ?? ""
//         ),

//         location: fullLead.location || "",
//         leadsource: fullLead.leadsource || "",
//         leadstatus: fullLead.leadstatus || "New Lead",
//         remark: fullLead.remark || "",

//         demodate: fullLead.demodate
//           ? fullLead.demodate.split("T")[0]
//           : "",

//         followdate: fullLead.followdate
//           ? fullLead.followdate.split("T")[0]
//           : "",

//         dateofjoin: fullLead.dateofjoin
//           ? fullLead.dateofjoin.split("T")[0]
//           : "",

//         fees: fees.toString(),
//         feepaid: feepaid.toString(),
//         pendingfee: Math.max(fees - feepaid, 0).toString(),
//         feetype: fullLead.feetype || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch full lead details:", error);
//     }
//   };

//   fetchLeadDetails();

//   return () => {
//     cancelled = true;
//   };
// }, [selectedLead?._id]);

//   // Resolve previously populated user names to IDs when needed.
//   useEffect(() => {
//     if (!userList.length) return;

//     setLead((prev) => {
//       const assignedTo = userList.find(
//         (user) => user.label === prev.assignto
//       );
//       const assignedFrom = userList.find(
//         (user) => user.label === prev.assignfrom
//       );

//       const nextAssignTo = assignedTo?.value || prev.assignto;
//       const nextAssignFrom = assignedFrom?.value || prev.assignfrom;

//       if (
//         nextAssignTo === prev.assignto &&
//         nextAssignFrom === prev.assignfrom
//       ) {
//         return prev;
//       }

//       return {
//         ...prev,
//         assignto: nextAssignTo,
//         assignfrom: nextAssignFrom,
//       };
//     });
//   }, [userList]);

//   // Calculate pending fees for the create form.
//   useEffect(() => {
//     const fees = Number(formData.fees) || 0;
//     const feepaid = Number(formData.feepaid) || 0;
//     const pending = Math.max(fees - feepaid, 0);

//     setFormData((prev) =>
//       prev.pendingfee === pending.toString()
//         ? prev
//         : { ...prev, pendingfee: pending.toString() }
//     );
//   }, [formData.fees, formData.feepaid]);

//   // Calculate pending fees for the edit form.
//   useEffect(() => {
//     const fees = Number(lead.fees) || 0;
//     const feepaid = Number(lead.feepaid) || 0;
//     const pending = Math.max(fees - feepaid, 0);

//     setLead((prev) =>
//       prev.pendingfee === pending.toString()
//         ? prev
//         : { ...prev, pendingfee: pending.toString() }
//     );
//   }, [lead.fees, lead.feepaid]);

//   // Shared validation for required fields and existing conditional fields.
//   const validateLead = (data: Lead) => {
//     const alwaysOptional = [
//   "email",
//   "collegename",
//   "collegeRegisterId",
//   "location",
//   "remark",
//   "pendingfee",
//   "noofday",
//   "dropreason",
//   "domainreason",
//   "followdate",
//   "demodate",
//   "dateofjoin",
//   "fees",
//   "feepaid",
//   "feetype",
//   "assignfrom",
//   "assignto",
//   "internshipduration",
//   "notes",
//   "joinstatus",
//   "createdBy",
//   'razorpaySignature', 
//   'paidAt'
// ];

//     const isDemoScheduled = data.leadstatus === "Demo Scheduled";
//     const isStudent = data.leadstatus === "Student";
//     const isInternship =
//       data.lookingfor === "Internship" ||
//       data.lookingfor === "Project with Internship";
//     const isFollowUp = [
//       "Follow-Up 1",
//       "Follow-Up 2",
//       "Follow-Up 3",
//     ].includes(data.leadstatus || "");
//     const isDropOut = data.leadstatus === "Drop Out";
//     const isDomainOthers = data.domain === "Others";

//     const conditionalOptional = [
//       ...(isDemoScheduled ? [] : ["assignfrom", "assignto", "demodate"]),
//       ...(isStudent ? [] : ["assignto", "fees", "feepaid", "feetype", "dateofjoin"]),
//       ...(isInternship ? [] : ["internshipduration"]),
//       ...(isFollowUp ? [] : ["followdate"]),
//       ...(isDropOut ? [] : ["dropreason"]),
//       ...(isDomainOthers ? [] : ["domainreason"]),
//     ];

//     const ignored = new Set([...alwaysOptional, ...conditionalOptional]);

//     const emptyFields = Object.entries(data).filter(
//       ([key, value]) =>
//         !ignored.has(key) &&
//         (value === undefined ||
//           value === null ||
//           String(value).trim() === "")
//     );

//     if (emptyFields.length) {
//       alert(
//         `Please fill required fields: ${emptyFields
//           .map(([key]) => key)
//           .join(", ")}`
//       );
//       return false;
//     }

//     if (!data.name?.trim()) {
//       alert("Please enter the lead name.");
//       return false;
//     }

//     if (!/^[A-Za-z ]+$/.test(data.name.trim())) {
//       alert("Lead name must contain only English letters and spaces.");
//       return false;
//     }

//     if (!/^\d{10}$/.test(data.phone || "")) {
//       alert("Phone number must contain exactly 10 digits.");
//       return false;
//     }

//     if (data.email?.trim() && !validEmail(data.email.trim())) {
//       alert("Please enter a valid email address.");
//       return false;
//     }

//     if (data.leadstatus === "Demo Scheduled") {
//       if (!data.assignfrom || !data.assignto || !data.demodate) {
//         alert("Please select Assign From, Assign To, and Demo Date.");
//         return false;
//       }
//     }

//     if (data.leadstatus === "Student") {
//       const missingStudentFields = [
//         ["assignto", data.assignto],
//         ["fees", data.fees],
//         ["feepaid", data.feepaid],
//         ["feetype", data.feetype],
//         ["dateofjoin", data.dateofjoin],
//       ].filter(([, value]) => !value || !String(value).trim());

//       if (missingStudentFields.length) {
//         alert("Please complete all required Student fields.");
//         return false;
//       }

//       if ((Number(data.feepaid) || 0) > (Number(data.fees) || 0)) {
//         alert("Fee paid cannot be greater than total fees.");
//         return false;
//       }
//     }

//     if (isInternship && !data.internshipduration) {
//       alert("Please select the internship duration.");
//       return false;
//     }

//     if (isFollowUp && !data.followdate) {
//       alert("Please select the follow-up date.");
//       return false;
//     }

//     if (isDropOut && !data.dropreason?.trim()) {
//       alert("Please enter the drop reason.");
//       return false;
//     }

//     if (isDomainOthers && !data.domainreason?.trim()) {
//       alert("Please enter the domain name.");
//       return false;
//     }

//     return true;
//   };

//   const validateForm = () => validateLead(formData);
//   const editvalidateform = () => validateLead(lead);

//   // Create form input handler.
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ): void => {
//     const { name, value } = e.target;

//     if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
//       return;
//     }

//     if (
//       ["fees", "feepaid", "pendingfee"].includes(name) &&
//       !/^\d*$/.test(value)
//     ) {
//       return;
//     }

//     if (name === "name" && !/^[A-Za-z ]*$/.test(value)) {
//       return;
//     }

//     if (
//       name === "feepaid" &&
//       Number(value) > (Number(formData.fees) || 0)
//     ) {
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Edit form input handler.
//   const handlechange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
//       return;
//     }

//     if (
//       ["fees", "feepaid", "pendingfee"].includes(name) &&
//       !/^\d*$/.test(value)
//     ) {
//       return;
//     }

//     if (name === "name" && !/^[A-Za-z ]*$/.test(value)) {
//       return;
//     }

//     if (name === "feepaid" && Number(value) > (Number(lead.fees) || 0)) {
//       return;
//     }

//     setLead((prev) => ({ ...prev, [name]: value }));
    
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "internshipduration" ? { noofday: value } : {}),
//     }));
//   };

//   // const handleselectchange = (name: string, value: string) => {
//   //   setLead((prev) => ({
//   //     ...prev,
//   //     [name]: value,
//   //     ...(name === "internshipduration" ? { noofday: value } : {}),
//   //   }));
//   // };
//  const handleselectchange = (
//   name: string,
//   value: string,
//   formType: string
// ) => {
//   if (formType === "edit") {
//     setLead((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "internshipduration" ? { noofday: value } : {}),
//     }));
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "internshipduration" ? { noofday: value } : {}),
//     }));
//   }
// };

//   const handleNameBlur = () => {
//     setFormData((prev) => ({
//       ...prev,
//       name: prev.name ? formatName(prev.name) : "",
//     }));
//   };

//   const handleEditNameBlur = () => {
//     setLead((prev) => ({
//       ...prev,
//       name: prev.name ? formatName(prev.name) : "",
//     }));
//   };

//   // Create lead.
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formattedData: Lead = {
//       ...formData,
//       name: formData.name ? formatName(formData.name) : "",
//       email: formData.email?.trim() || "",
//       leadsource: formData.leadsource,
//       leadstatus: formData.leadstatus || "New Lead",
//     };

//     if (!validateLead(formattedData)) return;

//     setLoading(true);

//     try {
//       const res = await createLead(formattedData);

//       if (res.success) {
//         alert("✅ Lead stored successfully!");
//         onUpdate();
//         setFormData({ ...initialLeadState });
//       } else {
//         alert("Failed to store lead: " + (res.message || "Unknown error"));
//       }
//     } catch (err) {
//       console.error("Frontend error creating lead:", err);
//       alert("Could not connect to backend.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save edited lead.
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formattedLead: Lead = {
//       ...lead,
//       name: lead.name ? formatName(lead.name) : "",
//       email: lead.email?.trim() || "",
//       leadsource: lead.leadsource,
//       leadstatus: lead.leadstatus || "New Lead",
//     };

//     if (!validateLead(formattedLead)) return;
//     if (!formattedLead._id) return;

//     try {
//       const token = localStorage.getItem("token");

//       const payload: any = {
//         ...formattedLead,
//         remark: formattedLead.remark || "New Lead Added",
//         demodate: formattedLead.demodate || null,
//         followdate: formattedLead.followdate || null,
//         dateofjoin: formattedLead.dateofjoin || null,
//       };

//       const needsAssign =
//         payload.leadstatus === "Demo Scheduled" ||
//         payload.leadstatus === "Student";

//       if (!needsAssign) {
//         delete payload.assignfrom;
//         delete payload.assignto;
//       } else {
//         if (!payload.assignfrom || payload.assignfrom === "N/A") {
//           delete payload.assignfrom;
//         }
//         if (!payload.assignto || payload.assignto === "N/A") {
//           delete payload.assignto;
//         }
//       }

//       await axios.put(`${API_URL}/leads/${formattedLead._id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setLead(formattedLead);
//       alert("✅ Lead updated successfully");
//       onUpdate();
//     } catch (err) {
//       alert("Failed to update lead");
//       console.error("Update failed:", err);
//     }
//   };

//   // Delete lead.
//   const handleDelete = async () => {
//     if (!lead._id) return;

//     try {
//       const res = await axios.delete(`${API_URL}/leads/${lead._id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         alert("Lead deleted successfully");
//         onUpdate();
//       } else {
//         alert("Failed to delete lead");
//         console.error("Backend error:", res.data);
//       }
//     } catch (err: any) {
//       alert("Failed to delete lead");
//       console.error("Delete error:", err.response?.data || err.message);
//     }
//   };

//   const renderDatePicker = (
//     value: string | undefined,
//     onChange: (value: string) => void
//   ) => (
//     <CommonDatePicker
//       placeholder="dd/mm/yyyy"
//       format="DD/MM/YYYY"
//       value={value ? dayjs(value) : null}
//       disabledDate={disableFutureAndOldDates}
//       onChange={(date: any) => onChange(date ? date.format("YYYY-MM-DD") : "")}
//     />
//   );

//   return (
//     <>
//       {/* Add lead */}
//       <div
//         className="offcanvas offcanvas-end offcanvas-large"
//         tabIndex={-1}
//         id="offcanvas_add"
//       >
//         <div className="offcanvas-header border-bottom">
//           <h5 className="mb-0">Add New Lead</h5>
//           <button
//             type="button"
//             className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           />
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div
//             className="offcanvas-body"
//             style={{ maxHeight: "650px", overflowY: "auto" }}
//           >
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Lead Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   name="name"
//                   value={formData.name || ""}
//                   onChange={handleInputChange}
//                   onBlur={handleNameBlur}
//                   className="form-control"
//                   placeholder="Enter Lead Name"
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Phone <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   name="phone"
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   pattern="[0-9]{10}"
//                   placeholder="10-digit phone number"
//                   value={formData.phone || ""}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Email</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formData.email || ""}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   placeholder="Email address"
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Graduate</label>
//                 <TypeableDropdown
//                   name="graduate"
//                   value={formData.graduate || ""}
//                   onChange={handleSelectChange}
//                   options={GRADUATES}
//                   placeholder="Select or type graduate"
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">College Name</label>
//                 <TypeableDropdown
//                   name="collegename"
//                   value={formData.collegename || ""}
//                   onChange={handleSelectChange}
//                   options={COLLEGES}
//                   placeholder="Select or type college name"
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">College Register ID</label>
//                 <input
//                   name="collegeRegisterId"
//                   value={formData.collegeRegisterId || ""}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   placeholder="Enter College Register ID"
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Category <span className="text-danger">*</span>
//                 </label>
//                 <TypeableDropdown
//                   name="category"
//                   value={formData.category || ""}
//                   onChange={handleSelectChange}
//                   options={CATEGORYS}
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Lead Source <span className="text-danger">*</span>
//                 </label>
//                 <TypeableDropdown
//                   name="leadsource"
//                   value={formData.leadsource}
//                   onChange={handleSelectChange}
//                   options={SOURCES}
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Domain <span className="text-danger">*</span>
//                 </label>
//                 <TypeableDropdown
//                   name="domain"
//                   value={formData.domain || ""}
//                   onChange={handleSelectChange}
//                   options={DOMAINS}
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <label className="form-label">
//                     Lead Status <span className="text-danger">*</span>
//                   </label>
//                   <Link
//                     to="#"
//                     className="label-add link-primary"
//                     data-bs-toggle="offcanvas"
//                     data-bs-target="#offcanvas_pipeline"
//                   >
//                     <i className="ti ti-plus me-1" />
//                     Add New
//                   </Link>
//                 </div>
//                 <CommonSelect
//                   name="leadstatus"
//                   value={formData.leadstatus || "New Lead"}
//                   onChange={handleSelectChange}
//                   options={leadStatusOptions}
//                   className="select"
//                   defaultValue={
//                     leadStatusOptions.find(
//                       (option) => option.value === "New Lead"
//                     ) || Leadstatus[0]
//                   }
//                 />
//               </div>

//               {[
//                 "Follow-Up 1",
//                 "Follow-Up 2",
//                 "Follow-Up 3",
//               ].includes(formData.leadstatus || "") && (
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Follow-Up Date <span className="text-danger">*</span>
//                   </label>
//                   {renderDatePicker(formData.followdate, (value) =>
//                     setFormData((prev) => ({ ...prev, followdate: value }))
//                   )}
//                 </div>
//               )}

//               {formData.domain === "Others" && (
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Enter Domain Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     name="domainreason"
//                     value={formData.domainreason || ""}
//                     onChange={handleInputChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//               )}

//               {formData.leadstatus === "Drop Out" && (
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Enter Drop Reason <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     name="dropreason"
//                     value={formData.dropreason || ""}
//                     onChange={handleInputChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//               )}

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">
//                   Program Looking For <span className="text-danger">*</span>
//                 </label>
//                 <TypeableDropdown
//                   name="lookingfor"
//                   value={formData.lookingfor || ""}
//                   onChange={handleSelectChange}
//                   options={PROGRAM_TYPES}
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Location</label>
//                 <TypeableDropdown
//                   name="location"
//                   value={formData.location || ""}
//                   onChange={handleSelectChange}
//                   options={DISTRICTS}
//                   placeholder="Select or type location"
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Remarks</label>
//                 <input
//                   name="remark"
//                   value={formData.remark || ""}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   placeholder="Remarks"
//                 />
//               </div>

//               {[
//                 "Project with Internship",
//                 "Internship",
//               ].includes(formData.lookingfor || "") && (
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Internship Duration <span className="text-danger">*</span>
//                   </label>
//  <TypeableDropdown
//   name="internshipduration"
//   value={formData.internshipduration || ""} // leads -> formData
//   onChange={(name, value) => handleselectchange(name, value, "add")}
//   options={Internshipduration}
//   required
// />

//                 </div>
//               )}

//               {formData.leadstatus === "Demo Scheduled" && (
//                 <>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Assign From <span className="text-danger">*</span>
//                     </label>
//                     <CommonSelect
//                       name="assignfrom"
//                       value={formData.assignfrom || ""}
//                       onChange={handleSelectChange}
//                       options={userList}
//                       className="select"
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Assign To <span className="text-danger">*</span>
//                     </label>
//                     <CommonSelect
//                       name="assignto"
//                       value={formData.assignto || ""}
//                       onChange={handleSelectChange}
//                       options={userList}
//                       className="select"
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Demo Date <span className="text-danger">*</span>
//                     </label>
//                     {renderDatePicker(formData.demodate, (value) =>
//                       setFormData((prev) => ({ ...prev, demodate: value }))
//                     )}
//                   </div>
//                 </>
//               )}

//               {formData.leadstatus === "Student" && (
//                 <>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Trainer <span className="text-danger">*</span>
//                     </label>
//                     <CommonSelect
//                       name="assignto"
//                       value={formData.assignto || ""}
//                       onChange={handleSelectChange}
//                       options={userList}
//                       className="select"
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Date of Joining <span className="text-danger">*</span>
//                     </label>
//                     {renderDatePicker(formData.dateofjoin, (value) =>
//                       setFormData((prev) => ({ ...prev, dateofjoin: value }))
//                     )}
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Fees <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       name="fees"
//                       value={formData.fees || ""}
//                       onChange={handleInputChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Fee Paid <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       name="feepaid"
//                       value={formData.feepaid || ""}
//                       onChange={handleInputChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Pending Fees</label>
//                     <input
//                       name="pendingfee"
//                       value={formData.pendingfee || ""}
//                       disabled
//                       className="form-control"
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Fee Type <span className="text-danger">*</span>
//                     </label>
//                     <CommonSelect
//                       name="feetype"
//                       value={formData.feetype || ""}
//                       onChange={handleSelectChange}
//                       options={Feetype}
//                       className="select"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="d-flex align-items-center justify-content-end">
//               <button
//                 type="button"
//                 data-bs-dismiss="offcanvas"
//                 className="btn btn-light me-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Create New"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       <LeadStatus />

//       {/* Edit lead */}
//       <div
//         className="offcanvas offcanvas-end offcanvas-large"
//         tabIndex={-1}
//         id="offcanvas_edit"
//       >
//         <div className="offcanvas-header border-bottom">
//           <h5 className="mb-0">Edit Lead</h5>
//           <button
//             type="button"
//             className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           />
//         </div>

//         <div className="offcanvas-body">
//           {lead && (
//             <form onSubmit={handleSave}>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Lead Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     name="name"
//                     className="form-control"
//                     value={lead.name || ""}
//                     onChange={handlechange}
//                     onBlur={handleEditNameBlur}
//                     placeholder="Enter Lead Name"
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     name="email"
//                     type="email"
//                     className="form-control"
//                     value={lead.email || ""}
//                     onChange={handlechange}
//                     placeholder="Email address (optional)"
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Phone <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     name="phone"
//                     type="tel"
//                     inputMode="numeric"
//                     maxLength={10}
//                     pattern="[0-9]{10}"
//                     className="form-control"
//                     value={lead.phone || ""}
//                     onChange={handlechange}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Graduate</label>
//                   <TypeableDropdown
//                     name="graduate"
//                     value={lead.graduate || ""}
//                     onChange={handleselectchange}
//                     options={GRADUATES}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">College Name</label>
//                   <TypeableDropdown
//                     name="collegename"
//                     value={lead.collegename || ""}
//                     onChange={handleselectchange}
//                     options={COLLEGES}
//                     placeholder="Select or type college name"
//                   />
//                 </div>
// <div className="col-md-6 mb-3">
//   <label className="form-label">College Register ID</label>
//   <input
//     name="collegeRegisterId"
//     value={lead.collegeRegisterId ?? ""}
//     onChange={handlechange}
//     className="form-control"
//     placeholder="Enter College Register ID"
// />
// </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Category <span className="text-danger">*</span>
//                   </label>
//                   <TypeableDropdown
//                     name="category"
//                     value={lead.category || ""}
//                     onChange={handleselectchange}
//                     options={CATEGORYS}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Lead Status <span className="text-danger">*</span>
//                   </label>
//                   <CommonSelect
//                     name="leadstatus"
//                     value={lead.leadstatus || "New Lead"}
//                     onChange={handleselectchange}
//                     options={leadStatusOptions}
//                     className="select"
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Lead Source <span className="text-danger">*</span>
//                   </label>
//                   <TypeableDropdown
//                     name="leadsource"
//                     value={lead.leadsource}
//                     onChange={handleselectchange}
//                     options={SOURCES}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Domain <span className="text-danger">*</span>
//                   </label>
//                   <TypeableDropdown
//                     name="domain"
//                     value={lead.domain || ""}
//                     onChange={handleselectchange}
//                     options={DOMAINS}
//                     required
//                   />
//                 </div>

//                 {lead.domain === "Others" && (
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Enter Domain Name <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       name="domainreason"
//                       value={lead.domainreason || ""}
//                       onChange={handlechange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
//                 )}

//                 {lead.leadstatus === "Drop Out" && (
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Enter Drop Reason <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       name="dropreason"
//                       value={lead.dropreason || ""}
//                       onChange={handlechange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
//                 )}

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Program Looking For <span className="text-danger">*</span>
//                   </label>
//                   <TypeableDropdown
//                     name="lookingfor"
//                     value={lead.lookingfor || ""}
//                     onChange={handleselectchange}
//                     options={PROGRAM_TYPES}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Location</label>
//                   <TypeableDropdown
//                     name="location"
//                     value={lead.location || ""}
//                     onChange={handleselectchange}
//                     options={DISTRICTS}
//                     placeholder="Select or type location"
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Remarks</label>
//                   <input
//                     name="remark"
//                     value={lead.remark || ""}
//                     onChange={handlechange}
//                     className="form-control"
//                   />
//                 </div>

//                 {[
//                   "Project with Internship",
//                   "Internship",
//                 ].includes(lead.lookingfor || "") && (
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Internship Duration <span className="text-danger">*</span>
//                     </label>
// <TypeableDropdown
//   name="internshipduration"
//   value={lead.internshipduration || ""}
//   onChange={(name, value) => handleselectchange(name, value, "edit")}
//   options={Internshipduration}
//   required
// />
//                   </div>
//                 )}

//                 {lead.leadstatus === "Demo Scheduled" && (
//                   <>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Assign From <span className="text-danger">*</span>
//                       </label>
//                       <CommonSelect
//                         name="assignfrom"
//                         value={lead.assignfrom || ""}
//                         onChange={handleselectchange}
//                         options={userList}
//                         className="select"
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Assign To <span className="text-danger">*</span>
//                       </label>
//                       <CommonSelect
//                         name="assignto"
//                         value={lead.assignto || ""}
//                         onChange={handleselectchange}
//                         options={userList}
//                         className="select"
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Demo Date <span className="text-danger">*</span>
//                       </label>
//                       {renderDatePicker(lead.demodate, (value) =>
//                         setLead((prev) => ({ ...prev, demodate: value }))
//                       )}
//                     </div>
//                   </>
//                 )}

//                 {[
//                   "Follow-Up 1",
//                   "Follow-Up 2",
//                   "Follow-Up 3",
//                 ].includes(lead.leadstatus || "") && (
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">
//                       Follow-Up Date <span className="text-danger">*</span>
//                     </label>
//                     {renderDatePicker(lead.followdate, (value) =>
//                       setLead((prev) => ({ ...prev, followdate: value }))
//                     )}
//                   </div>
//                 )}

//                 {lead.leadstatus === "Student" && (
//                   <>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Trainer <span className="text-danger">*</span>
//                       </label>
//                       <CommonSelect
//                         name="assignto"
//                         value={lead.assignto || ""}
//                         onChange={handleselectchange}
//                         options={userList}
//                         className="select"
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Date of Joining <span className="text-danger">*</span>
//                       </label>
//                       {renderDatePicker(lead.dateofjoin, (value) =>
//                         setLead((prev) => ({ ...prev, dateofjoin: value }))
//                       )}
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Fees <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         name="fees"
//                         value={lead.fees || ""}
//                         onChange={handlechange}
//                         className="form-control"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Fee Paid <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         name="feepaid"
//                         value={lead.feepaid || ""}
//                         onChange={handlechange}
//                         className="form-control"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Pending Fees</label>
//                       <input
//                         name="pendingfee"
//                         value={lead.pendingfee || ""}
//                         disabled
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">
//                         Fee Type <span className="text-danger">*</span>
//                       </label>
//                       <CommonSelect
//                         name="feetype"
//                         value={lead.feetype || ""}
//                         onChange={handleselectchange}
//                         options={Feetype}
//                         className="select"
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="d-flex align-items-center justify-content-end">
//                 <button
//                   type="button"
//                   data-bs-dismiss="offcanvas"
//                   className="btn btn-light me-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   data-bs-dismiss="offcanvas"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Success modal */}
//       <div className="modal fade" id="create_success">
//         <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
//           <div className="modal-content rounded-0">
//             <div className="modal-body p-4 text-center position-relative">
//               <div className="mb-3 position-relative z-1">
//                 <span className="avatar avatar-xl badge-soft-info border-0 text-info rounded-circle">
//                   <i className="ti ti-building-skyscraper fs-24" />
//                 </span>
//               </div>
//               <h5 className="mb-1">✅ Lead Created Successfully!!!</h5>
//               <p className="mb-3">View the details of lead, created</p>
//               <div className="d-flex justify-content-center">
//                 <Link
//                   to="#"
//                   className="btn btn-light position-relative z-1 me-2 w-100"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </Link>
//                 <Link
//                   to={all_routes.leadsDetails}
//                   className="btn btn-primary position-relative z-1 w-100"
//                 >
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete modal */}
//       <div className="modal fade" id="delete_lead">
//         <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
//           <div className="modal-content rounded-0">
//             <div className="modal-body p-4 text-center position-relative">
//               <div className="mb-3 position-relative z-1">
//                 <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
//                   <i className="ti ti-trash fs-24" />
//                 </span>
//               </div>
//               <h5 className="mb-1">Delete Confirmation</h5>
//               <p className="mb-3">
//                 Are you sure you want to remove leads you selected.
//               </p>
//               <div className="d-flex justify-content-center">
//                 <Link
//                   to="#"
//                   className="btn btn-light position-relative z-1 me-2 w-100"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </Link>
//                 <Link
//                   to="#"
//                   className="btn btn-primary position-relative z-1 w-100"
//                   data-bs-dismiss="modal"
//                   onClick={handleDelete}
//                 >
//                   Yes, Delete
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <LeadStatus />
//     </>
//   );
// };

// export default ModalLeads;


import { Link } from "react-router";
import { all_routes } from "../../../../../routes/all_routes";
import {
  CATEGORYS,
  Leadstatus,
  Internshipduration,
  Feetype,
  COLLEGES,
  DISTRICTS,
  GRADUATES,
  DOMAINS,
  SOURCES,
  PROGRAM_TYPES
} from "../../../../../core/json/selectOption";
import CommonSelect from "../../../../../components/common-select/commonSelect";
import CommonDatePicker from "../../../../../components/common-datePicker/commonDatePicker";
import { useState, useEffect } from "react";
import { createLead } from "../../../../../api/leadApi";
import axios from "axios";
import LeadStatus from "./LeadStatus";
import dayjs from "dayjs";
import API_URL from "../../../../../api/apiconfig";

// Connect these arrays to your existing college and location lists.
// The fields remain usable even if these arrays are empty.


interface SelectOption {
  label: string;
  value: string;
}

interface Lead {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  leadstatus?: string;
  leadsource?: string;
  collegename?: string;
  collegeRegisterId?: string;
  category?: string;
  location?: string;
  domain?: string;
  assignfrom?: string;
  assignto?: string;
  graduate?: string;
  followdate?: string;
  demodate?: string;
  lookingfor?: string;
  internshipduration?: string;
  dropreason?: string;
  remark?: string;
  domainreason?: string;
  dateofjoin?: string;
  fees?: string;
  feetype?: string;
  feepaid?: string;
  pendingfee?: string;
  noofday?: string;
}

interface ModalLeadsProps {
  selectedLead: Lead | null;
  actionType: "edit" | "delete" | null;
  onUpdate: () => void;
}

interface TypeableDropdownProps {
  name: string;
  value: string;
  options: any[];
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
}

// Accepts existing option arrays and stores the selected/typed value as a string.
const TypeableDropdown: React.FC<TypeableDropdownProps> = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  required = false,
}) => {
  const listId = `options-${name}`;

  const optionValues = (options || [])
    .map((option: any) => {
      if (typeof option === "string") return option;
      return option?.value ?? option?.label ?? option?.name ?? "";
    })
    .filter((option: string) => option !== "")
    .map(String);

  return (
    <>
      <input
        type="text"
        name={name}
        list={listId}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        className="form-control"
        placeholder={placeholder || "Select or type"}
        required={required}
        autoComplete="off"
      />
      <datalist id={listId}>
        {optionValues.map((option, index) => (
          <option key={`${name}-${index}`} value={option} />
        ))}
      </datalist>
    </>
  );
};

const initialLeadState: Lead = {
  name: "",
  phone: "",
  email: "",
  collegename: "",
  collegeRegisterId: "",
  location: "",
  category: "",
  leadsource: "",
  leadstatus: "New Lead",
  domain: "",
  assignfrom: "",
  assignto: "",
  graduate: "",
  followdate: "",
  demodate: "",
  lookingfor: "",
  internshipduration: "",
  dropreason: "",
  domainreason: "",
  remark: "",
  dateofjoin: "",
  fees: "",
  feepaid: "",
  feetype: "",
  pendingfee: "",
  noofday: "",
};

const formatName = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");

const validEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ModalLeads: React.FC<ModalLeadsProps> = ({
  selectedLead,
  actionType: _actionType = null,
  onUpdate,
}) => {
  const disableFutureAndOldDates = (current: dayjs.Dayjs) =>
    current.isBefore(dayjs().startOf("day"));

  const [leadStatusOptions, setLeadStatusOptions] = useState<SelectOption[]>(
    []
  );
  const [lead, setLead] = useState<Lead>({ ...initialLeadState });
  const [formData, setFormData] = useState<Lead>({ ...initialLeadState });
  const [userList, setUserList] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch statuses from the backend.
  useEffect(() => {
    const fetchLeadStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/leadstatus`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted: SelectOption[] = res.data.map((item: any) => ({
          value: String(item.name),
          label: String(item.name),
        }));

        setLeadStatusOptions(formatted);
      } catch (err) {
        console.error("Error fetching lead statuses", err);
      }
    };

    fetchLeadStatuses();
  }, []);

  // Fetch users for assignment/trainer dropdowns.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/users/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserList(
          res.data.map((user: any) => ({
            label: user.name,
            value: user._id,
          }))
        );
      } catch (err: any) {
        console.error("Failed to load users:", err.response?.data || err);
      }
    };

    fetchUsers();
  }, []);

  // Keep existing string values in the edit form, including assigned users.
  // useEffect(() => {
  //   if (!selectedLead) return;

  //   const fees = Number(selectedLead.fees) || 0;
  //   const feepaid = Number(selectedLead.feepaid) || 0;

  //   setLead({
  //     ...initialLeadState,
  //     ...selectedLead,
  //     name: selectedLead.name || "",
  //     phone: selectedLead.phone || "",
  //     email: selectedLead.email || "",
  //     collegename: selectedLead.collegename || "",
  //     collegeRegisterId: selectedLead.collegeRegisterId || "",
  //     location: selectedLead.location || "",
  //     leadsource: selectedLead.leadsource,
  //     leadstatus: selectedLead.leadstatus || "New Lead",
  //     remark: selectedLead.remark || "",
  //     demodate: selectedLead.demodate
  //       ? selectedLead.demodate.split("T")[0]
  //       : "",
  //     followdate: selectedLead.followdate
  //       ? selectedLead.followdate.split("T")[0]
  //       : "",
  //     dateofjoin: selectedLead.dateofjoin
  //       ? selectedLead.dateofjoin.split("T")[0]
  //       : "",
  //     fees: fees.toString(),
  //     feepaid: feepaid.toString(),
  //     pendingfee: Math.max(fees - feepaid, 0).toString(),
  //     feetype: selectedLead.feetype || "",
  //   });
  // }, [selectedLead]);
// Load selected lead into the Edit form.

useEffect(() => {
  if (!selectedLead?._id) return;

  let cancelled = false;

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/leads/${selectedLead._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (cancelled) return;

      const fullLead = res.data.lead ?? selectedLead;

      console.log("Full lead data:", fullLead);
      console.log(
        "College Register ID:",
        fullLead.collegeRegisterId
      );

      const fees = Number(fullLead.fees) || 0;
      const feepaid = Number(fullLead.feepaid) || 0;

      setLead({
        ...initialLeadState,
        ...fullLead,

        name: fullLead.name || "",
        phone: fullLead.phone || "",
        email: fullLead.email || "",
        collegename: fullLead.collegename || "",

        collegeRegisterId: String(
          fullLead.collegeRegisterId ?? ""
        ),

        location: fullLead.location || "",
        leadsource: fullLead.leadsource || "",
        leadstatus: fullLead.leadstatus || "New Lead",
        remark: fullLead.remark || "",

        demodate: fullLead.demodate
          ? fullLead.demodate.split("T")[0]
          : "",

        followdate: fullLead.followdate
          ? fullLead.followdate.split("T")[0]
          : "",

        dateofjoin: fullLead.dateofjoin
          ? fullLead.dateofjoin.split("T")[0]
          : "",

        fees: fees.toString(),
        feepaid: feepaid.toString(),
        pendingfee: Math.max(fees - feepaid, 0).toString(),
        feetype: fullLead.feetype || "",
      });
    } catch (error) {
      console.error("Failed to fetch full lead details:", error);
    }
  };

  fetchLeadDetails();

  return () => {
    cancelled = true;
  };
}, [selectedLead?._id]);

  // Resolve previously populated user names to IDs when needed.
  useEffect(() => {
    if (!userList.length) return;

    setLead((prev) => {
      const assignedTo = userList.find(
        (user) => user.label === prev.assignto
      );
      const assignedFrom = userList.find(
        (user) => user.label === prev.assignfrom
      );

      const nextAssignTo = assignedTo?.value || prev.assignto;
      const nextAssignFrom = assignedFrom?.value || prev.assignfrom;

      if (
        nextAssignTo === prev.assignto &&
        nextAssignFrom === prev.assignfrom
      ) {
        return prev;
      }

      return {
        ...prev,
        assignto: nextAssignTo,
        assignfrom: nextAssignFrom,
      };
    });
  }, [userList]);

  // Calculate pending fees for the create form.
  useEffect(() => {
    const fees = Number(formData.fees) || 0;
    const feepaid = Number(formData.feepaid) || 0;
    const pending = Math.max(fees - feepaid, 0);

    setFormData((prev) =>
      prev.pendingfee === pending.toString()
        ? prev
        : { ...prev, pendingfee: pending.toString() }
    );
  }, [formData.fees, formData.feepaid]);

  // Calculate pending fees for the edit form.
  useEffect(() => {
    const fees = Number(lead.fees) || 0;
    const feepaid = Number(lead.feepaid) || 0;
    const pending = Math.max(fees - feepaid, 0);

    setLead((prev) =>
      prev.pendingfee === pending.toString()
        ? prev
        : { ...prev, pendingfee: pending.toString() }
    );
  }, [lead.fees, lead.feepaid]);

  // Shared validation for required fields and existing conditional fields.
  const validateLead = (data: Lead) => {
    const alwaysOptional = [
  "email",
  "collegename",
  "collegeRegisterId",
  "location",
  "remark",
  "pendingfee",
  "noofday",
  "dropreason",
  "domainreason",
  "followdate",
  "demodate",
  "dateofjoin",
  "fees",
  "feepaid",
  "feetype",
  "assignfrom",
  "assignto",
  "internshipduration",
  "notes",
  "joinstatus",
  "createdBy",
  'razorpaySignature', 
  'paidAt',
  'groupInternshipId'
];

    const isDemoScheduled = data.leadstatus === "Demo Scheduled";
    const isStudent = data.leadstatus === "Student";
    const isInternship =
      data.lookingfor === "Internship" ||
      data.lookingfor === "Project with Internship";
    const isFollowUp = [
      "Follow-Up 1",
      "Follow-Up 2",
      "Follow-Up 3",
    ].includes(data.leadstatus || "");
    const isDropOut = data.leadstatus === "Drop Out";
    const isDomainOthers = data.domain === "Others";

    const conditionalOptional = [
      ...(isDemoScheduled ? [] : ["assignfrom", "assignto", "demodate"]),
      ...(isStudent ? [] : ["assignto", "fees", "feepaid", "feetype", "dateofjoin"]),
      ...(isInternship ? [] : ["internshipduration"]),
      ...(isFollowUp ? [] : ["followdate"]),
      ...(isDropOut ? [] : ["dropreason"]),
      ...(isDomainOthers ? [] : ["domainreason"]),
    ];

    const ignored = new Set([...alwaysOptional, ...conditionalOptional]);

    const emptyFields = Object.entries(data).filter(
      ([key, value]) =>
        !ignored.has(key) &&
        (value === undefined ||
          value === null ||
          String(value).trim() === "")
    );

    if (emptyFields.length) {
      alert(
        `Please fill required fields: ${emptyFields
          .map(([key]) => key)
          .join(", ")}`
      );
      return false;
    }

    if (!data.name?.trim()) {
      alert("Please enter the lead name.");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(data.name.trim())) {
      alert("Lead name must contain only English letters and spaces.");
      return false;
    }

    if (!/^\d{10}$/.test(data.phone || "")) {
      alert("Phone number must contain exactly 10 digits.");
      return false;
    }

    if (data.email?.trim() && !validEmail(data.email.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (data.leadstatus === "Demo Scheduled") {
      if (!data.assignfrom || !data.assignto || !data.demodate) {
        alert("Please select Assign From, Assign To, and Demo Date.");
        return false;
      }
    }

    if (data.leadstatus === "Student") {
      const missingStudentFields = [
        ["assignto", data.assignto],
        ["fees", data.fees],
        ["feepaid", data.feepaid],
        ["feetype", data.feetype],
        ["dateofjoin", data.dateofjoin],
      ].filter(([, value]) => !value || !String(value).trim());

      if (missingStudentFields.length) {
        alert("Please complete all required Student fields.");
        return false;
      }

      if ((Number(data.feepaid) || 0) > (Number(data.fees) || 0)) {
        alert("Fee paid cannot be greater than total fees.");
        return false;
      }
    }

    if (isInternship && !data.internshipduration) {
      alert("Please select the internship duration.");
      return false;
    }

    if (isFollowUp && !data.followdate) {
      alert("Please select the follow-up date.");
      return false;
    }

    if (isDropOut && !data.dropreason?.trim()) {
      alert("Please enter the drop reason.");
      return false;
    }

    if (isDomainOthers && !data.domainreason?.trim()) {
      alert("Please enter the domain name.");
      return false;
    }

    return true;
  };

  const validateForm = () => validateLead(formData);
  const editvalidateform = () => validateLead(lead);

  // Create form input handler.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    if (
      ["fees", "feepaid", "pendingfee"].includes(name) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    if (name === "name" && !/^[A-Za-z ]*$/.test(value)) {
      return;
    }

    if (
      name === "feepaid" &&
      Number(value) > (Number(formData.fees) || 0)
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit form input handler.
  const handlechange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    if (
      ["fees", "feepaid", "pendingfee"].includes(name) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    if (name === "name" && !/^[A-Za-z ]*$/.test(value)) {
      return;
    }

    if (name === "feepaid" && Number(value) > (Number(lead.fees) || 0)) {
      return;
    }

    setLead((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "internshipduration" ? { noofday: value } : {}),
    }));
  };

  const handleselectchange = (name: string, value: string) => {
    setLead((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "internshipduration" ? { noofday: value } : {}),
    }));
  };



  const handleNameBlur = () => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name ? formatName(prev.name) : "",
    }));
  };

  const handleEditNameBlur = () => {
    setLead((prev) => ({
      ...prev,
      name: prev.name ? formatName(prev.name) : "",
    }));
  };

  // Create lead.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData: Lead = {
      ...formData,
      name: formData.name ? formatName(formData.name) : "",
      email: formData.email?.trim() || "",
      leadsource: formData.leadsource,
      leadstatus: formData.leadstatus || "New Lead",
    };

    if (!validateLead(formattedData)) return;

    setLoading(true);

    try {
      const res = await createLead(formattedData);

      if (res.success) {
        alert("✅ Lead stored successfully!");
        onUpdate();
        setFormData({ ...initialLeadState });
      } else {
        alert("Failed to store lead: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Frontend error creating lead:", err);
      alert("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Save edited lead.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedLead: Lead = {
      ...lead,
      name: lead.name ? formatName(lead.name) : "",
      email: lead.email?.trim() || "",
      leadsource: lead.leadsource,
      leadstatus: lead.leadstatus || "New Lead",
    };

    if (!validateLead(formattedLead)) return;
    if (!formattedLead._id) return;

    try {
      const token = localStorage.getItem("token");

      const payload: any = {
        ...formattedLead,
        remark: formattedLead.remark || "New Lead Added",
        demodate: formattedLead.demodate || null,
        followdate: formattedLead.followdate || null,
        dateofjoin: formattedLead.dateofjoin || null,
      };

      const needsAssign =
        payload.leadstatus === "Demo Scheduled" ||
        payload.leadstatus === "Student";

      if (!needsAssign) {
        delete payload.assignfrom;
        delete payload.assignto;
      } else {
        if (!payload.assignfrom || payload.assignfrom === "N/A") {
          delete payload.assignfrom;
        }
        if (!payload.assignto || payload.assignto === "N/A") {
          delete payload.assignto;
        }
      }

      await axios.put(`${API_URL}/leads/${formattedLead._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLead(formattedLead);
      alert("✅ Lead updated successfully");
      onUpdate();
    } catch (err) {
      alert("Failed to update lead");
      console.error("Update failed:", err);
    }
  };

  // Delete lead.
  const handleDelete = async () => {
    if (!lead._id) return;

    try {
      const res = await axios.delete(`${API_URL}/leads/${lead._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        alert("Lead deleted successfully");
        onUpdate();
      } else {
        alert("Failed to delete lead");
        console.error("Backend error:", res.data);
      }
    } catch (err: any) {
      alert("Failed to delete lead");
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const renderDatePicker = (
    value: string | undefined,
    onChange: (value: string) => void
  ) => (
    <CommonDatePicker
      placeholder="dd/mm/yyyy"
      format="DD/MM/YYYY"
      value={value ? dayjs(value) : null}
      disabledDate={disableFutureAndOldDates}
      onChange={(date: any) => onChange(date ? date.format("YYYY-MM-DD") : "")}
    />
  );

  return (
    <>
      {/* Add lead */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Lead</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="offcanvas-body"
            style={{ maxHeight: "650px", overflowY: "auto" }}
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Lead Name <span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  onBlur={handleNameBlur}
                  className="form-control"
                  placeholder="Enter Lead Name"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10-digit phone number"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Email address"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Graduate</label>
                <TypeableDropdown
                  name="graduate"
                  value={formData.graduate || ""}
                  onChange={handleSelectChange}
                  options={GRADUATES}
                  placeholder="Select or type graduate"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">College Name</label>
                <TypeableDropdown
                  name="collegename"
                  value={formData.collegename || ""}
                  onChange={handleSelectChange}
                  options={COLLEGES}
                  placeholder="Select or type college name"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">College Register ID</label>
                <input
                  name="collegeRegisterId"
                  value={formData.collegeRegisterId || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter College Register ID"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <TypeableDropdown
                  name="category"
                  value={formData.category || ""}
                  onChange={handleSelectChange}
                  options={CATEGORYS}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Lead Source <span className="text-danger">*</span>
                </label>
                <TypeableDropdown
                  name="leadsource"
                  value={formData.leadsource}
                  onChange={handleSelectChange}
                  options={SOURCES}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Domain <span className="text-danger">*</span>
                </label>
                <TypeableDropdown
                  name="domain"
                  value={formData.domain || ""}
                  onChange={handleSelectChange}
                  options={DOMAINS}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label">
                    Lead Status <span className="text-danger">*</span>
                  </label>
                  <Link
                    to="#"
                    className="label-add link-primary"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvas_pipeline"
                  >
                    <i className="ti ti-plus me-1" />
                    Add New
                  </Link>
                </div>
                <CommonSelect
                  name="leadstatus"
                  value={formData.leadstatus || "New Lead"}
                  onChange={handleSelectChange}
                  options={leadStatusOptions}
                  className="select"
                  defaultValue={
                    leadStatusOptions.find(
                      (option) => option.value === "New Lead"
                    ) || Leadstatus[0]
                  }
                />
              </div>

              {[
                "Follow-Up 1",
                "Follow-Up 2",
                "Follow-Up 3",
              ].includes(formData.leadstatus || "") && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Follow-Up Date <span className="text-danger">*</span>
                  </label>
                  {renderDatePicker(formData.followdate, (value) =>
                    setFormData((prev) => ({ ...prev, followdate: value }))
                  )}
                </div>
              )}

              {formData.domain === "Others" && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Enter Domain Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="domainreason"
                    value={formData.domainreason || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              )}

              {formData.leadstatus === "Drop Out" && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Enter Drop Reason <span className="text-danger">*</span>
                  </label>
                  <input
                    name="dropreason"
                    value={formData.dropreason || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              )}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Program Looking For <span className="text-danger">*</span>
                </label>
                <TypeableDropdown
                  name="lookingfor"
                  value={formData.lookingfor || ""}
                  onChange={handleSelectChange}
                  options={PROGRAM_TYPES}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <TypeableDropdown
                  name="location"
                  value={formData.location || ""}
                  onChange={handleSelectChange}
                  options={DISTRICTS}
                  placeholder="Select or type location"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Remarks</label>
                <input
                  name="remark"
                  value={formData.remark || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Remarks"
                />
              </div>

              {[
                "Project with Internship",
                "Internship",
              ].includes(formData.lookingfor || "") && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Internship Duration <span className="text-danger">*</span>
                  </label>
<TypeableDropdown
  name="internshipduration"
  value={formData.internshipduration || ""}
  onChange={handleSelectChange}
  options={Internshipduration}
  required
/>

                </div>
              )}

              {formData.leadstatus === "Demo Scheduled" && (
                <>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Assign From <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="assignfrom"
                      value={formData.assignfrom || ""}
                      onChange={handleSelectChange}
                      options={userList}
                      className="select"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Assign To <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="assignto"
                      value={formData.assignto || ""}
                      onChange={handleSelectChange}
                      options={userList}
                      className="select"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Demo Date <span className="text-danger">*</span>
                    </label>
                    {renderDatePicker(formData.demodate, (value) =>
                      setFormData((prev) => ({ ...prev, demodate: value }))
                    )}
                  </div>
                </>
              )}

              {formData.leadstatus === "Student" && (
                <>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Trainer <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="assignto"
                      value={formData.assignto || ""}
                      onChange={handleSelectChange}
                      options={userList}
                      className="select"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Date of Joining <span className="text-danger">*</span>
                    </label>
                    {renderDatePicker(formData.dateofjoin, (value) =>
                      setFormData((prev) => ({ ...prev, dateofjoin: value }))
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Fees <span className="text-danger">*</span>
                    </label>
                    <input
                      name="fees"
                      value={formData.fees || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Fee Paid <span className="text-danger">*</span>
                    </label>
                    <input
                      name="feepaid"
                      value={formData.feepaid || ""}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pending Fees</label>
                    <input
                      name="pendingfee"
                      value={formData.pendingfee || ""}
                      disabled
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Fee Type <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="feetype"
                      value={formData.feetype || ""}
                      onChange={handleSelectChange}
                      options={Feetype}
                      className="select"
                    />
                  </div>
                </>
              )}
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
                disabled={loading}
              >
                {loading ? "Saving..." : "Create New"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <LeadStatus />

      {/* Edit lead */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_edit"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Edit Lead</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body">
          {lead && (
            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Lead Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="name"
                    className="form-control"
                    value={lead.name || ""}
                    onChange={handlechange}
                    onBlur={handleEditNameBlur}
                    placeholder="Enter Lead Name"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={lead.email || ""}
                    onChange={handlechange}
                    placeholder="Email address (optional)"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="form-control"
                    value={lead.phone || ""}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Graduate</label>
                  <TypeableDropdown
                    name="graduate"
                    value={lead.graduate || ""}
                    onChange={handleselectchange}
                    options={GRADUATES}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">College Name</label>
                  <TypeableDropdown
                    name="collegename"
                    value={lead.collegename || ""}
                    onChange={handleselectchange}
                    options={COLLEGES}
                    placeholder="Select or type college name"
                  />
                </div>
<div className="col-md-6 mb-3">
  <label className="form-label">College Register ID</label>
  <input
    name="collegeRegisterId"
    value={lead.collegeRegisterId ?? ""}
    onChange={handlechange}
    className="form-control"
    placeholder="Enter College Register ID"
/>
</div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <TypeableDropdown
                    name="category"
                    value={lead.category || ""}
                    onChange={handleselectchange}
                    options={CATEGORYS}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Lead Status <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="leadstatus"
                    value={lead.leadstatus || "New Lead"}
                    onChange={handleselectchange}
                    options={leadStatusOptions}
                    className="select"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Lead Source <span className="text-danger">*</span>
                  </label>
                  <TypeableDropdown
                    name="leadsource"
                    value={lead.leadsource}
                    onChange={handleselectchange}
                    options={SOURCES}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Domain <span className="text-danger">*</span>
                  </label>
                  <TypeableDropdown
                    name="domain"
                    value={lead.domain || ""}
                    onChange={handleselectchange}
                    options={DOMAINS}
                    required
                  />
                </div>

                {lead.domain === "Others" && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Enter Domain Name <span className="text-danger">*</span>
                    </label>
                    <input
                      name="domainreason"
                      value={lead.domainreason || ""}
                      onChange={handlechange}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                {lead.leadstatus === "Drop Out" && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Enter Drop Reason <span className="text-danger">*</span>
                    </label>
                    <input
                      name="dropreason"
                      value={lead.dropreason || ""}
                      onChange={handlechange}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Program Looking For <span className="text-danger">*</span>
                  </label>
                  <TypeableDropdown
                    name="lookingfor"
                    value={lead.lookingfor || ""}
                    onChange={handleselectchange}
                    options={PROGRAM_TYPES}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Location</label>
                  <TypeableDropdown
                    name="location"
                    value={lead.location || ""}
                    onChange={handleselectchange}
                    options={DISTRICTS}
                    placeholder="Select or type location"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Remarks</label>
                  <input
                    name="remark"
                    value={lead.remark || ""}
                    onChange={handlechange}
                    className="form-control"
                  />
                </div>

                {[
                  "Project with Internship",
                  "Internship",
                ].includes(lead.lookingfor || "") && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Internship Duration <span className="text-danger">*</span>
                    </label>
<TypeableDropdown
  name="internshipduration"
  value={lead.internshipduration || ""}
  onChange={handleselectchange}
  options={Internshipduration}
  required
/>

                  </div>
                )}

                {lead.leadstatus === "Demo Scheduled" && (
                  <>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Assign From <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="assignfrom"
                        value={lead.assignfrom || ""}
                        onChange={handleselectchange}
                        options={userList}
                        className="select"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Assign To <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="assignto"
                        value={lead.assignto || ""}
                        onChange={handleselectchange}
                        options={userList}
                        className="select"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Demo Date <span className="text-danger">*</span>
                      </label>
                      {renderDatePicker(lead.demodate, (value) =>
                        setLead((prev) => ({ ...prev, demodate: value }))
                      )}
                    </div>
                  </>
                )}

                {[
                  "Follow-Up 1",
                  "Follow-Up 2",
                  "Follow-Up 3",
                ].includes(lead.leadstatus || "") && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Follow-Up Date <span className="text-danger">*</span>
                    </label>
                    {renderDatePicker(lead.followdate, (value) =>
                      setLead((prev) => ({ ...prev, followdate: value }))
                    )}
                  </div>
                )}

                {lead.leadstatus === "Student" && (
                  <>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Trainer <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="assignto"
                        value={lead.assignto || ""}
                        onChange={handleselectchange}
                        options={userList}
                        className="select"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Date of Joining <span className="text-danger">*</span>
                      </label>
                      {renderDatePicker(lead.dateofjoin, (value) =>
                        setLead((prev) => ({ ...prev, dateofjoin: value }))
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Fees <span className="text-danger">*</span>
                      </label>
                      <input
                        name="fees"
                        value={lead.fees || ""}
                        onChange={handlechange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Fee Paid <span className="text-danger">*</span>
                      </label>
                      <input
                        name="feepaid"
                        value={lead.feepaid || ""}
                        onChange={handlechange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Pending Fees</label>
                      <input
                        name="pendingfee"
                        value={lead.pendingfee || ""}
                        disabled
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Fee Type <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="feetype"
                        value={lead.feetype || ""}
                        onChange={handleselectchange}
                        options={Feetype}
                        className="select"
                      />
                    </div>
                  </>
                )}
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
                  data-bs-dismiss="offcanvas"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Success modal */}
      <div className="modal fade" id="create_success">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-info border-0 text-info rounded-circle">
                  <i className="ti ti-building-skyscraper fs-24" />
                </span>
              </div>
              <h5 className="mb-1">✅ Lead Created Successfully!!!</h5>
              <p className="mb-3">View the details of lead, created</p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to={all_routes.leadsDetails}
                  className="btn btn-primary position-relative z-1 w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <div className="modal fade" id="delete_lead">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove leads you selected.
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
                  onClick={handleDelete}
                >
                  Yes, Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadStatus />
    </>
  );
};

export default ModalLeads;
