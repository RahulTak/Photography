export interface WorkshopBookingSubmission {
  workshopId: string;
  name: string;
  email: string;
  phone: string;
  seats: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId: string;
}
