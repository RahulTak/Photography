import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { teamRepository } from "@/repositories/team.repository";

// GET /api/team - Fetch all active team members
export const GET = withErrorHandler(async (req: Request) => {
  const team = await teamRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Team members retrieved successfully.",
    data: team,
  });
});

// POST /api/team - Add a new team member
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  const member = await teamRepository.create({
    name: body.name,
    role: body.role,
    bio: body.bio,
    imageUrl: body.imageUrl,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    active: body.active !== undefined ? Boolean(body.active) : true,
  });

  return NextResponse.json({
    success: true,
    message: "Team member added successfully.",
    data: member,
  });
});
