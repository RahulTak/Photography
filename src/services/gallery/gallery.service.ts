import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from "@/constants/gallery";
import { galleryResponseSchema, galleryItemSchema } from "@/schemas/gallery.schema";
import { GalleryItem } from "@/types/gallery";

export const galleryService = {
  // GET /gallery
  getGallery: async (category?: string, page = 1, limit = 6): Promise<{ items: GalleryItem[]; hasMore: boolean }> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GALLERY, { params: { category, page, limit } });
      
      // Parse with Zod schema for safety
      const parsed = galleryResponseSchema.safeParse(response.data);
      if (parsed.success) {
        return parsed.data;
      }
      console.warn("Gallery API validation failed: falling back to constants data.", parsed.error);
      throw new Error("Validation mismatch");
    } catch (error) {
      console.warn("Gallery API request failed: returning local constants fallback.");
      
      // Simulate slight latency to keep transitions smooth
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filtered = !category || category === "All"
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.category.toLowerCase() === category.toLowerCase());

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < filtered.length;

      return {
        items: paginated as GalleryItem[],
        hasMore,
      };
    }
  },

  // GET /gallery/:id
  getGalleryItem: async (id: string): Promise<GalleryItem> => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GALLERY}/${id}`);
      const parsed = galleryItemSchema.safeParse(response.data);
      if (parsed.success) {
        return parsed.data;
      }
      throw new Error("Validation mismatch");
    } catch (error) {
      console.warn(`Gallery item API failed for ID ${id}: returning local fallback.`);
      const item = GALLERY_ITEMS.find((i) => i.id === id);
      if (!item) {
        throw new Error("Gallery item not found in fallbacks");
      }
      return item as GalleryItem;
    }
  },

  // GET /gallery/categories
  getGalleryCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GALLERY}/categories`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.warn("Categories API failed: returning local fallback constants.");
      return [...GALLERY_CATEGORIES];
    }
  },
  
  createGalleryItem: async (payload: any): Promise<any> => {
    const response = await apiClient.post(API_ENDPOINTS.GALLERY, payload);
    return response.data;
  },
  updateGalleryItem: async (id: string, payload: any): Promise<any> => {
    const response = await apiClient.put(`${API_ENDPOINTS.GALLERY}/${id}`, payload);
    return response.data;
  },
  deleteGalleryItem: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.GALLERY}/${id}`);
    return response.data;
  }
};
export default galleryService;
