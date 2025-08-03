import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111111",
        foreground: "#F5F5F5",
        primary: {
          DEFAULT: "#C71F37",
          foreground: "#F5F5F5",
        },
        secondary: {
          DEFAULT: "#2B2D42",
          foreground: "#F5F5F5",
        },
        accent: {
          DEFAULT: "#EF476F",
          foreground: "#F5F5F5",
        },
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#B8B9C3",
        },
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#F5F5F5",
        },
        popover: {
          DEFAULT: "#1A1A1A",
          foreground: "#F5F5F5",
        },
        border: "#2A2A2A",
        input: "#2A2A2A",
        ring: "#C71F37",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;