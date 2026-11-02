// src/api/leadsApi.ts
import axios from "axios";
import API_URL from "./apiconfig";
//import Config from "./authenticationjwt";

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

//create lead public
export const createLeadPublic = async (data: any) => {
  const res = await axios.post(`${API_URL}/leads/create-public`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
//nexila changes

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