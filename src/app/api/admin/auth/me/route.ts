import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withErrorHandler } from "@/middlewares/error-handler";
import { verifyJWT } from "@/lib/jwt";

export const GET = withErrorHandler(async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated.", data: null },
      { status: 401 }
    );
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Invalid token session.", data: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Session user profile retrieved.",
    data: {
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    },
  });
});
