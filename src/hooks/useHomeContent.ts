import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import homeService from "@/services/home/home.service";

export function useHomeContent() {
  return useQuery({
    queryKey: ["homeContent"],
    queryFn: homeService.getHomeContent,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useUpdateHomeContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeService.updateHomeContent,
    onSuccess: (data) => {
      queryClient.setQueryData(["homeContent"], data);
    },
  });
}
