
import API_URL from "./apiconfig";
export interface LoginResponse {
  token?: string;
  message?: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    

    const data = await response.json();
    // ✅ Check if login was successful
    if (response.ok && data.token) {
      // ✅ Store the token in localStorage
      localStorage.setItem("token", data.token);
       localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Token saved to localStorage:", data.token);
    } else {
      console.warn("⚠️ Login failed:", data.message || "Invalid credentials");
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Server error. Please try again." };
  }
};
