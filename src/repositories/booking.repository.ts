import { prisma } from "@/db/prisma";

export const bookingRepository = {
  // Create an event booking
  async create(data: {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    eventType: string;
    message: string;
  }) {
    return prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate,
        eventType: data.eventType,
        message: data.message,
      },
    });
  },

  // Get all active bookings
  async findMany() {
    return prisma.booking.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Soft delete event booking
  async delete(id: string) {
    await prisma.booking.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default bookingRepository;
