import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withErrorHandler } from "@/middlewares/error-handler";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/db/prisma";

export const POST = withErrorHandler(async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token) {
    const payload = await verifyJWT(token);
    if (payload && typeof payload === "object" && "id" in payload) {
      const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
      
      // Log logout activity
      await prisma.activityLog.create({
        data: {
          adminUserId: payload.id as string,
          action: "LOGOUT",
          details: `Admin logged out successfully.`,
          ipAddress,
        },
      });
    }
  }

  // Clear session cookie
  cookieStore.delete("admin_token");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
    data: null,
  });
});
