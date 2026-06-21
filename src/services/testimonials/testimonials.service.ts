import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { HOME_CONTENT } from "@/constants/content";
import { testimonialsResponseSchema } from "@/schemas/testimonial.schema";
import { Testimonial } from "@/types";

export const testimonialsService = {
  // GET /testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TESTIMONIALS);
      const parsed = testimonialsResponseSchema.safeParse(response.data);
      if (parsed.success) {
        return parsed.data;
      }
      throw new Error("Validation mismatch");
    } catch (error) {
      console.warn("Testimonials API failed: returning local feedback constants.");
      return [...HOME_CONTENT.testimonials] as Testimonial[];
    }
  }
};
export default testimonialsService;
