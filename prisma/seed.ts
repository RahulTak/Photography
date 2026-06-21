import { PrismaClient } from "@prisma/client";
import { GALLERY_ITEMS } from "../src/constants/gallery";
import { WORKSHOPS_CONTENT } from "../src/constants/workshops";
import { ABOUT_CONTENT } from "../src/constants/about";
import { HOME_CONTENT } from "../src/constants/content";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB seeding...");

  // 1. Seed Gallery Categories and Items
  for (const item of GALLERY_ITEMS) {
    const category = await prisma.galleryCategory.upsert({
      where: { name: item.category },
      update: {},
      create: { name: item.category },
    });

    await prisma.gallery.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        categoryId: category.id,
        imageUrl: item.imageUrl,
        location: item.location,
        couple: item.couple,
        year: item.year,
      },
      create: {
        id: item.id,
        title: item.title,
        categoryId: category.id,
        imageUrl: item.imageUrl,
        location: item.location,
        couple: item.couple,
        year: item.year,
      },
    });
  }
  console.log("Seeded gallery categories and items.");

  // 2. Seed Workshops
  for (const w of WORKSHOPS_CONTENT.upcoming) {
    await prisma.workshop.upsert({
      where: { id: w.id },
      update: {
        title: w.title,
        description: w.description,
        longDescription: w.longDescription,
        date: w.date,
        time: w.time,
        price: w.price,
        seatsTotal: w.seatsTotal,
        seatsAvailable: w.seatsAvailable,
        instructor: w.instructor,
        location: w.location,
        image: w.image,
        syllabus: w.syllabus,
      },
      create: {
        id: w.id,
        title: w.title,
        description: w.description,
        longDescription: w.longDescription,
        date: w.date,
        time: w.time,
        price: w.price,
        seatsTotal: w.seatsTotal,
        seatsAvailable: w.seatsAvailable,
        instructor: w.instructor,
        location: w.location,
        image: w.image,
        syllabus: w.syllabus,
      },
    });
  }
  console.log("Seeded workshops.");

  // 3. Seed Testimonials
  for (const t of HOME_CONTENT.testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: t.author, quote: t.quote },
    });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          quote: t.quote,
          author: t.author,
          role: t.role,
          avatar: t.avatar,
        },
      });
    }
  }
  console.log("Seeded testimonials.");

  // 4. Seed Team Members
  for (const member of ABOUT_CONTENT.team) {
    const existing = await prisma.team.findFirst({
      where: { name: member.name, role: member.role },
    });
    if (!existing) {
      await prisma.team.create({
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          imageUrl: member.imageUrl,
        },
      });
    }
  }
  console.log("Seeded team members.");

  // 5. Seed Awards
  for (const award of ABOUT_CONTENT.awards) {
    const existing = await prisma.award.findFirst({
      where: { title: award.title, category: award.category, year: award.year },
    });
    if (!existing) {
      await prisma.award.create({
        data: {
          title: award.title,
          category: award.category,
          year: award.year,
          organization: award.organization,
        },
      });
    }
  }
  console.log("Seeded awards.");

  // 6. Seed About page content configuration
  const existingAbout = await prisma.aboutContent.findFirst({
    where: { deletedAt: null },
  });
  const aboutData = {
    heroTitle: ABOUT_CONTENT.hero.title,
    heroSubtitle: ABOUT_CONTENT.hero.subtitle,
    heroDescription: ABOUT_CONTENT.hero.description,
    heroImage: ABOUT_CONTENT.hero.image,
    founderTitle: ABOUT_CONTENT.founders.title,
    founderSubtitle: ABOUT_CONTENT.founders.subtitle,
    founderStory: ABOUT_CONTENT.founders.storyParagraphs as any,
    founderImageSujay: ABOUT_CONTENT.founders.images.sujay,
    founderImageShreyanka: ABOUT_CONTENT.founders.images.shreyanka,
    missionTitle: ABOUT_CONTENT.missionVision.mission.title,
    missionDescription: ABOUT_CONTENT.missionVision.mission.description,
    visionTitle: ABOUT_CONTENT.missionVision.vision.title,
    visionDescription: ABOUT_CONTENT.missionVision.vision.description,
    timeline: ABOUT_CONTENT.timeline as any,
    process: ABOUT_CONTENT.process as any,
  };

  if (existingAbout) {
    await prisma.aboutContent.update({
      where: { id: existingAbout.id },
      data: aboutData,
    });
  } else {
    await prisma.aboutContent.create({
      data: aboutData,
    });
  }
  console.log("Seeded about page content.");

  console.log("DB seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
