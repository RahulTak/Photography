import { z } from "zod";
import { contactSchema } from "@/schemas/contact.schema";
import { eventBookingSchema, workshopBookingSchema } from "@/schemas/booking.schema";
import { galleryCategorySchema } from "@/schemas/gallery.schema";

// Re-export existing validations to keep them centralized
export const contactValidator = contactSchema;
export const eventBookingValidator = eventBookingSchema;
export const workshopRegistrationValidator = workshopBookingSchema;

// Gallery metadata validation
export const galleryMetadataValidator = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  category: galleryCategorySchema,
  location: z.string().min(2, { message: "Location is required." }),
  couple: z.string().min(2, { message: "Couple name/details are required." }),
  year: z.string().regex(/^\d{4}$/, { message: "Year must be a 4-digit number." }),
});

// File validation helper
export const fileValidator = z.object({
  file: z.any()
    .refine((file) => file && (file instanceof File || file instanceof Blob || typeof file === "object"), {
      message: "A file upload is required.",
    })
    .refine((file: any) => {
      if (!file) return false;
      const type = file.type || "";
      return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(type);
    }, {
      message: "Unsupported file type. Only JPEG, PNG, and WebP are allowed.",
    })
    .refine((file: any) => {
      if (!file) return false;
      const size = file.size || 0;
      return size <= 10 * 1024 * 1024; // 10MB limit
    }, {
      message: "File is too large. Maximum size allowed is 10MB.",
    }),
});
