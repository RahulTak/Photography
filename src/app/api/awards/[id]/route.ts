import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { awardRepository } from "@/repositories/award.repository";

// PUT /api/awards/[id] - Update an award entry
export const PUT = withErrorHandler(async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const body = await req.json();

  const award = await awardRepository.update(id, {
    title: body.title,
    category: body.category,
    year: body.year,
    organization: body.organization,
    imageUrl: body.imageUrl,
    description: body.description,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    active: body.active !== undefined ? Boolean(body.active) : undefined,
  });

  return NextResponse.json({
    success: true,
    message: "Award entry updated successfully.",
    data: award,
  });
});

// DELETE /api/awards/[id] - Soft delete an award entry
export const DELETE = withErrorHandler(async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  await awardRepository.delete(id);

  return NextResponse.json({
    success: true,
    message: "Award entry deleted successfully.",
  });
});
