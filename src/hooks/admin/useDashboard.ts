import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/admin/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await dashboardService.getDashboardStats();
      if (response && response.success) {
        return response;
      }
      throw new Error(response?.message || "Failed to fetch dashboard data");
    },
    refetchInterval: 30000, // Auto-refetch every 30 seconds for real-time feeling
    staleTime: 5000,
  });
}

export default useDashboard;
