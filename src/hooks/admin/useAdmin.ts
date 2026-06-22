import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "@/services/admin/admin.service";

export function useAdminMe() {
  return useQuery({
    queryKey: ["adminMe"],
    queryFn: adminService.getMe,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminMe"], data);
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["adminMe"], null);
      queryClient.invalidateQueries();
    },
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 60000, // Auto refetch every minute
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: adminService.getSettings,
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["adminSettings"], data);
    },
  });
}
