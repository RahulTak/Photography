import { z } from "zod";

export const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  avatar: z.string(),
});

export const testimonialsResponseSchema = z.array(testimonialSchema);
