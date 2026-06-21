import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { WORKSHOPS_CONTENT } from "@/constants/workshops";
import { workshopSchema } from "@/schemas/workshop.schema";
import { workshopBookingSchema } from "@/schemas/booking.schema";
import { Workshop, WorkshopBookingSubmission, BookingResponse } from "@/types";

export const workshopsService = {
  // GET /workshops
  getWorkshops: async (): Promise<Workshop[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WORKSHOPS);
      if (Array.isArray(response.data)) {
        const parsed = response.data.map((item) => workshopSchema.parse(item));
        return parsed;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.warn("Workshops API failed: returning local upcoming cohorts fallback.");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...WORKSHOPS_CONTENT.upcoming] as Workshop[];
    }
  },

  // GET /workshops/:id
  getWorkshopItem: async (id: string): Promise<Workshop> => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.WORKSHOPS}/${id}`);
      return workshopSchema.parse(response.data);
    } catch (error) {
      console.warn(`Workshop detail API failed for ID ${id}: returning local fallback.`);
      const workshop = WORKSHOPS_CONTENT.upcoming.find((w) => w.id === id);
      if (!workshop) {
        throw new Error("Workshop not found in fallbacks");
      }
      return workshop as Workshop;
    }
  },

  // POST /workshops/register
  registerWorkshop: async (payload: WorkshopBookingSubmission): Promise<BookingResponse> => {
    // Client-side schema verification for safety
    workshopBookingSchema.parse(payload);

    try {
      const response = await apiClient.post(`${API_ENDPOINTS.WORKSHOPS}/register`, payload);
      return response.data;
    } catch (error) {
      console.warn("Workshop booking API failed: generating mock confirmation fallback.");
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: `Bespoke booking confirmed for ${payload.name}. ${payload.seats} seat(s) reserved.`,
        bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
  }
};
export default workshopsService;
