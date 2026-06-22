import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
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

// PUT /api/contact/[id] - Mark inquiry as read/unread (admin only)
export const PUT = withErrorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { status } = await req.json();
    const adminId = await getAdminId();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required.", data: null },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contact.findUnique({ where: { id } });
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found.", data: null },
        { status: 404 }
      );
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    // Log the change
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    await prisma.activityLog.create({
      data: {
        adminUserId: adminId,
        action: "UPDATE_INQUIRY_STATUS",
        details: `Inquiry ${id} status marked as ${status}.`,
        ipAddress,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${status} successfully.`,
      data: updated,
    });
  }
);
