import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { prisma } from "@/db/prisma";

// GET /api/settings - Retrieve all site settings (public endpoint)
export const GET = withErrorHandler(async () => {
  const settings = await prisma.siteSettings.findMany();
  
  const mappedSettings: Record<string, string> = {};
  settings.forEach((setting) => {
    mappedSettings[setting.key] = setting.value;
  });

  return NextResponse.json({
    success: true,
    message: "Site settings retrieved successfully.",
    data: mappedSettings,
  });
});

// PUT /api/settings - Upsert site settings (protected by middleware since it is a write method)
export const PUT = withErrorHandler(async (req: Request) => {
  const body = await req.json();

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, message: "Invalid payload format. Expected JSON object." },
      { status: 400 }
    );
  }

  // Upsert settings in database
  await prisma.$transaction(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return NextResponse.json({
    success: true,
    message: "Site settings updated successfully.",
    data: body,
  });
});
