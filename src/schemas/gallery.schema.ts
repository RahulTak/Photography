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
  slug: z.string().optional(),
  category: galleryCategorySchema,
  coverImage: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional().nullable(),
  location: z.string(),
  couple: z.string(),
  year: z.string(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  images: z
    .array(
      z.object({
        id: z.string(),
        imageUrl: z.string(),
        sortOrder: z.number(),
      })
    )
    .optional(),
});

export const galleryResponseSchema = z.object({
  items: z.array(galleryItemSchema),
  hasMore: z.boolean(),
});
