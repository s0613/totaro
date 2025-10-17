// Design Tokens for TOTARO B2B Marketing Site
// Based on PRD/LLD specifications

export const tokens = {
  colors: {
    bg: "#0B0C0E",
    surface: "#101215",
    textPrimary: "#E9ECEF",
    textSecondary: "#A9B0B7",
    accent: "#5BA4FF",
    line: "rgba(255,255,255,.08)",
    success: "#43D17A",
    warning: "#FFC857",
  },

  fonts: {
    sans: [
      "var(--font-inter)",
      "-apple-system",
      "BlinkMacSystemFont",
      "system-ui",
      "sans-serif",
    ],
    display: ["var(--font-inter)", "sans-serif"],
  },

  typeScale: {
    eyebrow: { size: "12px", lineHeight: "13px" },
    body: { size: "16px", lineHeight: "24px" },
    sub: { size: "14px", lineHeight: "20px" },
    heroDisplay: "clamp(32px, 6vw, 72px)",
  },

  spacing: {
    section: "100vh",
    gutter: "clamp(20px, 5vw, 80px)",
    cardGap: "24px",
  },

  radii: {
    md: "12px",
    lg: "20px",
  },

  shadows: {
    soft: "0 10px 30px rgba(0,0,0,.30)",
    focus: "0 0 0 3px rgba(91,164,255,.4)",
  },

  motion: {
    ease: "cubic-bezier(.2,.8,.2,1)",
    durFast: "140ms",
    durMed: "400ms",
    durCine: "600ms",
    stagger: "120ms",
  },
} as const;

export type Tokens = typeof tokens;
