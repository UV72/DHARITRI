import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Interfaces
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Report {
  id: number;
  user_id: string;
  report_name: string;
  upload_date: string;
  analysis_result: string;
  doctor_notes?: string;
  doctor_approval: boolean;
}

export interface DietQuestion {
  question: string;
  report_text?: string;
}

export interface UpdateReportRequest {
  notes: string;
  approval: boolean;
}

// Helper: handle API error
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  const message = error.response?.data?.detail || error.message || "Something went wrong. Please try again.";
  toast.error(message);
  return Promise.reject(error);
};

// Auth service
export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      console.log("Sending login request to:", `${API_URL}/token`);
      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log(response)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }
  
      const data = await response.json();
      
      localStorage.setItem("token", data.access_token);
      // ✅ Save role too (optional: save full user object if needed)
      localStorage.setItem("user", JSON.stringify({
        username: credentials.username,
        role: data.user_role,
      }));
  
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  register: async (user: RegisterUser) => {
    try {
      console.log("Sending register request to:", `${API_URL}/register`);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => localStorage.getItem("token"),

  getCurrentUser: (): RegisterUser | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Report service
export const reportService = {
  uploadReport: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      console.log("Uploading report to:", `${API_URL}/reports/analyze`);
      const response = await fetch(`${API_URL}/reports/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Report upload failed");
      }

      const data = await response.json();
      console.log("Analysis Result:", data.analysis);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getUserReports: async () => {
    try {
      console.log("Fetching user reports from:", `${API_URL}/reports`);
      const response = await fetch(`${API_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  getPendingReports: async () => {
    try {
      console.log("Fetching pending reports from:", `${API_URL}/reports/pending`);
      const response = await fetch(`${API_URL}/reports/pending`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending reports");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateReport: async (reportId: number, updateData: UpdateReportRequest) => {
    try {
      console.log("Updating report:", `${API_URL}/reports/${reportId}`);
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Diet service
export const dietService = {
  askQuestion: async (dietQuestion: DietQuestion) => {
    try {
      console.log("Sending diet question to:", `${API_URL}/diet/consult`);
      const response = await fetch(`${API_URL}/diet/consult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(dietQuestion),
      });

      if (!response.ok) {
        throw new Error("Failed to get diet consultation");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
