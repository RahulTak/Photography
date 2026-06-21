import { z } from "zod";

export const workshopSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  longDescription: z.string(),
  date: z.string(),
  time: z.string(),
  price: z.number(),
  currency: z.string(),
  seatsTotal: z.number(),
  seatsAvailable: z.number(),
  instructor: z.string(),
  location: z.string(),
  image: z.string(),
  syllabus: z.array(z.string()),
});

export const pastWorkshopSchema = z.object({
  id: z.string(),
  title: z.string(),
  participants: z.number(),
  duration: z.string(),
  location: z.string(),
  image: z.string(),
});
