import apiClient from "../api-client";

export const adminService = {
  // Auth actions
  login: async (payload: any) => {
    const response = await apiClient.post("/admin/auth/login", payload);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/admin/auth/logout");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/admin/auth/me");
    return response.data;
  },

  // Dashboard analytics
  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  // Configuration settings
  getSettings: async () => {
    const response = await apiClient.get("/settings");
    return response.data;
  },
  updateSettings: async (payload: any) => {
    const response = await apiClient.put("/settings", payload);
    return response.data;
  },
};
export default adminService;
