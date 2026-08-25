import { Link } from "react-router";
import { all_routes } from "../../../../../routes/all_routes";
import {
  // Assign_From,
  // Assign_To,
  Categorys,
  Currency,
  Industry,
  Leadstatus,
  Source,
  Lookingfor,
  Internshipduration,
  Feetype,
} from "../../../../../core/json/selectOption";
import CommonSelect from "../../../../../components/common-select/commonSelect";
import CommonDatePicker from "../../../../../components/common-datePicker/commonDatePicker";
import { useState,useEffect} from "react";
import { createLead } from "../../../../../api/leadApi";
import axios from "axios";
import LeadStatus from "./LeadStatus";
import dayjs from "dayjs";
import API_URL from "../../../../../api/apiconfig";

interface Lead {
  _id?: string;
  name?: string;
  phone?: string;
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
  followdate?:string;
  demodate?:string;
  lookingfor?:string;
  internshipduration?:string;
  dropreason?:string;
  remark?:string;
  domainreason?:string;
  dateofjoin?:string;
  fees?:string;
  feetype?:string;
  feepaid?:string;
  pendingfee?:string;
  noofday?:string;
}

interface ModalLeadsProps {
  selectedLead: Lead | null;
  actionType: "edit" | "delete" | null;
  onUpdate: () => void;
}
const ModalLeads: React.FC<ModalLeadsProps> = ({
  selectedLead,
  actionType: _actionType = "",
  onUpdate, 
}) => {

  // const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // const handleChange = (value: string[]) => {
  //   setSelectedItems(value);
  // };

  //backend data store code

//    const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     collegename: "",
//     location: "",
//     category: "",
//     leadsource: "",
//     leadstatus: "",
//     domain: "",
//     assignfrom: "",
//     assignto: "",
//     graduate: "",
//   });

//    const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
  
// const validateForm = () => {
//     const newErrors: any = {};
//     Object.keys(formData).forEach((key) => {
//       if (!formData[key as keyof typeof formData]) {
//         newErrors[key] = "Please fill this field";
//       }
//     });
    
//     return Object.keys(newErrors).length === 0; // ✅ return true if no errors
//   };

//   // ✅ Handle text input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));   
//   };

//   // ✅ Handle select dropdowns
//   const handleSelectChange = (name: string, value: string) => {
//   setFormData((prev) => ({ ...prev, [name]: value }));
// };

  



const disableFutureAndOldDates = (current: dayjs.Dayjs) => {
  const today = dayjs().startOf("day");
  return current.isBefore(today);
};


  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
 const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    collegename: "",
    location: "",
    category: "",
    leadsource: "",
    leadstatus: "",
    domain: "",
    assignfrom: "",
    assignto: "",
    graduate: "",
    followdate: "",
    demodate: "",
    lookingfor:"",
    internshipduration:"",
    dropreason:"",
    domainreason:"",
    remark:"",
    dateofjoin:"",
    fees:"",
    feepaid:"",
    feetype:"",
    pendingfee:"",
    noofday:"",

  });
  const [userList, setUserList] = useState<any[]>([]); 

  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
const [formData, setFormData] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    collegename: "",
    location: "",
    category: "",
    leadsource: "",
    leadstatus: "",
    domain: "",
    assignfrom: "",
    assignto: "",
    graduate: "",
    followdate: "",
    demodate: "",
    lookingfor:"",
    internshipduration:"",
    dropreason:"",
    remark:"",
    domainreason:"",
    dateofjoin:"",
    fees:"",
    feepaid:"",
    feetype:"",
    pendingfee:"",
    noofday:"",
  });
  //Leadstaus option getting
useEffect(() => {
  const fetchLeadStatuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/leadstatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert backend data to dropdown-friendly format
      const formatted = res.data.map((item:any) => ({
        value: item.name,
        label: item.name,
      }));

      setLeadStatusOptions(formatted);
    } catch (err) {
      console.error("Error fetching lead statuses", err);
    }
  };

  fetchLeadStatuses();
}, []);
//all user display and fetching
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



