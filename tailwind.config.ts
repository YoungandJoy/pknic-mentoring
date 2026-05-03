import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0F1C",
          surface: "#111827",
          surface2: "#1F2937",
          border: "#1E3A2F",
          primary: "#10B981",
          primaryDim: "#059669",
          accent: "#34D399",
          warn: "#F59E0B",
          danger: "#EF4444",
          text: "#E5E7EB",
          textDim: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Apple SD Gothic Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
