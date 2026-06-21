import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import workshopsService from "@/services/workshops/workshops.service";
import { WorkshopBookingSubmission } from "@/types";

export function useWorkshops() {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: workshopsService.getWorkshops,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useRegisterWorkshop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: WorkshopBookingSubmission) =>
      workshopsService.registerWorkshop(payload),
    onSuccess: () => {
      // Refresh workshops data to update seat counts
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
    },
  });
}
