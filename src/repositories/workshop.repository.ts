import { prisma } from "@/db/prisma";

export const workshopRepository = {
  // Find all active workshops
  async findMany() {
    const list = await prisma.workshop.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        date: "asc",
      },
    });

    return list.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      longDescription: w.longDescription,
      date: w.date,
      time: w.time,
      price: w.price,
      currency: w.currency,
      seatsTotal: w.seatsTotal,
      seatsAvailable: w.seatsAvailable,
      instructor: w.instructor,
      location: w.location,
      image: w.image,
      syllabus: Array.isArray(w.syllabus) ? (w.syllabus as string[]) : [],
    }));
  },

  // Find a specific workshop by ID
  async findById(id: string) {
    const w = await prisma.workshop.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        registrations: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!w) return null;

    return {
      id: w.id,
      title: w.title,
      description: w.description,
      longDescription: w.longDescription,
      date: w.date,
      time: w.time,
      price: w.price,
      currency: w.currency,
      seatsTotal: w.seatsTotal,
      seatsAvailable: w.seatsAvailable,
      instructor: w.instructor,
      location: w.location,
      image: w.image,
      syllabus: Array.isArray(w.syllabus) ? (w.syllabus as string[]) : [],
      registrations: w.registrations.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        seats: r.seats,
        createdAt: r.createdAt,
      })),
    };
  },

  // Create workshop
  async create(data: {
    title: string;
    description: string;
    longDescription: string;
    date: string;
    time: string;
    price: number;
    currency?: string;
    seatsTotal: number;
    instructor: string;
    location: string;
    image: string;
    syllabus: string[];
  }) {
    const w = await prisma.workshop.create({
      data: {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        date: data.date,
        time: data.time,
        price: data.price,
        currency: data.currency || "INR",
        seatsTotal: data.seatsTotal,
        seatsAvailable: data.seatsTotal, // Initially equal to total
        instructor: data.instructor,
        location: data.location,
        image: data.image,
        syllabus: data.syllabus,
      },
    });

    return {
      id: w.id,
      title: w.title,
      description: w.description,
      longDescription: w.longDescription,
      date: w.date,
      time: w.time,
      price: w.price,
      currency: w.currency,
      seatsTotal: w.seatsTotal,
      seatsAvailable: w.seatsAvailable,
      instructor: w.instructor,
      location: w.location,
      image: w.image,
      syllabus: w.syllabus as string[],
    };
  },

  // Update workshop details
  async update(id: string, data: Partial<any>) {
    const updateData = { ...data };
    
    // If seatsTotal changes, recalculate seatsAvailable appropriately
    if (data.seatsTotal !== undefined) {
      const current = await prisma.workshop.findUnique({ where: { id } });
      if (current) {
        const booked = current.seatsTotal - current.seatsAvailable;
        updateData.seatsAvailable = data.seatsTotal - booked;
      }
    }

    const w = await prisma.workshop.update({
      where: { id },
      data: updateData,
    });

    return {
      id: w.id,
      title: w.title,
      description: w.description,
      longDescription: w.longDescription,
      date: w.date,
      time: w.time,
      price: w.price,
      currency: w.currency,
      seatsTotal: w.seatsTotal,
      seatsAvailable: w.seatsAvailable,
      instructor: w.instructor,
      location: w.location,
      image: w.image,
      syllabus: w.syllabus as string[],
    };
  },

  // Soft delete a workshop
  async delete(id: string) {
    await prisma.workshop.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },

  // Register a participant for a workshop, reducing seats atomically
  async register(registration: {
    workshopId: string;
    name: string;
    email: string;
    phone: string;
    seats: number;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch current workshop state
      const workshop = await tx.workshop.findUnique({
        where: { id: registration.workshopId },
      });

      if (!workshop || workshop.deletedAt) {
        throw new Error("Workshop not found or inactive.");
      }

      if (workshop.seatsAvailable < registration.seats) {
        throw new Error(`Insufficient seats available. Only ${workshop.seatsAvailable} left.`);
      }

      // 2. Decrement seatsAvailable on workshop
      await tx.workshop.update({
        where: { id: registration.workshopId },
        data: {
          seatsAvailable: {
            decrement: registration.seats,
          },
        },
      });

      // 3. Create the registration record
      const reg = await tx.workshopRegistration.create({
        data: {
          workshopId: registration.workshopId,
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          seats: registration.seats,
        },
      });

      return reg;
    });
  },
};
export default workshopRepository;
