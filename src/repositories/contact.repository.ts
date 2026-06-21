import { prisma } from "@/db/prisma";

export const contactRepository = {
  // Create a contact inquiry
  async create(data: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    date?: string;
    message: string;
  }) {
    return prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        date: data.date || null,
        message: data.message,
      },
    });
  },

  // Get all active contact submissions
  async findMany() {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Soft delete contact inquiry
  async delete(id: string) {
    await prisma.contact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default contactRepository;
