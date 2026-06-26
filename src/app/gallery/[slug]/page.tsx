import { notFound } from "next/navigation";
import { galleryRepository } from "@/repositories/gallery.repository";
import { GalleryDetailContent } from "./GalleryDetailContent";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await galleryRepository.findBySlugOrId(slug);
  if (!item) {
    return {
      title: "Shoot Not Found | JP Photography",
    };
  }
  return {
    title: `${item.couple} - ${item.title} | JP Photography`,
    description: item.description || `Explore the stunning ${item.category.toLowerCase()} photoshoot of ${item.couple} at ${item.location}.`,
  };
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await galleryRepository.findBySlugOrId(slug);

  if (!item || !item.active) {
    notFound();
  }

  return <GalleryDetailContent item={item as any} />;
}
