import { prisma } from "@/db/prisma";

export const galleryRepository = {
  // Find all active gallery items with cursor/offset pagination and category filters
  async findMany(params: {
    category?: string;
    page?: number;
    limit?: number;
    active?: boolean;
    featured?: boolean;
  }) {
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

    if (params.active !== undefined) {
      where.active = params.active;
    }

    if (params.featured !== undefined) {
      where.featured = params.featured;
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
      slug: item.slug,
      category: item.category.name,
      coverImage: item.coverImage,
      imageUrl: item.coverImage || item.imageUrl, // fallback mapping
      location: item.location,
      couple: item.couple,
      year: item.year,
      featured: item.featured,
      active: item.active,
      description: item.description,
    }));

    return {
      items: mappedItems,
      hasMore: skip + limit < totalCount,
    };
  },

  // Find a specific gallery item by ID or Slug
  async findBySlugOrId(idOrSlug: string) {
    const item = await prisma.gallery.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc"
          }
        }
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category.name,
      coverImage: item.coverImage,
      imageUrl: item.coverImage || item.imageUrl,
      description: item.description,
      location: item.location,
      couple: item.couple,
      year: item.year,
      active: item.active,
      featured: item.featured,
      images: item.images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
      })),
    };
  },

  // Find a specific gallery item by ID (kept for backward compatibility with simple routes)
  async findById(id: string) {
    return this.findBySlugOrId(id);
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
    slug?: string;
    category: string;
    coverImage: string;
    description?: string;
    location: string;
    couple: string;
    year: string;
    active?: boolean;
    featured?: boolean;
    images?: string[];
  }) {
    // Find or create category
    const category = await prisma.galleryCategory.upsert({
      where: { name: data.category },
      update: {},
      create: { name: data.category },
    });

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const item = await prisma.gallery.create({
      data: {
        title: data.title,
        slug,
        categoryId: category.id,
        coverImage: data.coverImage,
        imageUrl: data.coverImage,
        location: data.location,
        couple: data.couple,
        year: data.year,
        description: data.description || "",
        active: data.active !== undefined ? data.active : true,
        featured: data.featured !== undefined ? data.featured : false,
        images: data.images && data.images.length > 0 ? {
          create: data.images.map((imgUrl, idx) => ({
            imageUrl: imgUrl,
            sortOrder: idx,
          }))
        } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc"
          }
        }
      },
    });

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category.name,
      coverImage: item.coverImage,
      imageUrl: item.coverImage,
      description: item.description,
      location: item.location,
      couple: item.couple,
      year: item.year,
      active: item.active,
      featured: item.featured,
      images: item.images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
      })),
    };
  },

  // Update gallery item details
  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      category: string;
      coverImage: string;
      description: string;
      location: string;
      couple: string;
      year: string;
      active: boolean;
      featured: boolean;
      images: string[];
    }>
  ) {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.coverImage) {
      updateData.coverImage = data.coverImage;
      updateData.imageUrl = data.coverImage;
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.couple !== undefined) updateData.couple = data.couple;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.featured !== undefined) updateData.featured = data.featured;

    if (data.category) {
      const category = await prisma.galleryCategory.upsert({
        where: { name: data.category },
        update: {},
        create: { name: data.category },
      });
      updateData.categoryId = category.id;
    }

    if (data.images) {
      // First clean existing associated images
      await prisma.galleryImage.deleteMany({
        where: { galleryId: id },
      });

      // Insert new ordered list of images
      if (data.images.length > 0) {
        updateData.images = {
          create: data.images.map((imgUrl, idx) => ({
            imageUrl: imgUrl,
            sortOrder: idx,
          })),
        };
      }
    }

    const item = await prisma.gallery.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc"
          }
        }
      },
    });

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category.name,
      coverImage: item.coverImage,
      imageUrl: item.coverImage,
      description: item.description,
      location: item.location,
      couple: item.couple,
      year: item.year,
      active: item.active,
      featured: item.featured,
      images: item.images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
      })),
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
