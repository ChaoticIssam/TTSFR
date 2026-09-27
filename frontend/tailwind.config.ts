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
        ttsfr: {
          dark: "#0F4C3A",       // Deep forest green from UM6P / Slide 58
          primary: "#135D43",    // Primary banner green
          emerald: "#10B981",    // Vibrant action button green
          accent: "#D1FAE5",     // Soft mint green highlight
          light: "#F0FDF4",      // Light background tint
          gray: "#F8FAFC",       // Clean card background
        },
      },
    },
  },
  plugins: [],
};
export default config;
