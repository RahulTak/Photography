import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { testimonialRepository } from "@/repositories/testimonial.repository";

// GET /api/testimonials - Fetch all active testimonials
export const GET = withErrorHandler(async (req: Request) => {
  const testimonials = await testimonialRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Testimonials retrieved successfully.",
    data: testimonials,
  });
});

// POST /api/testimonials - Add a new testimonial review
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  const testimonial = await testimonialRepository.create({
    quote: body.quote,
    author: body.author,
    role: body.role,
    avatar: body.avatar,
  });

  return NextResponse.json({
    success: true,
    message: "Testimonial created successfully.",
    data: testimonial,
  });
});
