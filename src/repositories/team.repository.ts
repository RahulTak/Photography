import { prisma } from "@/db/prisma";

export const teamRepository = {
  // Get all active team members
  async findMany() {
    return prisma.team.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  // Create a team member
  async create(data: { name: string; role: string; bio: string; imageUrl: string }) {
    return prisma.team.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl,
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
