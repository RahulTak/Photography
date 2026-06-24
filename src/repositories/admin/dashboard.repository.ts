import { prisma } from "@/db/prisma";

export const dashboardRepository = {
  async getDashboardData() {
    const [
      totalBookings,
      totalInquiries,
      totalWorkshops,
      totalWorkshopRegistrations,
      totalGalleryImages,
      totalTestimonials,
      totalTeamMembers,
      totalAwards,
      recentBookings,
      recentInquiries,
      recentGalleryUploads,
      upcomingWorkshops,
      recentLogs,
    ] = await Promise.all([
      // Counts
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { deletedAt: null } }),
      prisma.workshop.count({ where: { deletedAt: null } }),
      prisma.workshopRegistration.count({ where: { deletedAt: null } }),
      prisma.gallery.count({ where: { deletedAt: null } }),
      prisma.testimonial.count({ where: { deletedAt: null } }),
      prisma.team.count({ where: { deletedAt: null } }),
      prisma.award.count({ where: { deletedAt: null } }),

      // Lists
      prisma.booking.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.contact.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.gallery.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.workshop.findMany({
        where: { deletedAt: null },
        orderBy: { date: "asc" },
        take: 5,
      }),

      // Activity logs
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Monthly Analytics
    const allBookings = await prisma.booking.findMany({
      where: { deletedAt: null },
      select: { createdAt: true },
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const analyticsMap: Record<string, number> = {};
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      analyticsMap[`${monthNames[i]} ${currentYear}`] = 0;
    }

    allBookings.forEach((b) => {
      const d = new Date(b.createdAt);
      if (d.getFullYear() === currentYear) {
        const monthStr = `${monthNames[d.getMonth()]} ${currentYear}`;
        analyticsMap[monthStr] = (analyticsMap[monthStr] || 0) + 1;
      }
    });

    const monthlyAnalytics = Object.entries(analyticsMap).map(([name, value]) => ({
      name,
      bookings: value,
    }));

    return {
      metrics: {
        totalBookings,
        totalInquiries,
        totalWorkshops,
        totalWorkshopRegistrations,
        totalRegistrations: totalWorkshopRegistrations,
        totalGalleryImages,
        totalTestimonials,
        totalTeamMembers,
        totalAwards,
      },
      recentBookings,
      recentInquiries,
      recentGalleryUploads,
      upcomingWorkshops,
      recentActivityLogs: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        details: log.details,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
        adminName: log.adminUser?.name || "System",
      })),
      monthlyAnalytics,
    };
  },
};

export default dashboardRepository;
