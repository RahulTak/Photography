import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { galleryRepository } from "@/repositories/gallery.repository";

// GET /api/gallery/[id] - Fetch specific item details
export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const item = await galleryRepository.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item details retrieved.",
      data: item,
    });
  }
);

// PUT /api/gallery/[id] - Update item metadata
export const PUT = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();

    const updated = await galleryRepository.update(id, body);

    return NextResponse.json({
      success: true,
      message: "Gallery item updated successfully.",
      data: updated,
    });
  }
);

// DELETE /api/gallery/[id] - Soft-delete a gallery item
export const DELETE = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await galleryRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Gallery item soft-deleted successfully.",
      data: null,
    });
  }
);
