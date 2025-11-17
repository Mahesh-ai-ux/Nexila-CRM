import  { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../../../../api/apiconfig";



const LeadStatus = () => {
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [statusName, setStatusName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
const token = localStorage.getItem("token"); // Or however you store it
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

  // ✅ Fetch existing statuses
  const fetchLeadStatuses = async () => {
    try {
      const res = await axios.get(`${API_URL}/leadstatus`, config);
      setLeadStatuses(res.data);
    } catch (err) {
      console.error("Error fetching lead statuses", err);
    }
  };

  useEffect(() => {
    fetchLeadStatuses();
  }, []);

  // ✅ Add or Update Lead Status
  const handleAddOrUpdate = async () => {
    if (!statusName.trim()) return alert("Please enter a lead status");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/leadstatus/${editingId}`, {
          name: statusName,
        },config);
        alert("Lead Status updated successfully");
      } else {
        await axios.post(`${API_URL}/leadstatus`, {
          name: statusName,
        },config);
        alert("Lead Status added successfully");
      }

      setStatusName("");
      setEditingId(null);
      fetchLeadStatuses();
    } catch (err) {
      console.error("Error adding/updating lead status", err);
    }
  };

  // ✅ Delete Lead Status
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this status?")) return;

    try {
      await axios.delete(`${API_URL}/leadstatus/${id}`,config);
      alert("Deleted successfully");
      fetchLeadStatuses();
    } catch (err) {
      console.error("Error deleting lead status", err);
    }
  };

  // ✅ Edit Lead Status
  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setStatusName(name);
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_pipeline"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="mb-0">Manage Lead Status</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        <div className="mb-3">
          <label className="form-label">
            Lead Status <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center justify-content-end mb-4">
          <button
            type="button"
            data-bs-dismiss="offcanvas"
            className="btn btn-light me-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="btn btn-primary"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        <div className="pipeline-listing">
          {leadStatuses.map((item: any) => (
            <div
              key={item._id}
              className="pipeline-item d-flex align-items-center justify-content-between p-2 shadow-sm bg-white mb-1 border-start border-3 border-warning"
            >
              <p className="mb-0 fw-semibold me-3 text-dark">{item.name}</p>
              <div className="action-pipeline">
                <button
                  className="btn btn-sm btn-outline-light border-0"
                  onClick={() => handleEdit(item._id, item.name)}
                >
                  <i className="ti ti-edit me-1" />
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-light border-0"
                  onClick={() => handleDelete(item._id)}
                >
                  <i className="ti ti-trash me-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadStatus;
