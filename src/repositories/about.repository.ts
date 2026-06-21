import { prisma } from "@/db/prisma";

export const aboutRepository = {
  // Get the active about content
  async find() {
    const content = await prisma.aboutContent.findFirst({
      where: {
        deletedAt: null,
      },
    });

    if (!content) return null;

    return {
      hero: {
        title: content.heroTitle,
        subtitle: content.heroSubtitle,
        description: content.heroDescription,
        image: content.heroImage,
      },
      founders: {
        title: content.founderTitle,
        subtitle: content.founderSubtitle,
        storyParagraphs: Array.isArray(content.founderStory) ? (content.founderStory as string[]) : [],
        images: {
          sujay: content.founderImageSujay,
          shreyanka: content.founderImageShreyanka,
        },
      },
      missionVision: {
        mission: {
          title: content.missionTitle,
          description: content.missionDescription,
        },
        vision: {
          title: content.visionTitle,
          description: content.visionDescription,
        },
      },
      timeline: Array.isArray(content.timeline) ? (content.timeline as any[]) : [],
      process: Array.isArray(content.process) ? (content.process as any[]) : [],
    };
  },

  // Create or update active about content
  async upsert(data: {
    hero: { title: string; subtitle: string; description: string; image: string };
    founders: { title: string; subtitle: string; storyParagraphs: string[]; images: { sujay: string; shreyanka: string } };
    missionVision: { mission: { title: string; description: string }; vision: { title: string; description: string } };
    timeline: any[];
    process: any[];
  }) {
    const existing = await prisma.aboutContent.findFirst({
      where: { deletedAt: null },
    });

    const docData = {
      heroTitle: data.hero.title,
      heroSubtitle: data.hero.subtitle,
      heroDescription: data.hero.description,
      heroImage: data.hero.image,
      founderTitle: data.founders.title,
      founderSubtitle: data.founders.subtitle,
      founderStory: data.founders.storyParagraphs,
      founderImageSujay: data.founders.images.sujay,
      founderImageShreyanka: data.founders.images.shreyanka,
      missionTitle: data.missionVision.mission.title,
      missionDescription: data.missionVision.mission.description,
      visionTitle: data.missionVision.vision.title,
      visionDescription: data.missionVision.vision.description,
      timeline: data.timeline,
      process: data.process,
    };

    if (existing) {
      return prisma.aboutContent.update({
        where: { id: existing.id },
        data: docData,
      });
    }

    return prisma.aboutContent.create({
      data: docData,
    });
  },
};
export default aboutRepository;
