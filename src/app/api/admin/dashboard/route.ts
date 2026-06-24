import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { dashboardRepository } from "@/repositories/admin/dashboard.repository";

// GET /api/admin/dashboard - Retrieve real-time dashboard analytics
export const GET = withErrorHandler(async () => {
  const data = await dashboardRepository.getDashboardData();

  return NextResponse.json({
    success: true,
    message: "Admin dashboard stats retrieved successfully.",
    data,
  });
});
