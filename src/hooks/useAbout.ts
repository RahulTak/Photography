import { useQuery } from "@tanstack/react-query";
import aboutService from "@/services/about/about.service";

export function useAboutData() {
  return useQuery({
    queryKey: ["aboutData"],
    queryFn: aboutService.getAboutData,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: aboutService.getTeam,
    staleTime: 60 * 60 * 1000,
  });
}

export function useAwards() {
  return useQuery({
    queryKey: ["awards"],
    queryFn: aboutService.getAwards,
    staleTime: 60 * 60 * 1000,
  });
}
