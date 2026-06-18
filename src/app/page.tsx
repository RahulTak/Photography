import React from "react";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { StoryPreview } from "@/components/sections/StoryPreview";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { WorkshopsPreview } from "@/components/sections/WorkshopsPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <PageWrapper noPadding={true}>
      <Hero />
      <FeaturedWork />
      <StoryPreview />
      <WhyChooseUs />
      <Testimonials />
      <GalleryPreview />
      <WorkshopsPreview />
      <ContactCTA />
    </PageWrapper>
  );
}
