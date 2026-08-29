import axios from "axios";

const API_URL = "/api/hackathon";

// =====================================================
// GET PROJECT DETAILS
// PUBLIC API
// No token required
// =====================================================

export const getHackathonProject = async (
    registrationId: string
) => {
    const response = await axios.get(
        `${API_URL}/student/project/${encodeURIComponent(
            registrationId
        )}`
    );

    return response.data;
};


// =====================================================
// REQUEST OTP
// PUBLIC API
// =====================================================

export const requestHackathonProjectOtp = async (
    registrationId: string
) => {
    const response = await axios.post(
        `${API_URL}/student/request-otp`,
        {
            registrationId,
        }
    );

    return response.data;
};


// =====================================================
// VERIFY OTP
// PUBLIC API
// =====================================================

export const verifyHackathonProjectOtp = async (
    registrationId: string,
    otp: string
) => {
    const response = await axios.post(
        `${API_URL}/student/verify-otp`,
        {
            registrationId,
            otp,
        }
    );

    return response.data;
};


// =====================================================
// UPDATE PROJECT
// PROTECTED API
// Bearer token required
// =====================================================

export const updateHackathonProject = async (
    registrationId: string,
    accessToken: string,
    projectData: any
) => {
    const response = await axios.patch(
        `${API_URL}/student/project/${encodeURIComponent(
            registrationId
        )}`,
        projectData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
};