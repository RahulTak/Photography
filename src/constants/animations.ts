import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom?.duration ?? 0.8,
      delay: custom?.delay ?? 0,
      ease: [0.25, 1, 0.5, 1], // Smooth luxury easeOut
    },
  }),
};

export const stagger = (staggerChildren = 0.15, delayChildren = 0.05) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom?.duration ?? 0.9,
      delay: custom?.delay ?? 0,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom?.duration ?? 0.8,
      delay: custom?.delay ?? 0,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom?.duration ?? 0.8,
      delay: custom?.delay ?? 0,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export const hoverScale = {
  rest: { scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } },
};

export const overlayFade = {
  rest: { opacity: 0, transition: { duration: 0.3 } },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};
