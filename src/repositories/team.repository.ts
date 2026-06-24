import { prisma } from "@/db/prisma";

export const teamRepository = {
  // Get all active team members (not soft-deleted)
  async findMany() {
    return prisma.team.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  },

  // Create a team member
  async create(data: { name: string; role: string; bio: string; imageUrl: string; sortOrder?: number; active?: boolean }) {
    return prisma.team.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder ?? 0,
        active: data.active ?? true,
      },
    });
  },

  // Update a team member
  async update(id: string, data: { name?: string; role?: string; bio?: string; imageUrl?: string; sortOrder?: number; active?: boolean }) {
    return prisma.team.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder,
        active: data.active,
      },
    });
  },

  // Soft delete a team member
  async delete(id: string) {
    await prisma.team.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default teamRepository;
