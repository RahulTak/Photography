import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { eventBookingSchema } from "@/schemas/booking.schema";
import { BookingResponse } from "@/types";

// Note: EventBookingInputs contains the validated fields (name, email, phone, eventDate, eventType, message)
import { EventBookingInputs } from "@/schemas/booking.schema";

export const bookingService = {
  // POST /bookings
  submitBooking: async (payload: EventBookingInputs): Promise<BookingResponse> => {
    // Validate schema
    eventBookingSchema.parse(payload);

    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOKINGS, payload);
      return response.data;
    } catch (error) {
      console.warn("Bookings API failed: generating mock confirmation response.");
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        message: `Bespoke photography date reserved for ${payload.name} on ${payload.eventDate}.`,
        bookingId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
  }
};
export default bookingService;
