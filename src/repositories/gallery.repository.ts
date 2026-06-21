import { prisma } from "@/db/prisma";

export const galleryRepository = {
  // Find all active gallery items with cursor/offset pagination and category filters
  async findMany(params: { category?: string; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 6;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (params.category && params.category !== "All") {
      where.category = {
        name: {
          equals: params.category,
        },
      };
    }

    const [items, totalCount] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
        },
      }),
      prisma.gallery.count({ where }),
    ]);

    const mappedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category.name,
      imageUrl: item.imageUrl,
      location: item.location,
      couple: item.couple,
      year: item.year,
    }));

    return {
      items: mappedItems,
      hasMore: skip + limit < totalCount,
    };
  },

  // Find a specific gallery item by ID
  async findById(id: string) {
    const item = await prisma.gallery.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      title: item.title,
      category: item.category.name,
      imageUrl: item.imageUrl,
      location: item.location,
      couple: item.couple,
      year: item.year,
    };
  },

  // Get list of active categories
  async findCategories() {
    const categories = await prisma.galleryCategory.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories.map((c) => c.name);
  },

  // Create gallery item, connecting to or creating the category
  async create(data: {
    title: string;
    category: string;
    imageUrl: string;
    location: string;
    couple: string;
    year: string;
  }) {
    // Find or create category
    const category = await prisma.galleryCategory.upsert({
      where: { name: data.category },
      update: {},
      create: { name: data.category },
    });

    const item = await prisma.gallery.create({
      data: {
        title: data.title,
        categoryId: category.id,
        imageUrl: data.imageUrl,
        location: data.location,
        couple: data.couple,
        year: data.year,
      },
      include: {
        category: true,
      },
    });

    return {
      id: item.id,
      title: item.title,
      category: item.category.name,
      imageUrl: item.imageUrl,
      location: item.location,
      couple: item.couple,
      year: item.year,
    };
  },

  // Update gallery item details
  async update(
    id: string,
    data: Partial<{
      title: string;
      category: string;
      imageUrl: string;
      location: string;
      couple: string;
      year: string;
    }>
  ) {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.imageUrl) updateData.imageUrl = data.imageUrl;
    if (data.location) updateData.location = data.location;
    if (data.couple) updateData.couple = data.couple;
    if (data.year) updateData.year = data.year;

    if (data.category) {
      const category = await prisma.galleryCategory.upsert({
        where: { name: data.category },
        update: {},
        create: { name: data.category },
      });
      updateData.categoryId = category.id;
    }

    const item = await prisma.gallery.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return {
      id: item.id,
      title: item.title,
      category: item.category.name,
      imageUrl: item.imageUrl,
      location: item.location,
      couple: item.couple,
      year: item.year,
    };
  },

  // Soft delete a gallery item
  async delete(id: string) {
    await prisma.gallery.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  },
};
export default galleryRepository;
