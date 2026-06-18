export const theme = {
  colors: {
    background: "#0B0B0B",
    secondary: "#151515",
    text: "#FFFFFF",
    muted: "#B5B5B5",
    accent: "#C9A96E", // Premium Gold
    hover: "#E0BC7B",  // Warm Hover Gold
    border: "rgba(255,255,255,0.08)",
  }
} as const;

export type ThemeColors = typeof theme.colors;
