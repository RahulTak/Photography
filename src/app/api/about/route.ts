import { NextResponse } from "next/server";
import { aboutRepository } from "@/repositories/about.repository";
import { z } from "zod";

// Zod schemas for input validation
const timelineEventSchema = z.object({
  year: z.string().transform(s => s.trim()),
  title: z.string().transform(s => s.trim()),
  description: z.string().transform(s => s.trim()),
});

const processStepSchema = z.object({
  step: z.string().transform(s => s.trim()),
  title: z.string().transform(s => s.trim()),
  description: z.string().transform(s => s.trim()),
});

const statItemSchema = z.object({
  value: z.string().transform(s => s.trim()),
  label: z.string().transform(s => s.trim()),
});

const putAboutSchema = z.object({
  hero: z.object({
    title: z.string().min(1, "Hero title is required").transform(s => s.trim()),
    subtitle: z.string().min(1, "Hero subtitle is required").transform(s => s.trim()),
    description: z.string().min(1, "Hero description is required").transform(s => s.trim()),
    image: z.string().min(1, "Hero image is required").transform(s => s.trim()),
  }),
  founders: z.object({
    title: z.string().min(1, "Founder name is required").transform(s => s.trim()),
    subtitle: z.string().min(1, "Founder subtitle is required").transform(s => s.trim()),
    storyParagraphs: z.array(z.string().transform(s => s.trim())).min(1, "Founder story paragraphs are required"),
    images: z.object({
      sujay: z.string().min(1, "Sujay portrait image is required").transform(s => s.trim()),
      shreyanka: z.string().min(1, "Shreyanka portrait image is required").transform(s => s.trim()),
    }),
  }),
  missionVision: z.object({
    mission: z.object({
      title: z.string().min(1, "Mission title is required").transform(s => s.trim()),
      description: z.string().min(1, "Mission description is required").transform(s => s.trim()),
    }),
    vision: z.object({
      title: z.string().min(1, "Vision title is required").transform(s => s.trim()),
      description: z.string().min(1, "Vision description is required").transform(s => s.trim()),
    }),
  }),
  timeline: z.array(timelineEventSchema),
  process: z.array(processStepSchema),
  stats: z.array(statItemSchema).optional(),
});

// GET /api/about - Retrieve about content (sequential and crash-proof)
export const GET = async (req: Request) => {
  try {
    console.log("[GET /api/about] Fetching about data sequentially...");
    const content = await aboutRepository.find();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "About content configuration not found.", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "About content retrieved successfully.",
      data: content,
    });
  } catch (error: any) {
    console.error("[GET /api/about] Error occurred, returning safe fallback empty structure:", error);
    
    // Hostinger Safe Fallback Safety response shape
    return NextResponse.json({
      success: true,
      data: {
        aboutContent: null,
        awards: [],
        team: [],
        homeContent: null,
      },
    });
  }
};

// PUT /api/about - Update/upsert about content configuration (safe & optimized)
export const PUT = async (req: Request) => {
  try {
    console.log("[PUT /api/about] Processing update request...");
    
    const body = await req.json().catch(() => ({}));

    // Sanitization & Normalization before Zod validation
    const normalizedPayload = {
      hero: {
        title: typeof body.hero?.title === "string" ? body.hero.title : "",
        subtitle: typeof body.hero?.subtitle === "string" ? body.hero.subtitle : "",
        description: typeof body.hero?.description === "string" ? body.hero.description : "",
        image: typeof body.hero?.image === "string" ? body.hero.image : "",
      },
      founders: {
        title: typeof body.founders?.title === "string" ? body.founders.title : "",
        subtitle: typeof body.founders?.subtitle === "string" ? body.founders.subtitle : "",
        storyParagraphs: Array.isArray(body.founders?.storyParagraphs)
          ? body.founders.storyParagraphs.map((p: any) => typeof p === "string" ? p : "")
          : [],
        images: {
          sujay: typeof body.founders?.images?.sujay === "string" ? body.founders.images.sujay : "",
          shreyanka: typeof body.founders?.images?.shreyanka === "string" ? body.founders.images.shreyanka : "",
        },
      },
      missionVision: {
        mission: {
          title: typeof body.missionVision?.mission?.title === "string" ? body.missionVision.mission.title : "",
          description: typeof body.missionVision?.mission?.description === "string" ? body.missionVision.mission.description : "",
        },
        vision: {
          title: typeof body.missionVision?.vision?.title === "string" ? body.missionVision.vision.title : "",
          description: typeof body.missionVision?.vision?.description === "string" ? body.missionVision.vision.description : "",
        },
      },
      timeline: Array.isArray(body.timeline)
        ? body.timeline.map((t: any) => ({
            year: typeof t?.year === "string" ? t.year : "",
            title: typeof t?.title === "string" ? t.title : "",
            description: typeof t?.description === "string" ? t.description : "",
          }))
        : [],
      process: Array.isArray(body.process)
        ? body.process.map((p: any) => ({
            step: typeof p?.step === "string" ? p.step : "",
            title: typeof p?.title === "string" ? p.title : "",
            description: typeof p?.description === "string" ? p.description : "",
          }))
        : [],
      stats: Array.isArray(body.stats)
        ? body.stats.map((s: any) => ({
            value: typeof s?.value === "string" ? s.value : "",
            label: typeof s?.label === "string" ? s.label : "",
          }))
        : [],
    };

    // Zod validation check
    const validation = putAboutSchema.safeParse(normalizedPayload);
    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      
      console.warn("[PUT /api/about] Validation failed:", errorMessage);
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${errorMessage}`,
          errorCode: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Call optimized upsert method (which checks changes and updates modified fields only)
    const content = await aboutRepository.upsert(validation.data);

    return NextResponse.json({
      success: true,
      message: "About content configuration updated successfully.",
      data: content,
    });
  } catch (error: any) {
    console.error("[PUT /api/about] Exception thrown during upsert operation:", error);

    let message = "An unexpected error occurred while saving the configuration.";
    let errorCode = "SERVER_ERROR";
    let status = 500;

    // Prisma error translation
    if (error.code) {
      errorCode = `PRISMA_${error.code}`;
      if (error.code === "P2002") {
        message = "A database unique constraint violation occurred.";
        status = 409;
      } else if (error.code.startsWith("P10") || error.code.startsWith("P20")) {
        message = "A database execution error occurred. Please retry later.";
        status = 503;
      }
    } else if (error.message) {
      if (error.message.includes("timeout")) {
        message = "The MySQL database request timed out. Please try again.";
        errorCode = "DB_TIMEOUT";
        status = 504;
      } else if (error.message.includes("Can't reach database") || error.message.includes("Connection")) {
        message = "Unable to connect to the MySQL database server.";
        errorCode = "DB_CONNECTION_ERROR";
        status = 503;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message,
        errorCode,
      },
      { status }
    );
  }
};
