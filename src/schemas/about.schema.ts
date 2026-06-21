import { z } from "zod";

export const timelineEventSchema = z.object({
  year: z.string(),
  title: z.string(),
  description: z.string(),
});

export const awardSchema = z.object({
  title: z.string(),
  category: z.string(),
  year: z.string(),
  organization: z.string(),
});

export const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  imageUrl: z.string(),
});

export const processStepSchema = z.object({
  step: z.string(),
  title: z.string(),
  description: z.string(),
});

export const aboutDataSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    image: z.string(),
  }),
  founders: z.object({
    title: z.string(),
    subtitle: z.string(),
    storyParagraphs: z.array(z.string()),
    images: z.object({
      sujay: z.string(),
      shreyanka: z.string(),
    }),
  }),
  missionVision: z.object({
    mission: z.object({
      title: z.string(),
      description: z.string(),
    }),
    vision: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
  timeline: z.array(timelineEventSchema),
  awards: z.array(awardSchema),
  team: z.array(teamMemberSchema),
  process: z.array(processStepSchema),
});
