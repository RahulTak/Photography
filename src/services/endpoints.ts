export const API_ENDPOINTS = {
  GALLERY: "/gallery",
  WORKSHOPS: "/workshops",
  TESTIMONIALS: "/testimonials",
  CONTACT: "/contact",
  BOOKINGS: "/bookings",
  ABOUT: "/about",
  TEAM: "/team",
  AWARDS: "/awards",
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
