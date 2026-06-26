import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { galleryRepository } from "@/repositories/gallery.repository";
import { galleryMetadataValidator } from "@/validators";

// GET /api/gallery - Fetch paginated and filtered gallery items
export const GET = withErrorHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const activeStr = searchParams.get("active");
  const active = activeStr !== null ? activeStr === "true" : undefined;
  const featuredStr = searchParams.get("featured");
  const featured = featuredStr !== null ? featuredStr === "true" : undefined;

  const result = await galleryRepository.findMany({ category, page, limit, active, featured });

  return NextResponse.json({
    success: true,
    message: "Gallery items retrieved successfully.",
    data: result,
  });
});

// POST /api/gallery - Create a new gallery item
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  // Validate request payload structure
  const validated = galleryMetadataValidator.parse(body);

  const item = await galleryRepository.create({
    title: validated.title,
    slug: validated.slug,
    category: validated.category,
    coverImage: validated.coverImage || validated.imageUrl || body.imageUrl || "",
    description: validated.description || undefined,
    location: validated.location,
    couple: validated.couple,
    year: validated.year,
    active: validated.active,
    featured: validated.featured,
    images: validated.images,
  });

  return NextResponse.json({
    success: true,
    message: "Gallery item created successfully.",
    data: item,
  });
});
