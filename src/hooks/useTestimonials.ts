import { useQuery } from "@tanstack/react-query";
import testimonialsService from "@/services/testimonials/testimonials.service";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialsService.getTestimonials,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
}
