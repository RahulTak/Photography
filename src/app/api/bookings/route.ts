import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { bookingRepository } from "@/repositories/booking.repository";
import { eventBookingValidator } from "@/validators";

// GET /api/bookings - Fetch all event bookings
export const GET = withErrorHandler(async (req: Request) => {
  const bookings = await bookingRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Event bookings retrieved successfully.",
    data: bookings,
  });
});

// POST /api/bookings - Create event booking
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  // Validate event booking schema
  const validated = eventBookingValidator.parse(body);

  const booking = await bookingRepository.create({
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    eventDate: validated.eventDate,
    eventType: validated.eventType,
    message: validated.message,
  });

  return NextResponse.json({
    success: true,
    message: `Bespoke photography date reserved for ${validated.name} on ${validated.eventDate}.`,
    data: {
      bookingId: booking.id,
      name: booking.name,
      eventDate: booking.eventDate,
      eventType: booking.eventType,
    },
  });
});
