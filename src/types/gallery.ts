export interface GalleryItem {
  id: string;
  title: string;
  category: "Wedding" | "Pre-wedding" | "Cinematic" | "Traditional" | "Destination";
  imageUrl: string;
  location: string;
  couple: string;
  year: string;
}

export type GalleryCategory = "All" | GalleryItem["category"];
