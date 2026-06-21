import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { workshopRepository } from "@/repositories/workshop.repository";

// GET /api/workshops/[id] - Fetch specific workshop cohort details
export const GET = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const workshop = await workshopRepository.findById(id);

    if (!workshop) {
      return NextResponse.json(
        { success: false, message: "Workshop not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Workshop details retrieved.",
      data: workshop,
    });
  }
);

// PUT /api/workshops/[id] - Update workshop details
export const PUT = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();

    const updated = await workshopRepository.update(id, body);

    return NextResponse.json({
      success: true,
      message: "Workshop updated successfully.",
      data: updated,
    });
  }
);

// DELETE /api/workshops/[id] - Soft-delete a workshop cohort
export const DELETE = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await workshopRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Workshop soft-deleted successfully.",
      data: null,
    });
  }
);
