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
import { createLead } from "../../../../api/leadApi";
// import axios from "axios";
// import API_URL from "../../../../api/apiconfig";
import PageHeader from "../../../../components/page-header/pageHeader";


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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
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
          graduate: "",
          joinstatus: "",
          lookingfor: "",
          internshipduration: "",



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


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <PageHeader title="Enquiry Form" moduleTitle="Application" showModuleTile={true} showExport={false} />

          {/* End Page Header */}
          {/* End Page Header */}
          <div className="card" >
            <div className="card-body p-4">

              <form onSubmit={handleSubmit} >

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Lead Name<span className="text-danger">*</span>
                      </label>
                      <input name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Phone<span className="text-danger">*</span>
                      </label>
                      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="form-control" required />

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
                        required />
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
                      <input type="text" name="collegename" placeholder="college Name" value={formData.collegename} onChange={handleInputChange} className="form-control" required />
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
                        Looking for <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="lookingfor"
                        value={formData.lookingfor}
                        onChange={handleSelectChange}
                        options={Lookingfor}
                        className="select"

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

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Location<span className="text-danger">*</span>
                      </label>
                      <input type="text" name="location" placeholder="location" value={formData.location} onChange={handleInputChange} className="form-control" required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Joining Status <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        name="joinstatus"
                        value={formData.joinstatus}
                        onChange={handleSelectChange}
                        options={Joinstatus}
                        className="select"
                      />

                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-center">
                    {/* <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button> */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Submit"}
                    </button>

                  </div>
                </div>
              </form>


            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}

    </>
  );
};

export default KanbanView;