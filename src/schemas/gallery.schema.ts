import { z } from "zod";

export const galleryCategorySchema = z.enum([
  "Wedding",
  "Pre-wedding",
  "Cinematic",
  "Traditional",
  "Destination",
]);

export const galleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: galleryCategorySchema,
  imageUrl: z.string(),
  location: z.string(),
  couple: z.string(),
  year: z.string(),
});

export const galleryResponseSchema = z.object({
  items: z.array(galleryItemSchema),
  hasMore: z.boolean(),
});
