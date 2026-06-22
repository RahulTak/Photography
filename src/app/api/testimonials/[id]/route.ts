import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { testimonialRepository } from "@/repositories/testimonial.repository";
import { prisma } from "@/db/prisma";
import { verifyJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

// Helper to get active admin user
async function getAdminId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload ? (payload.id as string) : null;
}

// PUT /api/testimonials/[id] - Update a testimonial review
export const PUT = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { quote, author, role, avatar } = await req.json();
    const adminId = await getAdminId();

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found.", data: null },
        { status: 404 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { quote, author, role, avatar },
    });

    // Log the change
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    await prisma.activityLog.create({
      data: {
        adminUserId: adminId,
        action: "UPDATE_TESTIMONIAL",
        details: `Testimonial by ${author} updated.`,
        ipAddress,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully.",
      data: updated,
    });
  }
);

// DELETE /api/testimonials/[id] - Soft-delete a testimonial review
export const DELETE = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const adminId = await getAdminId();

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found.", data: null },
        { status: 404 }
      );
    }

    await testimonialRepository.delete(id);

    // Log the change
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    await prisma.activityLog.create({
      data: {
        adminUserId: adminId,
        action: "DELETE_TESTIMONIAL",
        details: `Testimonial by ${testimonial.author} soft-deleted.`,
        ipAddress,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial soft-deleted successfully.",
      data: null,
    });
  }
);
