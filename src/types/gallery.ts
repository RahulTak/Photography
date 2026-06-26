export interface GalleryItem {
  id: string;
  title: string;
  slug?: string;
  category: "Wedding" | "Pre-wedding" | "Cinematic" | "Traditional" | "Destination";
  coverImage?: string;
  imageUrl?: string;
  description?: string | null;
  location: string;
  couple: string;
  year: string;
  featured?: boolean;
  active?: boolean;
  images?: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
}

export type GalleryCategory = "All" | GalleryItem["category"];
