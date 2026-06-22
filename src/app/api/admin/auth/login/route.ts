import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { withErrorHandler } from "@/middlewares/error-handler";
import { prisma } from "@/db/prisma";
import { signJWT } from "@/lib/jwt";

export const POST = withErrorHandler(async (req: Request) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  // Find admin user in database
  const user = await prisma.adminUser.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Sign JWT session token
  const token = await signJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Get client IP address for log
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;

  // Log the login activity
  await prisma.activityLog.create({
    data: {
      adminUserId: user.id,
      action: "LOGIN",
      details: `Admin logged in successfully from IP: ${ipAddress}`,
      ipAddress,
    },
  });

  // Set the session cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return NextResponse.json({
    success: true,
    message: "Logged in successfully.",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
