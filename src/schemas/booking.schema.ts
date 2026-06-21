import { z } from "zod";

// Workshop seat bookings
export const workshopBookingSchema = z.object({
  workshopId: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  seats: z.number().min(1).max(4),
});

// Event/Photography bookings
export const eventBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  eventDate: z.string().min(1, { message: "Event date is required." }),
  eventType: z.string().min(1, { message: "Event type is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type WorkshopBookingInputs = z.infer<typeof workshopBookingSchema>;
export type EventBookingInputs = z.infer<typeof eventBookingSchema>;
