import { prisma } from "@/db/prisma";

export const awardRepository = {
  // Get all active awards
  async findMany() {
    return prisma.award.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        year: "desc",
      },
    });
  },

  // Create an award
  async create(data: { title: string; category: string; year: string; organization: string }) {
    return prisma.award.create({
      data: {
        title: data.title,
        category: data.category,
        year: data.year,
        organization: data.organization,
      },
    });
  },

  // Soft delete an award
  async delete(id: string) {
    await prisma.award.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default awardRepository;
