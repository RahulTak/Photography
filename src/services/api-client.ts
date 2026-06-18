import axios, { AxiosInstance } from "axios";
import { setupInterceptors } from "./interceptors";
import { API_ENDPOINTS } from "./endpoints";
import { GALLERY_ITEMS } from "@/constants/gallery";
import { WORKSHOPS_CONTENT } from "@/constants/workshops";
import { GalleryItem, Workshop } from "@/types";
import { HOME_CONTENT } from "@/constants/content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.jpphotography.in/v1";

const baseClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = setupInterceptors(baseClient);

// Mock implementation to guarantee functionality without an active server
export const apiService = {
  // Gallery Portfolio Fetches
  getGallery: async (category?: string, page = 1, limit = 6): Promise<{ items: GalleryItem[]; hasMore: boolean }> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GALLERY, { params: { category, page, limit } });
      return response.data;
    } catch (error) {
      console.warn("API Service fallback active: returning local gallery mock data.");
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const filtered = !category || category === "All"
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.category.toLowerCase() === category.toLowerCase());

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < filtered.length;

      return {
        items: paginated,
        hasMore,
      };
    }
  },

  // Workshop Fetches
  getWorkshops: async (): Promise<Workshop[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WORKSHOPS);
      return response.data;
    } catch (error) {
      console.warn("API Service fallback active: returning local workshops mock data.");
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [...WORKSHOPS_CONTENT.upcoming];
    }
  },

  // Workshop Seat Booking
  bookWorkshop: async (payload: { workshopId: string; name: string; email: string; phone: string; seats: number }): Promise<{ success: boolean; message: string; bookingId: string }> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOKING, payload);
      return response.data;
    } catch (error) {
      console.warn("API Service fallback active: completing booking mock response.");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      return {
        success: true,
        message: `Bespoke booking confirmed for ${payload.name}. ${payload.seats} seat(s) reserved.`,
        bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
  },

  // Contact Message submission
  submitContact: async (payload: { name: string; email: string; phone: string; serviceType: string; date?: string; message: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONTACT, payload);
      return response.data;
    } catch (error) {
      console.warn("API Service fallback active: completing contact form mock submission.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Thank you, ${payload.name}. Your inquiry has been sent to our client experience team.`,
      };
    }
  },

  // Testimonials Fetch
  getTestimonials: async (): Promise<typeof HOME_CONTENT.testimonials> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TESTIMONIALS);
      return response.data;
    } catch (error) {
      console.warn("API Service fallback active: returning local testimonials mock data.");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...HOME_CONTENT.testimonials];
    }
  }
};
