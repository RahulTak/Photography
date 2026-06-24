import apiClient from "../api-client";

export const dashboardService = {
  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },
};

export default dashboardService;
