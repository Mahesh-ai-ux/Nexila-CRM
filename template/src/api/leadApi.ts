// src/api/leadsApi.ts
import axios from "axios";
import API_URL from "./apiconfig";


export const createLead = async (data: any) => {
  const token = localStorage.getItem("token"); // if you use auth
  const res = await axios.post(`${API_URL}/leads/create`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};
// ✅ Get All Leads API
export const getAllLeads = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/leads`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/leads";

// export const createLead = async (data: any) => {
//   try {
//     const res = await axios.post(`${API_URL}/create`, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("❌ API Error:", error.response?.data || error.message);
//     throw error;
//   }
// };