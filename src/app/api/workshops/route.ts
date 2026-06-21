import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { workshopRepository } from "@/repositories/workshop.repository";

// GET /api/workshops - Fetch all active workshop cohorts
export const GET = withErrorHandler(async (req: Request) => {
  const workshops = await workshopRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Workshops retrieved successfully.",
    data: workshops,
  });
});

// POST /api/workshops - Create a new workshop cohort
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  const workshop = await workshopRepository.create({
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    date: body.date,
    time: body.time,
    price: parseFloat(body.price),
    currency: body.currency,
    seatsTotal: parseInt(body.seatsTotal, 10),
    instructor: body.instructor,
    location: body.location,
    image: body.image,
    syllabus: body.syllabus || [],
  });

  return NextResponse.json({
    success: true,
    message: "Workshop created successfully.",
    data: workshop,
  });
});
