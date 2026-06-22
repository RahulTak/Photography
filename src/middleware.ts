import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 1. Redirect already logged-in users away from /admin/login
  if (pathname === "/admin/login") {
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect all pages under /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
    return NextResponse.next();
  }

  // 3. Protect write methods (POST, PUT, DELETE) on APIs, excluding public endpoints
  if (pathname.startsWith("/api")) {
    const method = req.method.toUpperCase();
    if (["POST", "PUT", "DELETE"].includes(method)) {
      const publicAPIPaths = [
        "/api/contact",
        "/api/bookings",
        "/api/workshops/register",
      ];
      
      // Check if it's a public form submission
      if (publicAPIPaths.some((path) => pathname === path)) {
        return NextResponse.next();
      }

      // Enforce auth token check
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Authentication token missing." },
          { status: 401 }
        );
      }

      const payload = await verifyJWT(token);
      if (!payload) {
        return NextResponse.json(
          { success: false, message: "Unauthorized: Invalid or expired token." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
