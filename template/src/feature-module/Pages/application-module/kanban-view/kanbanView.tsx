import {
  Joinstatus,
  Categorys,
  Currency,
  Industry,
  Lookingfor,
  Source,
  Internshipduration,
} from "../../../../core/json/selectOption";
import CommonSelect from "../../../../components/common-select/commonSelect";

import { useState, useEffect } from "react";
import { createLead, createLeadPublic } from "../../../../api/leadApi"; //nexila changes
// import axios from "axios";
// import API_URL from "../../../../api/apiconfig";
// import PageHeader from "../../../../components/page-header/pageHeader";

interface Lead {
  _id?: string;
  nexilaID?: string;
  name?: string;
  phone?: string;
  email?: string;
  leadstatus?: string;
  leadsource?: string;
  collegename?: string;
  category?: string;
  location?: string;
  domain?: string;
  graduate?: string;
  joinstatus?: string;
  lookingfor?: string;
  internshipduration?: string;

}

interface ModalLeadsProps {
  selectedLead?: Lead | null;
  actionType?: "edit" | "delete" | null;
  onUpdate?: () => void;
}

const KanbanView: React.FC<ModalLeadsProps> = ({
  selectedLead: _selectedLead = null,
  actionType: _actionType = "",
  onUpdate = async () => { },
}) => {
  // const [leadStatusOptions, setLeadStatusOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<Lead | null>(null);
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
    graduate: "",
    joinstatus: "",
    lookingfor: "",
    internshipduration: "",
  });
  //Leadstaus option getting
  // useEffect(() => {
  //   const fetchLeadStatuses = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${API_URL}/leadstatus`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       // Convert backend data to dropdown-friendly format
  //       const formatted = res.data.map((item:any) => ({
  //         value: item.name,
  //         label: item.name,
  //       }));

  //       setLeadStatusOptions(formatted);
  //        // 👉 Auto assign first leadstatus as default
  //     if (formatted.length > 0) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         leadstatus: formatted[0].value,
  //       }));
  //     }
  //     } catch (err) {
  //       console.error("Error fetching lead statuses", err);
  //     }
  //   };

  //   fetchLeadStatuses();
  // }, []);

  // ✅ Validate fields
  const validateForm = () => {
    const fieldsToIgnore = ["leadstatus", "internshipduration"];

    const missingFields: string[] = [];

    Object.entries(formData).forEach(([key, value]) => {
      if (!fieldsToIgnore.includes(key)) {
        if (!value || value.toString().trim() === "") {
          missingFields.push(key);
        }
      }
    });

    if (missingFields.length > 0) {
      alert("⚠️ Missing fields: " + missingFields.join(", "));
      return false;
    }

    return true;
  };
  // ✅ Handle text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle selects (from CommonSelect)

  // For CommonSelect dropdowns:
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await createLeadPublic(formData); //nexila changes
      if (res.success) {
        console.log("Created lead:", res);

        // store submitted details for popup
        setSubmittedData({
          ...formData,
          nexilaID: res.data.nexilaID
        });














































        // double checked
        // open popup
        setShowSuccess(true);

        // refresh list
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
          graduate: "",
          joinstatus: "",
          lookingfor: "",
          internshipduration: "",
        });
        // window.location.href = "/login";
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

  return (
    <>
      <style>{`
  .enquiry-wrapper {
    min-height: 100vh;
    padding: 32px 16px;
    background:
      radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 28%),
      radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 30%),
      linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  }

  .enquiry-card {
    width: 100%;
    max-width: 960px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 18px 45px rgba(15, 23, 42, 0.08),
      0 3px 12px rgba(15, 23, 42, 0.04);
    overflow: visible;
  }

  .enquiry-body {
    padding: 38px;
  }

  .enquiry-welcome {
    font-size: 14px;
    font-weight: 700;
    color: #4f46e5;
    letter-spacing: 0.4px;
    margin-bottom: 8px;
  }

  .enquiry-title {
    font-weight: 700;
    font-size: 30px;
    color: #0f172a;
    margin-bottom: 6px;
  }

  .enquiry-subtitle {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 28px;
  }

  .enquiry-label {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
    display: block;
  }

  /* input */
  .enquiry-card .form-control {
    height: 50px;
    border-radius: 12px;
    border: 1px solid rgba(203, 213, 225, 0.9);
    background: rgba(255, 255, 255, 0.88);
    box-shadow: none;
    font-size: 14px;
    padding: 0 14px;
    transition: all 0.2s ease;
  }

  .enquiry-card .form-control:hover {
    border-color: #94a3b8;
  }

  .enquiry-card .form-control:focus {
    border-color: #4f46e5;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
  }

  /* react-select wrapper */
  .enquiry-card .css-b62m3t-container {
    width: 100%;
  }

  /* select control */
  .enquiry-card [class*="-control"] {
    min-height: 50px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(203, 213, 225, 0.9) !important;
    background: rgba(255, 255, 255, 0.88) !important;
    box-shadow: none !important;
    transition: all 0.2s ease !important;
    cursor: pointer;
  }

  .enquiry-card [class*="-control"]:hover {
    border-color: #94a3b8 !important;
  }

  .enquiry-card [class*="-control--is-focused"] {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08) !important;
    background: #fff !important;
  }

  /* selected value */
  .enquiry-card [class*="-singleValue"] {
    color: #0f172a !important;
    font-size: 14px !important;
  }

  /* placeholder */
  .enquiry-card [class*="-placeholder"] {
    color: #94a3b8 !important;
    font-size: 14px !important;
  }

  /* value container */
  .enquiry-card [class*="-value-container"] {
    padding: 0 12px !important;
  }

  /* dropdown icon */
  .enquiry-card [class*="-indicatorSeparator"] {
    display: none !important;
  }

  .enquiry-card [class*="-dropdown-indicator"] {
    color: #64748b !important;
    padding-right: 10px !important;
  }

  .enquiry-card [class*="-control--is-focused"] [class*="-dropdown-indicator"] {
    color: #4f46e5 !important;
  }

  /* dropdown menu */
  .enquiry-card [class*="-menu"] {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid rgba(226, 232, 240, 0.9) !important;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08) !important;
    margin-top: 6px !important;
    z-index: 9999 !important;
  }

  .enquiry-card [class*="-menu-list"] {
    padding: 6px !important;
  }

  .enquiry-card [class*="-option"] {
    font-size: 14px !important;
    padding: 10px 12px !important;
    border-radius: 8px !important;
    cursor: pointer !important;
  }

  .enquiry-card [class*="-option--is-focused"] {
    background: rgba(79, 70, 229, 0.06) !important;
    color: #0f172a !important;
  }

  .enquiry-card [class*="-option--is-selected"] {
    background: #4f46e5 !important;
    color: #fff !important;
  }

  .enquiry-card .btn-primary {
    border: none;
    border-radius: 12px;
    padding: 12px 40px;
    font-weight: 600;
    font-size: 15px;
    min-width: 190px;
    transition: all 0.2s ease;
  }

  .enquiry-card .btn-primary:hover {
    transform: translateY(-1px);
  }

  .enquiry-card .row > div {
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    .enquiry-body {
      padding: 24px;
    }

    .enquiry-title {
      font-size: 24px;
    }
  }

  .enquiry-logo {
  width: 150px;
  height: 78px;
  object-fit: contain;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  padding: 8px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.enquiry-logo:hover {
  transform: translateY(-2px) scale(1.02);
}

.success-overlay {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.6);

  display:flex;
  justify-content:center;
  align-items:center;

  z-index:9999;
}


.success-modal {

  background:white;

  width:450px;

  padding:30px;

  border-radius:15px;

  box-shadow:0 5px 20px rgba(0,0,0,0.3);

}


.success-modal h2 {

  text-align:center;

  color:green;

}


.lead-details {

  margin-top:20px;

  background:#f5f5f5;

  padding:15px;

  border-radius:10px;

}


.lead-details p {

  margin:8px 0;

}


.success-modal button {

  margin-top:20px;

  width:100%;

  padding:12px;

  background:#2563eb;

  color:white;

  border:none;

  border-radius:8px;

  cursor:pointer;

}
`}</style>

      <div className="d-flex align-items-center justify-content-center enquiry-wrapper">
        <div className="card enquiry-card">
          <div className="card-body enquiry-body">
            <div className="text-center mb-3">
              <img
                src="/nexilalogo1.jpeg"
                alt="Nexila Logo"
                className="enquiry-logo"
              />
            </div>

            <div className="text-center enquiry-welcome">
              Welcome to Nexila Technologies
            </div>

            <h3 className="text-center enquiry-title">Enquiry Form</h3>

            <p className="text-center enquiry-subtitle">
              Fill the form and our team will contact you
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Mobile Number *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Qualification *</label>
                  <CommonSelect
                    name="graduate"
                    value={formData.graduate}
                    onChange={handleSelectChange}
                    options={Currency}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">College Name *</label>
                  <input
                    name="collegename"
                    value={formData.collegename}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Current Status *</label>
                  <CommonSelect
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    options={Categorys}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Source *</label>
                  <CommonSelect
                    name="leadsource"
                    value={formData.leadsource}
                    onChange={handleSelectChange}
                    options={Source}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Program Type *</label>
                  <CommonSelect
                    name="lookingfor"
                    value={formData.lookingfor}
                    onChange={handleSelectChange}
                    options={Lookingfor}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Field of Interest *</label>
                  <CommonSelect
                    name="domain"
                    value={formData.domain}
                    onChange={handleSelectChange}
                    options={Industry}
                  />
                </div>

                {(formData.lookingfor === "Project with Internship" ||
                  formData.lookingfor === "Internship") && (
                    <div className="col-md-6 mb-3">
                      <label className="enquiry-label">
                        Internship Duration *
                      </label>
                      <CommonSelect
                        name="internshipduration"
                        value={formData.internshipduration}
                        onChange={handleSelectChange}
                        options={Internshipduration}
                      />
                    </div>
                  )}

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">City *</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="enquiry-label">Joining Timeline *</label>
                  <CommonSelect
                    name="joinstatus"
                    value={formData.joinstatus}
                    onChange={handleSelectChange}
                    options={Joinstatus}
                  />
                </div>

                <div className="col-12 text-center mt-3">
                  <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                    <button
                      type="submit"
                      className="btn btn-primary px-5"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                  {/* <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-5"
                      onClick={() => {
                        window.location.href = "/login";
                      }}
                    >
                      Exit
                    </button>
                  </div> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && submittedData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "500px",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,.3)",
            }}
          >
            <h3 className="text-center mb-4">
              ✅ Enquiry Submitted Successfully
            </h3>

            <div>
              <p><b>Nexila ID:</b> {submittedData.nexilaID}</p>
              <p>
                <b>Name:</b> {submittedData.name}
              </p>

              <p>
                <b>Mobile:</b> {submittedData.phone}
              </p>

              <p>
                <b>Email:</b> {submittedData.email}
              </p>

              <p>
                <b>Qualification:</b> {submittedData.graduate}
              </p>

              <p>
                <b>College:</b> {submittedData.collegename}
              </p>

              <p>
                <b>Current Status:</b> {submittedData.category}
              </p>

              <p>
                <b>Source:</b> {submittedData.leadsource}
              </p>

              <p>
                <b>Program Type:</b> {submittedData.lookingfor}
              </p>

              <p>
                <b>Domain:</b> {submittedData.domain}
              </p>

              <p>
                <b>City:</b> {submittedData.location}
              </p>

              <p>
                <b>Joining Timeline:</b> {submittedData.joinstatus}
              </p>
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-primary px-5"
                onClick={() => {
                  setShowSuccess(false);

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
                    graduate: "",
                    joinstatus: "",
                    lookingfor: "",
                    internshipduration: "",
                  });
                }}
              >
                Back To Form
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanView;
// *Enquiry Form Page*
// Full Name  DONE

// Mobile Number
// Email Address
// Qualification
// Institution Name
// Enquiry Source
// Current Status
// Program Type
// Field of Interest (Domain)
// City
// Joining Timeline

// *Current Status* - Dropdown
// Graduate – Job Seeker
// Working Professional – Technical
// Working Professional – Non-Technical
// College Student – Final Year
// College Student – (1st - Pre Final Year)