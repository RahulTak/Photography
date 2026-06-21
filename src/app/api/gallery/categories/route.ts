import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { galleryRepository } from "@/repositories/gallery.repository";

// GET /api/gallery/categories - Retrieve all active gallery category names
export const GET = withErrorHandler(async (req: Request) => {
  const categories = await galleryRepository.findCategories();

  return NextResponse.json({
    success: true,
    message: "Gallery categories retrieved successfully.",
    data: categories,
  });
});
