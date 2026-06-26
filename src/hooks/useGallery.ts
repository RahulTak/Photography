import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import galleryService from "@/services/gallery/gallery.service";

export function useGalleryInfinite(category?: string, limit = 6) {
  return useInfiniteQuery({
    queryKey: ["gallery", category, limit, true],
    queryFn: ({ pageParam = 1 }) => galleryService.getGallery(category, pageParam, limit, true),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ["galleryCategories"],
    queryFn: galleryService.getGalleryCategories,
    staleTime: 24 * 60 * 60 * 1000, // Categories change infrequently
  });
}
