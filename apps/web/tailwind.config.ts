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
        aurae: {
          pink: "#F7EBE8",
          sage: "#E3ECE1",
          nude: "#F3EFEA",
          rose: "#E0A99D",
          charcoal: "#2C2C2C",
        },
      },
    },
  },
  plugins: [],
};
export default config;