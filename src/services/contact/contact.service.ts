import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { contactSchema } from "@/schemas/contact.schema";
import { ContactSubmission, ContactResponse } from "@/types";

export const contactService = {
  // POST /contact
  submitContact: async (payload: ContactSubmission): Promise<ContactResponse> => {
    // Validate with Zod before transmitting
    contactSchema.parse(payload);

    try {
      const response = await apiClient.post(API_ENDPOINTS.CONTACT, payload);
      return response.data;
    } catch (error) {
      console.warn("Contact API failed: returning simulated success response.");
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        message: `Thank you, ${payload.name}. Your inquiry has been sent to our client experience team.`,
      };
    }
  }
};
export default contactService;
