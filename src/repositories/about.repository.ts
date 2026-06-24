import { prisma } from "@/db/prisma";

export const aboutRepository = {
  // Get the active about content
  async find() {
    const [content, awards, team, homeDoc] = await Promise.all([
      prisma.aboutContent.findFirst({
        where: {
          deletedAt: null,
        },
      }),
      prisma.award.findMany({
        where: {
          deletedAt: null,
          active: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
      prisma.team.findMany({
        where: {
          deletedAt: null,
          active: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
      prisma.homeContent.findFirst({
        where: {
          deletedAt: null,
        },
      }),
    ]);

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
      awards: awards.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        year: a.year,
        organization: a.organization,
        imageUrl: a.imageUrl,
        description: a.description,
        sortOrder: a.sortOrder,
        active: a.active,
      })),
      team: team.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        bio: t.bio,
        imageUrl: t.imageUrl,
        sortOrder: t.sortOrder,
        active: t.active,
      })),
      stats: homeDoc?.stats || [],
    };
  },

  // Create or update active about content
  async upsert(data: {
    hero: { title: string; subtitle: string; description: string; image: string };
    founders: { title: string; subtitle: string; storyParagraphs: string[]; images: { sujay: string; shreyanka: string } };
    missionVision: { mission: { title: string; description: string }; vision: { title: string; description: string } };
    timeline: any[];
    process: any[];
    stats?: any[];
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

    // Save stats to HomeContent if provided
    if (data.stats) {
      const homeDoc = await prisma.homeContent.findFirst({
        where: { deletedAt: null },
      });
      if (homeDoc) {
        await prisma.homeContent.update({
          where: { id: homeDoc.id },
          data: {
            stats: data.stats,
          },
        });
      }
    }

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
