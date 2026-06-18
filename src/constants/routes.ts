export const ROUTES = {
  HOME: "/",
  GALLERY: "/gallery",
  WORKSHOPS: "/workshops",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;

export const NAV_LINKS = [
  { name: "Home", path: ROUTES.HOME },
  { name: "Gallery", path: ROUTES.GALLERY },
  { name: "Workshops", path: ROUTES.WORKSHOPS },
  { name: "About", path: ROUTES.ABOUT },
  { name: "Contact", path: ROUTES.CONTACT },
] as const;

export const API_ENDPOINTS = {
  GALLERY: "/api/gallery",
  WORKSHOPS: "/api/workshops",
  BOOKING: "/api/booking",
  CONTACT: "/api/contact",
  TESTIMONIALS: "/api/testimonials",
} as const;
