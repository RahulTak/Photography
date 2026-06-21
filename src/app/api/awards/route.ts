import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { awardRepository } from "@/repositories/award.repository";

// GET /api/awards - Retrieve all active awards
export const GET = withErrorHandler(async (req: Request) => {
  const awards = await awardRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Awards retrieved successfully.",
    data: awards,
  });
});

// POST /api/awards - Add a new award entry
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  const award = await awardRepository.create({
    title: body.title,
    category: body.category,
    year: body.year,
    organization: body.organization,
  });

  return NextResponse.json({
    success: true,
    message: "Award entry created successfully.",
    data: award,
  });
});