//   
const validateForm = () => {
  // Always optional fields (base)
  const alwaysIgnore = [
    "email",
    "collegename","remark","pendingfee","noofday"
  ];

  // Conditions
  const isAssignmentRequired =
    formData.leadstatus === "Demo Scheduled" ;
 
  const isAssignmentstudent= formData.leadstatus === "Student";
  const isInternship =
    (formData.lookingfor === "Internship"||formData.lookingfor==="Project with Internship");

  const isDemoScheduled =
    formData.leadstatus === "Demo Scheduled";
  const isDomainReason= formData.domain ==="Others";
  const isDropReason=formData.leadstatus === "Drop Out";

  const isFollowUp =
    (formData.leadstatus === "Follow-Up 1"||formData.leadstatus === "Follow-Up 2" || formData.leadstatus === "Follow-Up 3");

  // Conditionally ignored fields
  const conditionalIgnore = [
    ...(isAssignmentRequired ? [] : ["assignto", "assignfrom"]),
    ...(isAssignmentstudent ?[] :["assignto","fees","feepaid","feetype","dateofjoin"]),
    ...(isInternship ? [] : ["internshipduration"]),
    ...(isDemoScheduled ? [] : ["demodate"]),
    ...(isFollowUp ? [] : ["followdate"]),
    ...(isDropReason?[]:["dropreason"]),
    ...(isDomainReason?[]:["domainreason"])
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
     if (name === "phone") {
    if (!/^\d*$/.test(value)) return; // ❌ block letters/symbols
    if (value.length > 10) return;    // ❌ block >10 digits
  }

     if (name === "fees" || name==="feepaid" || name==="pendingfee") {
    if (!/^\d*$/.test(value)) return; // ❌ block letters/symbols
  }
  if (name === "feepaid") {
    const paid = Number(value);
    const fees = Number(formData.fees) || 0;

    if (paid > fees) {
      return; // ❌ block input
    }
  }

  // 👤 NAME – allow only letters & spaces
  if (name === "name" || name === "collegename") {
    if (!/^[A-Za-z ]*$/.test(value)) return; // ❌ block numbers/symbols
  }
    setFormData((prev) => ({ ...prev, [name]: value }));
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

useEffect(() => {
  const fees = Number(formData.fees) || 0;
  const feepaid = Number(formData.feepaid) || 0;

  // ❌ If fee paid is greater than fees, reset feepaid
  if (feepaid > fees) {
    setFormData((prev) => ({
      ...prev,
      feepaid: fees.toString(),   // clamp to max fees
      pendingfee: "0",
    }));
    return;
  }

  const pending = fees - feepaid;

  setFormData((prev) => ({
    ...prev,
    pendingfee: pending.toString(),
  }));
}, [formData.fees, formData.feepaid]);



  // ✅ Submit form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);
  try {
    const res = await createLead(formData);
    if (res.success) {
      alert("✅ Lead stored successfully!");
      console.log("Created lead:", res);
      

      // 🔹 Immediately refresh the list without page reload
      onUpdate();
      setFormData({
        name: "",
        phone: "",
        email: "",
        collegename: "",
        location: "",
        category: "",
        leadsource: "",
        leadstatus: "",
        domain: "",
        assignfrom: "",
        assignto: "",
        graduate: "",
        followdate:"",
        demodate:"",
        lookingfor:"",
        internshipduration:"",
        dropreason:"",
        remark:"",
        domainreason:"",
      });
    } else {
      alert("❌ Failed to store lead: " + (res.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Frontend error creating lead:", err);
    alert("❌ Could not connect to backend.");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  console.log("Form data updated:", formData);
}, [formData]);


// 

useEffect(() => {
  if (userList.length && lead.assignto) {
    const user = userList.find(u => u.label === lead.assignto);
    if (user) {
      setLead(prev => ({
        ...prev,
        assignto: user.value,
      }));
    }
  }
}, [userList, lead.assignto]);

useEffect(() => {
  if (userList.length && lead.assignfrom) {
    const user = userList.find(u => u.label === lead.assignfrom);
    if (user) {
      setLead(prev => ({
        ...prev,
        assignfrom: user.value,
      }));
    }
  }
}, [userList, lead.assignfrom]);





const editvalidateform = () => {
  const alwaysIgnore = ["email", "collegename","noofday"];

  const isAssignmentRequired =
    lead.leadstatus === "Demo Scheduled"  ;
  const isAssignmentstudent= lead.leadstatus === "Student";
  const isInternship = (lead.lookingfor === "Internship" || lead.lookingfor ==="Project with Internship");
  const isDemoScheduled = lead.leadstatus === "Demo Scheduled";
  const isDomainReason = lead.domain === "Others";
  const isDropReason = lead.leadstatus === "Drop Out";

  const isFollowUp =
   (lead.leadstatus === "Follow-Up 1"||lead.leadstatus === "Follow-Up 2" || lead.leadstatus === "Follow-Up 3");

  const conditionalIgnore = [
    ...(isAssignmentRequired ? [] : ["assignto", "assignfrom"]),
     ...(isAssignmentstudent ?[] :["assignto","fees","feepaid","feetype","dateofjoin"]),
    ...(isInternship ? [] : ["internshipduration"]),
    ...(isDemoScheduled ? [] : ["demodate"]),
    ...(isFollowUp ? [] : ["followdate"]),
    ...(isDropReason ? [] : ["dropreason"]),
    ...(isDomainReason ? [] : ["domainreason"]),
    
  ];

  const fieldsToIgnore = [...alwaysIgnore, ...conditionalIgnore];

  // 🔴 REQUIRED FIELD CHECK
  const emptyFields = Object.entries(lead).filter(
    ([key, value]) =>
      !fieldsToIgnore.includes(key) &&
      (value === null ||
        value === undefined ||
        value.toString().trim() === "")
  );

  if (emptyFields.length > 0) {
    alert(
      `Please fill required fields: ${emptyFields
        .map(([k]) => k)
        .join(", ")}`
    );
    return false;
  }

  return true;
};

useEffect(() => {
  if (!lead.fees && !lead.feepaid) return;

  const fees = Number(lead.fees) || 0;
  const feepaid = Number(lead.feepaid) || 0;

  const pending = Math.max(fees - feepaid, 0);

  setLead((prev) =>
    prev.pendingfee === pending.toString()
      ? prev
      : { ...prev, pendingfee: pending.toString() }
  );
}, [lead.fees, lead.feepaid]);
// 🟢 Load selectedLead into form
useEffect(() => {
  if (!selectedLead) return;

  const fees = Number(selectedLead.fees) || 0;
  const feepaid = Number(selectedLead.feepaid) || 0;

  setLead((prev) => ({
    ...prev,
    ...selectedLead,        // 🔥 leadstatus comes FIRST
    leadstatus: selectedLead.leadstatus, // 🔥 FORCE Student
    remark: selectedLead.remark || "",
    demodate: selectedLead.demodate
      ? selectedLead.demodate.split("T")[0]
      : "",
    followdate: selectedLead.followdate
      ? selectedLead.followdate.split("T")[0]
      : "",
    dateofjoin: selectedLead.dateofjoin
      ? selectedLead.dateofjoin.split("T")[0]
      : "",
    fees: fees.toString(),
    feepaid: feepaid.toString(),
    pendingfee: (fees - feepaid).toString(),
    feetype: selectedLead.feetype || "",
  }));
}, [selectedLead]);

  // ✅ Handle change
  const handlechange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     if (name === "phone") {
    if (!/^\d*$/.test(value)) return; // ❌ block letters/symbols
    if (value.length > 10) return;    // ❌ block >10 digits
  }
 if (name === "fees" || name === "feepaid") {
  if (!/^\d*$/.test(value)) return;
}

  if (name === "feepaid") {
    const paid = Number(value);
    const fees = Number(lead.fees) || 0;

    if (paid > fees) {
      return; // ❌ block input
    }
  }
  // 👤 NAME – allow only letters & spaces
  if (name === "name" || name === "collegename") {
    if (!/^[A-Za-z ]*$/.test(value)) return; // ❌ block numbers/symbols
  }
    setLead((prev) => ({ ...prev, [name]: value }));
  };


  const handleselectchange = (name: string, value: string) => {
  setLead(prev => {
    const updated = { ...prev, [name]: value };

    //AUTO-FILL noofday when internship duration changes
    if (name === "internshipduration") {
      updated.noofday = value; 
    }

    return updated;
  });
};





 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1️⃣ VALIDATION
  if (!editvalidateform()) return;
  if (!lead || !lead._id) return;

  try {
    const token = localStorage.getItem("token");

    // 2️⃣ CLONE PAYLOAD
    const payload: any = {
      ...lead,
      remark:lead.remark || "New Lead Added",
      demodate: lead.demodate || null,
      followdate: lead.followdate || null,
    };

    // 3️⃣ CLEAN assign fields based on status
    const needsAssign =
      payload.leadstatus === "Demo Scheduled" ||
      payload.leadstatus === "Student";

    if (!needsAssign) {
      delete payload.assignfrom;
      delete payload.assignto;
    } else {
      // remove invalid values
      if (!payload.assignfrom || payload.assignfrom === "N/A") {
        delete payload.assignfrom;
      }
      if (!payload.assignto || payload.assignto === "N/A") {
        delete payload.assignto;
      }
    }

    // 4️⃣ API CALL
    await axios.put(
      `${API_URL}/leads/${lead._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✅ Lead updated successfully");
    onUpdate();

  } catch (err) {
    alert("❌ Failed to update lead");
    console.error("❌ Update failed:", err);
  }
};


  // ✅ Delete handler
const handleDelete = async () => {
  if (!lead || !lead._id) return;

  try {
    const res = await axios.delete(
      `${API_URL}/leads/${lead._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ include token
        },
      }
    );

    if (res.data.success) {
      alert("🗑️ Lead deleted successfully");
      onUpdate();
    } else {
      alert("❌ Failed to delete lead");
      console.error("Backend error:", res.data);
    }
  } catch (err: any) {
    alert("❌ Failed to delete lead");
    console.error("Delete error:", err.response?.data || err.message);
  }
};

// console.log("Assign From ID:", lead.assignfrom);
// console.log("Assign To ID:", lead.assignto);


  // const [tags, setTags] = useState<string[]>(["Collab"]);
  // const handleTagsChange = (newTags: string[]) => {
  //   setTags(newTags);
  // };
  // const [tags2, setTags2] = useState<string[]>(["Collab", "VIP"]);
  // const handleTagsChange2 = (newTags: string[]) => {
  //   setTags2(newTags);
  // };

  // const [phone, setPhone] = useState<string | undefined>();
  // const [phone2, setPhone2] = useState<string | undefined>();

  return (
    <>
      {/* Add lead*/}
      
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
          ></button>
        </div>
        <form onSubmit={handleSubmit} >
        <div className="offcanvas-body" style={{maxHeight: "650px",overflowY: "auto", }} >
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Lead Name<span className="text-danger">*</span>
                  </label>
                 <input name="name" value={formData.name} onChange={handleInputChange} className="form-control" required/>
                </div>
              </div>
              
              
              {/* <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Lead Type</label>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="customRadio1"
                        name="customRadio"
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customRadio1"
                      >
                        Person
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="customRadio2"
                        name="customRadio"
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customRadio2"
                      >
                        Organization
                      </label>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-md-12">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Company Name</label>
                    <Link
                      to="#"
                      className="label-add link-primary mb-1"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_2"
                    >
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <CommonSelect
                    options={Company_Name}
                    className="select"
                    defaultValue={Company_Name[0]}
                  />
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Phone<span className="text-danger">*</span>
                  </label>
                 <input name="phone" type="tel" placeholder="Phone"  value={formData.phone} onChange={handleInputChange} className="form-control" required/>
              
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>
                 <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
             
            />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                 Graduate <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="graduate"
                    value={formData.graduate}
                    onChange={handleSelectChange}
                    options={Currency}
                    className="select"
                    defaultValue={Currency[0]}
                  />

                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    College Name
                  </label>
                 <input type="text" name="collegename" placeholder="college Name" value={formData.collegename} onChange={handleInputChange} className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                   Catagory <span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="category"
                   value={formData.category}
                    onChange={handleSelectChange}
                    options={Categorys}
                    className="select"
                    defaultValue={Categorys[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Lead Source <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="leadsource"
                   value={formData.leadsource}
                    onChange={handleSelectChange}
                    options={Source}
                    className="select"
                    defaultValue={Source[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Domain <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="domain"
                   value={formData.domain}
                    onChange={handleSelectChange}
                    options={Industry}
                    className="select"
                    defaultValue={Industry[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
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
                   value={formData.leadstatus}
                    onChange={handleSelectChange}
                     options={leadStatusOptions} 
                    className="select"
                    defaultValue={Leadstatus[0]}
                  />
                </div>
              </div>

              {(formData.leadstatus === "Follow-Up 1" || formData.leadstatus === "Follow-Up 2" || formData.leadstatus === "Follow-Up 3") && (
                   <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Follow-UP Date <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        value={formData.followdate ? dayjs(formData.followdate) : null}
        disabledDate={disableFutureAndOldDates}
        onChange={(date) =>
          setFormData((prev) => ({
            ...prev,
            followdate: date ? date.format("YYYY-MM-DD") : "",
          }))
        }
      />

              </div>
            </div>
          </div>
              )}
              {(formData.domain === "Others") &&(
               <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Enter Domain Name<span className="text-danger">*</span>
                  </label>
                 <input name="domainreason" type="text" placeholder="Domain"  value={formData.domainreason} onChange={handleInputChange} className="form-control" required/>
              
                </div>
              </div>)}{(formData.leadstatus==="Drop Out")&&(
                 <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Enter Drop Reason<span className="text-danger">*</span>
                  </label>
                 <input name="dropreason" type="text" placeholder="Drop Reason"  value={formData.dropreason} onChange={handleInputChange} className="form-control" required/>
              
                </div>
              </div>
              )}
               <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Program Looking For <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="lookingfor"
                   value={formData.lookingfor}
                    onChange={handleSelectChange}
                    options={Lookingfor}
                    className="select"
                    defaultValue={Lookingfor[0]}
                  />
                </div>
              </div>
               <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Location<span className="text-danger">*</span>
                  </label>
                <input type="text" name="location" placeholder="location" value={formData.location} onChange={handleInputChange} className="form-control" required/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Remarks
                  </label>
                <input type="text" name="remark" placeholder="Remarks" value={formData.remark} onChange={handleInputChange} className="form-control" />
                </div>
              </div>
                 {(formData.lookingfor === "Project with Internship" ||
                formData.lookingfor === "Internship") && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Internship Duration <span className="text-danger">*</span>
                    </label>
              
                    <CommonSelect
                      name="internshipduration"
                      value={formData.internshipduration}
                      onChange={handleSelectChange}
                      options={Internshipduration}
                      className="select"
                    />
                  </div>
                </div>
              )}
              
                
                {(formData.leadstatus === "Demo Scheduled" ) && (
                   <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Assign From <span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignfrom"
                   value={formData.assignfrom}
                    onChange={handleSelectChange}
                    options={userList}
                    className="select"
                    // defaultValue={Assign_From[0]}
                  />
                </div>
              </div>
               
              )}
               {(formData.leadstatus === "Demo Scheduled") && (
                 <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                 Assign To<span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignto"
                   value={formData.assignto}
                    onChange={handleSelectChange}
                    options={userList}
                    className="select"
                    // defaultValue={Assign_To[0]}
                  />
                </div>
              </div>
              )}
               {(formData.leadstatus === "Student") && (
                 <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Trainer<span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignto"
                   value={formData.assignto}
                    onChange={handleSelectChange}
                    options={userList}
                    className="select"
                    // defaultValue={Assign_To[0]}
                  />
                </div>
              </div>
              )}
             
               
                 
            {(formData.leadstatus === "Demo Scheduled") && (   
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Demo Date <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        value={formData.demodate ? dayjs(formData.demodate) : null}
        disabledDate={disableFutureAndOldDates}
        onChange={(date) =>
          setFormData((prev) => ({
            ...prev,
            demodate: date ? date.format("YYYY-MM-DD") : "",
          }))
        }

        
      />

              </div>
            </div>
          </div>
              )}

               {(formData.leadstatus === "Student") && (   

                <>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Date of Joining <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
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

        
      />

              </div>
            </div>
          </div>
             

       <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fees<span className="text-danger">*</span>
                  </label>
                 <input name="fees" type="text" placeholder="Fees"  value={formData.fees} onChange={handleInputChange} className="form-control" required/>
              
                </div>
              </div>
 <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fee Paid<span className="text-danger">*</span>
                  </label>
                 <input name="feepaid" type="text" placeholder="Fee Paid"  value={formData.feepaid} onChange={handleInputChange} className="form-control" required/>
              
                </div>
              </div>
 <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Pending Fees
                  </label>
                 <input name="pendingfee" type="text" placeholder="Pending Fees"  value={formData.pendingfee}   disabled className="form-control" />
              
                </div>
              </div>
    <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fee Type <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="feetype"
                   value={formData.feetype}
                    onChange={handleSelectChange}
                    options={Feetype}
                    className="select"
                    defaultValue={Feetype[0]}
                  />
                </div>
              </div>

        </>  )}
              
           {/*  <div className="col-md-6">
         <div className="mb-3">
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
            value={formData.leadstatus}
            onChange={handleSelectChange}
            options={leadStatusOptions} 
            className="select"
          />
        </div>
      </div>  */}  

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
         {/* {message && <div className="alert alert-info mt-3">{message}</div>} */}
      </div>
      {/* /Add lead */}
      {/* Add offcanvas */}
      {/* ✅ Include the Offcanvas (LeadStatus) component here */}
      <LeadStatus />
      {/* <div
    className="offcanvas offcanvas-end offcanvas-large"
    tabIndex={-1}
    id="offcanvas_pipeline"
  >
    <div className="offcanvas-header border-bottom">
      <h5 className="mb-0">Add New Pipeline</h5>
      <button
        type="button"
        className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div className="offcanvas-body">
      <form>
        <div>
          <div className="mb-3">
            <label className="form-label">
             Lead Status <span className="text-danger">*</span>
            </label>
            <input className="form-control" type="text" />
          </div>
          <div className="mb-3">
            <div className="pipe-title d-flex align-items-center justify-content-between mb-2">
              <label className="form-label m-0">Lead Status</label> */}
              {/* <Link
                to="#"
                className="add-stage link-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_stage"
              >
                <i className="ti ti-plus me-1" />
                Add New
              </Link> */}
            {/* </div>
            <div className="pipeline-listing">
              <div className="pipeline-item d-flex align-items-center justify-content-between p-2 shadow-sm bg-white mb-1 border-start border-3 border-warning">
                <p className="mb-0 fw-semibold me-3 text-dark">
                  <i className="ti ti-grip-vertical text-body" /> Inpipeline
                </p>
                <div className="action-pipeline">
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_stage"
                    className="btn btn-sm btn-outline-light border-0"
                  >
                    <i className="ti ti-edit me-1" />
                    Edit
                  </Link>
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_stage"
                    className="btn btn-sm btn-outline-light border-0"
                  >
                    <i className="ti ti-trash me-1" />
                    Delete
                  </Link>
                </div>
              </div> 
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
          <button type="button" className="btn btn-primary">
            Create New
          </button>
        </div>
      </form>
    </div>
  </div> */}
      {/* /Add offcanvas */}
      {/* Add New Stage */}
  {/* <div className="modal custom-modal fade" id="add_stage" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title mb-0">Add New Stage</h5>
          <button
            className="btn-close custom-btn-close border p-1 me-0 text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form >
          <div className="modal-body">
            <div className="mb-0">
              <label className="form-label">
                Stage Name<span className="ms-1 text-danger">*</span>
              </label>
              <input type="text" className="form-control" />
            </div>
          </div>
          <div className="modal-btn text-end p-3 border-top">
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </Link>
            <button type="submit" className="btn btn-danger">
              Create New
            </button>
          </div>
        </form>
      </div>
    </div>
  </div> */}
  {/* /Add New Stage */}
  {/* Edit Stage */}
  {/* <div className="modal custom-modal fade" id="edit_stage" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title mb-0">Edit Stage</h5>
          <button
            className="btn-close custom-btn-close border p-1 me-0 text-dark"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form >
          <div className="modal-body">
            <div className="mb-0">
              <label className="form-label">
                Edit Stage<span className="ms-1 text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                defaultValue="Inpipeline"
              />
            </div>
          </div>
          <div className="modal-btn text-end p-3 border-top">
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </Link>
            <button type="submit" className="btn btn-danger">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div> */}
  {/* /Edit Stage */}
  {/* delete stage */}
  {/* <div className="modal fade" id="delete_stage">
    <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
      <div className="modal-content rounded-0">
        <div className="modal-body p-4 text-center position-relative">
          <div className="mb-3 position-relative z-1">
            <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
              <i className="ti ti-trash fs-24" />
            </span>
          </div>
          <h5 className="mb-1">Remove Stage</h5>
          <p className="mb-3">
            Are you sure you want to remove stage you selected.
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
          </div>
        </div>
      </div>
    </div>
  </div> */}
      {/* edit offcanvas */}
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
          ></button>
        </div>
        <div className="offcanvas-body" >
         {lead && (
            <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Lead Name<span className="text-danger">*</span>
                  </label>
                  <input
                    name="name"
                    className="form-control"
                    value={lead.name || ""}
                    onChange={handlechange}
                  />
                </div>
              </div> 
             <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>
                 <input
                  name="email"
                  className="form-control"
                  value={lead.email || ""}
                onChange={handlechange}
            />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Phone
                  </label>
                 <input
                  name="phone"
                  className="form-control"
                  value={lead.phone || ""}
                onChange={handlechange}
            />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                 Graduate <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="graduate"
                    options={Currency}
                    className="select"
                    value={lead.graduate || ""}
                    onChange={handleselectchange}
                  />

                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    College Name
                  </label>
                 <input type="text" name="collegename"  value={lead.collegename || ""}
                onChange={handlechange} className="form-control" required/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                   Catagory <span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="category"
                    value={lead.category || ""}
                    onChange={handleselectchange}
                    options={Categorys}
                    className="select"
                    
                  />
                </div>
              </div>
                <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                Lead Status<span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="leadstatus"
                    value={lead.leadstatus || ""}
                    onChange={handleselectchange}
                     options={leadStatusOptions} 
                    className="select"
                    
                  />
                </div>
              </div> 
              {(lead.domain === "Others") &&(
               <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Enter Domain Name<span className="text-danger">*</span>
                  </label>
                 <input name="domainreason" type="text" placeholder="Domain"  value={lead.domainreason} onChange={handlechange} className="form-control" required/>
              
                </div>
              </div>)}{(lead.leadstatus==="Drop Out")&&(
                 <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Enter Drop Reason<span className="text-danger">*</span>
                  </label>
                 <input name="dropreason" type="text" placeholder="Drop Reason"  value={lead.dropreason} onChange={handlechange} className="form-control" required/>
              
                </div>
              </div>
              )}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Lead Source <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="leadsource"
                    value={lead.leadsource || ""}
                    onChange={handleselectchange}
                    options={Source}
                    className="select"
                    
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Program Looking For <span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="lookingfor"
                    value={lead.lookingfor || ""}
                    onChange={handleselectchange}
                    options={Lookingfor}
                    className="select"
                    
                  />
                </div>
              </div>
               {(lead.lookingfor === "Project with Internship" ||
                lead.lookingfor === "Internship") && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Internship Duration <span className="text-danger">*</span>
                    </label>
                    <CommonSelect
                      name="internshipduration"
                      value={lead.internshipduration || ""}
                      onChange={handleselectchange}
                      options={Internshipduration}
                      className="select"
                    />
                  </div>
                </div>
              )}
          
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Location
                  </label>
                 <input type="text" name="location"  value={lead.location || ""}
                onChange={handlechange} className="form-control" required/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                   Remarks
                  </label>
                 <input type="text" name="remark"  value={lead.remark}
                onChange={handlechange} className="form-control"/>
                </div>
              </div>
            {(lead.leadstatus === "Demo Scheduled" ) && (
                  <>
               <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Assign From <span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignfrom"
                   value={lead.assignfrom || ""}
                    options={userList}
                    onChange={handleselectchange}
                  
                    className="select"
                    
                  />
                </div>
              </div>
               <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Assign To<span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignto"
                    value={lead.assignto || ""}
                    onChange={handleselectchange}
                    options={userList}
                    className="select"
                    
                  />
                </div>
              </div>
              </>
                )}
                {(lead.leadstatus === "Follow-Up 1" || lead.leadstatus === "Follow-Up 2" || lead.leadstatus === "Follow-Up 3") && (
                  <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Follow-UP Date <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        value={lead.followdate ? dayjs(lead.followdate) : null}
        disabledDate={disableFutureAndOldDates}
        onChange={(date) =>
          setLead((prev) => ({
            ...prev,
            followdate: date ? date.format("YYYY-MM-DD") : "",
          }))
        }
      />

              </div>
            </div>
          </div>)}
          {(lead.leadstatus === "Demo Scheduled")&&(
            <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Demo Date <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        value={lead.demodate ? dayjs(lead.demodate) :  null}
         disabledDate={disableFutureAndOldDates}
        onChange={(date) =>
          setLead((prev) => ({
            ...prev,
            demodate: date ? date.format("YYYY-MM-DD") : "",
          }))
        }
      />

              </div>
            </div>
          </div>
          )}

            {(lead.leadstatus === "Student") && (   

                <>
                <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">
                  Trainer<span className="text-danger">*</span> 
                  </label>
                  <CommonSelect
                  name="assignto"
                    value={lead.assignto || ""}
                    onChange={handleselectchange}
                    options={userList}
                    className="select"
                    
                  />
                </div>
              </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Date of Joining <span className="text-danger">*</span>
              </label>
              <div className="input-group w-auto input-group-flat">
                <CommonDatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        value={lead.dateofjoin ? dayjs(lead.dateofjoin) : null}
        disabledDate={disableFutureAndOldDates}
        onChange={(date) =>
          setLead((prev) => ({
            ...prev,
            dateofjoin: date ? date.format("YYYY-MM-DD") : "",
          }))
        }

        
      />

              </div>
            </div>
          </div>
             

       <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fees<span className="text-danger">*</span>
                  </label>
                 <input name="fees" type="text"  value={lead.fees} onChange={handlechange} className="form-control" required/>
              
                </div>
              </div>
          <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fee Paid<span className="text-danger">*</span>
                  </label>
                 <input name="feepaid" type="text" value={lead.feepaid} onChange={handlechange} className="form-control" required/>
              
                </div>
              </div>
            <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Pending Fees
                  </label>
                 <input name="pendingfee" type="text"  value={lead.pendingfee} onChange={handlechange} disabled className="form-control" />
              
                </div>
              </div>
    <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Fee Type <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                  name="feetype"
                   value={lead.feetype}
                    onChange={handleselectchange}
                    options={Feetype}
                    className="select"
                    
                  />
                </div>
              </div>

        </>  )}
              
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
                data-bs-dismiss="offcanvas"
              >
                Save Changes
              </button>
            </div>
          </form>
            )}
        </div>
      </div> 
      {/* edit offcanvas */}
      {/* success modal */}
      <div className="modal fade" id="create_success">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-info border-0 text-info rounded-circle">
                  <i className="ti ti-building-skyscraper fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Lead Created Successfully!!!</h5>
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
                {/* <Link
                  to="#"
                  className="btn btn-primary position-relative z-1 w-100"
                >
                 OK
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* success modal */}
      {/* delete modal */}
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
      {/* delete modal */}
      <LeadStatus/>
    </>
  );
};

export default ModalLeads;