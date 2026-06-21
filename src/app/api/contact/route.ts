import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { contactRepository } from "@/repositories/contact.repository";
import { contactValidator } from "@/validators";

// GET /api/contact - Retrieve all contact log entries
export const GET = withErrorHandler(async (req: Request) => {
  const submissions = await contactRepository.findMany();

  return NextResponse.json({
    success: true,
    message: "Contact submissions retrieved successfully.",
    data: submissions,
  });
});

// POST /api/contact - Submit general inquiry form
export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  // Validate the incoming contact payload using Zod
  const validated = contactValidator.parse(body);

  const inquiry = await contactRepository.create({
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    serviceType: validated.serviceType,
    date: validated.date,
    message: validated.message,
  });

  return NextResponse.json({
    success: true,
    message: `Thank you, ${validated.name}. Your inquiry has been sent to our client experience team.`,
    data: inquiry,
  });
});
