import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { aboutRepository } from "@/repositories/about.repository";

// GET /api/about - Retrieve about content
export const GET = withErrorHandler(async (req: Request) => {
  const content = await aboutRepository.find();

  if (!content) {
    return NextResponse.json(
      { success: false, message: "About content configuration not found.", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "About content retrieved successfully.",
    data: content,
  });
});

// PUT /api/about - Update/upsert about content configuration
export const PUT = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  const content = await aboutRepository.upsert({
    hero: body.hero,
    founders: body.founders,
    missionVision: body.missionVision,
    timeline: body.timeline || [],
    process: body.process || [],
    stats: body.stats,
  });

  return NextResponse.json({
    success: true,
    message: "About content configuration updated successfully.",
    data: content,
  });
});
