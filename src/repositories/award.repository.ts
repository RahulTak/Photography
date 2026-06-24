import { prisma } from "@/db/prisma";

export const awardRepository = {
  // Get all active awards (not soft-deleted)
  async findMany() {
    return prisma.award.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  },

  // Create an award
  async create(data: {
    title: string;
    category: string;
    year: string;
    organization: string;
    imageUrl?: string | null;
    description?: string | null;
    sortOrder?: number;
    active?: boolean;
  }) {
    return prisma.award.create({
      data: {
        title: data.title,
        category: data.category,
        year: data.year,
        organization: data.organization,
        imageUrl: data.imageUrl,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
      },
    });
  },

  // Update an award
  async update(
    id: string,
    data: {
      title?: string;
      category?: string;
      year?: string;
      organization?: string;
      imageUrl?: string | null;
      description?: string | null;
      sortOrder?: number;
      active?: boolean;
    }
  ) {
    return prisma.award.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        year: data.year,
        organization: data.organization,
        imageUrl: data.imageUrl,
        description: data.description,
        sortOrder: data.sortOrder,
        active: data.active,
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
