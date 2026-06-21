import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  serviceType: z.string().min(1, { message: "Please select a service type." }),
  date: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormInputs = z.infer<typeof contactSchema>;
