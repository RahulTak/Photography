export const API_ENDPOINTS = {
  GALLERY: "/gallery",
  WORKSHOPS: "/workshops",
  BOOKING: "/booking",
  CONTACT: "/contact",
  TESTIMONIALS: "/testimonials",
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
