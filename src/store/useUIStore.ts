import { create } from "zustand";

interface UIState {
  // Mobile Navigation
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Gallery Filtering
  activeGalleryCategory: string;
  setActiveGalleryCategory: (category: string) => void;

  // Lightbox Modal
  isLightboxOpen: boolean;
  lightboxIndex: number;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextLightbox: (totalItems: number) => void;
  prevLightbox: (totalItems: number) => void;

  // Workshops
  activeWorkshopId: string | null;
  setActiveWorkshopId: (id: string | null) => void;
  bookingWorkshopId: string | null;
  setBookingWorkshopId: (id: string | null) => void;

  // Page Load State
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  activeGalleryCategory: "All",
  setActiveGalleryCategory: (category) => set({ activeGalleryCategory: category }),

  isLightboxOpen: false,
  lightboxIndex: 0,
  openLightbox: (index) => set({ isLightboxOpen: true, lightboxIndex: index }),
  closeLightbox: () => set({ isLightboxOpen: false }),
  nextLightbox: (totalItems) =>
    set((state) => ({
      lightboxIndex: (state.lightboxIndex + 1) % totalItems,
    })),
  prevLightbox: (totalItems) =>
    set((state) => ({
      lightboxIndex: (state.lightboxIndex - 1 + totalItems) % totalItems,
    })),

  activeWorkshopId: null,
  setActiveWorkshopId: (id) => set({ activeWorkshopId: id }),

  bookingWorkshopId: null,
  setBookingWorkshopId: (id) => set({ bookingWorkshopId: id }),

  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
}));
