import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { workshopRepository } from "@/repositories/workshop.repository";
import { workshopRegistrationValidator } from "@/validators";

// POST /api/workshops/register - Book a seat for a workshop (atomic transaction)
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  // Validate incoming booking request using Zod
  const validated = workshopRegistrationValidator.parse(body);

  const reg = await workshopRepository.register({
    workshopId: validated.workshopId,
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    seats: validated.seats,
  });

  return NextResponse.json({
    success: true,
    message: `Bespoke booking confirmed for ${validated.name}. ${validated.seats} seat(s) reserved.`,
    data: {
      bookingId: reg.id,
      seatsBooked: reg.seats,
      workshopId: reg.workshopId,
    },
  });
});
