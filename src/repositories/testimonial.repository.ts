import { prisma } from "@/db/prisma";

export const testimonialRepository = {
  // Get all active testimonials
  async findMany() {
    return prisma.testimonial.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Create a testimonial
  async create(data: { quote: string; author: string; role: string; avatar: string }) {
    return prisma.testimonial.create({
      data: {
        quote: data.quote,
        author: data.author,
        role: data.role,
        avatar: data.avatar,
      },
    });
  },

  // Soft delete a testimonial
  async delete(id: string) {
    await prisma.testimonial.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default testimonialRepository;
