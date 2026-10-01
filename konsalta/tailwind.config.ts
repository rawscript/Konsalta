import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0b2d53",
          navyDark: "#061d38",
          orange: "#f26522",
          orangeHover: "#d95316",
          blue: "#1e56a0",
          sky: "#eef6ff",
          grayText: "#4a5568",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
