import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withErrorHandler } from "@/middlewares/error-handler";
import { prisma } from "@/db/prisma";
import { verifyJWT } from "@/lib/jwt";
import { HOME_CONTENT } from "@/constants/content";

// Helper to extract active admin user session
async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyJWT(token);
}

// Helper to map DB row to frontend expectations
function mapDbToHomeStructure(doc: any) {
  return {
    hero: {
      title: doc.heroTitle,
      subtitle: doc.heroSubtitle,
      description: doc.heroDescription,
      ctaPrimary: doc.heroCtaPrimary,
      ctaSecondary: doc.heroCtaSecondary,
      videoPlaceholderImg: doc.heroImage,
    },
    aboutPreview: {
      tag: doc.aboutTag,
      title: doc.aboutTitle,
      description: doc.aboutDescription,
      founders: doc.aboutFounder,
      foundersTitle: doc.aboutFounderTitle,
      portraitImg: doc.aboutPortraitImg,
      ctaText: doc.aboutCtaText,
    },
    whyChooseUs: {
      tag: doc.whyChooseUsTag,
      title: doc.whyChooseUsTitle,
      features: doc.whyChooseUsFeatures,
    },
    stats: doc.stats,
  };
}

// GET /api/home - Retrieve dynamic homepage content
export const GET = withErrorHandler(async () => {
  const doc = await prisma.homeContent.findFirst({
    where: { deletedAt: null },
  });

  if (!doc) {
    // If empty in DB, return standard constant fallbacks
    return NextResponse.json({
      success: true,
      message: "Resolved fallback homepage content.",
      data: HOME_CONTENT,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Retrieved homepage content successfully from database.",
    data: mapDbToHomeStructure(doc),
  });
});

// PUT /api/home - Update/upsert homepage content (admin only)
export const PUT = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const session = await getAdminSession();
  const adminId = session ? (session.id as string) : null;

  const docData = {
    heroTitle: body.hero.title,
    heroSubtitle: body.hero.subtitle,
    heroDescription: body.hero.description,
    heroImage: body.hero.videoPlaceholderImg,
    heroCtaPrimary: body.hero.ctaPrimary,
    heroCtaSecondary: body.hero.ctaSecondary,
    aboutTag: body.aboutPreview.tag,
    aboutTitle: body.aboutPreview.title,
    aboutDescription: body.aboutPreview.description,
    aboutFounder: body.aboutPreview.founders,
    aboutFounderTitle: body.aboutPreview.foundersTitle,
    aboutPortraitImg: body.aboutPreview.portraitImg,
    aboutCtaText: body.aboutPreview.ctaText,
    whyChooseUsTag: body.whyChooseUs.tag,
    whyChooseUsTitle: body.whyChooseUs.title,
    whyChooseUsFeatures: body.whyChooseUs.features,
    stats: body.stats,
  };

  const existing = await prisma.homeContent.findFirst({
    where: { deletedAt: null },
  });

  let result;
  if (existing) {
    result = await prisma.homeContent.update({
      where: { id: existing.id },
      data: docData,
    });
  } else {
    result = await prisma.homeContent.create({
      data: docData,
    });
  }

  // Log the activity log
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
  await prisma.activityLog.create({
    data: {
      adminUserId: adminId,
      action: "UPDATE_HOME",
      details: `Homepage contents updated.`,
      ipAddress,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Homepage content updated successfully.",
    data: mapDbToHomeStructure(result),
  });
});
