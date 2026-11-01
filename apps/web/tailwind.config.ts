import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111827",
        "bg-app": "#f8f9fa",
        "bg-surface": "#ffffff",
        "bg-surface-hover": "#f4f5f7",
        primary: {
          DEFAULT: "#1e1e1e", // Onyx Black
          foreground: "#ffffff",
          hover: "#111111",
        },
        secondary: {
          DEFAULT: "#f4f5f7",
          foreground: "#1e1e1e",
        },
        accent: {
          DEFAULT: "#1d4ed8", // Deep Sapphire Blue
          hover: "#1e40af",
          light: "#eff6ff",
          glow: "rgba(29, 78, 216, 0.15)",
        },
        muted: {
          DEFAULT: "#6b7280",
          foreground: "#9ca3af",
        },
        border: "#e5e7eb",
        "border-strong": "#d1d5db",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Montserrat", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        pill: "9999px",
      },
      boxShadow: {
        "onix-card": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "onix-hero": "0 12px 32px -4px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(29, 78, 216, 0.15)",
        "onix-pill": "0 4px 12px rgba(0, 0, 0, 0.12)",
        "onix-floating": "0 4px 20px rgba(15, 23, 42, 0.03)",
      },
      animation: {
        "page-enter": "pageEnter 380ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "modal-spring": "modalSpring 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        pageEnter: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        modalSpring: {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

