import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { teamRepository } from "@/repositories/team.repository";

// PUT /api/team/[id] - Update a team member
export const PUT = withErrorHandler(async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const body = await req.json();

  const member = await teamRepository.update(id, {
    name: body.name,
    role: body.role,
    bio: body.bio,
    imageUrl: body.imageUrl,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    active: body.active !== undefined ? Boolean(body.active) : undefined,
  });

  return NextResponse.json({
    success: true,
    message: "Team member updated successfully.",
    data: member,
  });
});

// DELETE /api/team/[id] - Soft delete a team member
export const DELETE = withErrorHandler(async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  await teamRepository.delete(id);

  return NextResponse.json({
    success: true,
    message: "Team member deleted successfully.",
  });
});
