import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode (default)
        bg: "#0B0C0E",
        surface: "#101215",
        textPrimary: "#E9ECEF",
        textSecondary: "#A9B0B7",
        accent: "#5BA4FF",
        line: "rgba(255,255,255,.08)",
        success: "#43D17A",
        warning: "#FFC857",

        // Light mode variants
        "bg-light": "#F8F9FA",
        "surface-light": "#FFFFFF",
        "textPrimary-light": "#212529",
        "textSecondary-light": "#6C757D",
        "accent-light": "#0D6EFD",
        "line-light": "rgba(0,0,0,.08)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      spacing: {
        gutter: "clamp(20px, 5vw, 80px)",
      },
      borderRadius: {
        md: "12px",
        lg: "20px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.30)",
        focus: "0 0 0 3px rgba(91,164,255,.4)",
      },
      transitionTimingFunction: {
        cine: "cubic-bezier(.2,.8,.2,1)",
      },
      transitionDuration: {
        fast: "140ms",
        med: "400ms",
        cine: "600ms",
      },
      backgroundImage: {
        grain: "url('/assets/grain.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
