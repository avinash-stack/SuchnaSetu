import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fdf8f0",
          100: "#f9eedc",
          200: "#f3ddb8",
          300: "#ebc689",
          400: "#e1a857",
          500: "#d98d2e",
          600: "#c77223",
          700: "#a5541f",
          800: "#85431f",
          900: "#6d381c",
          950: "#3d1c0c",
        },
        gov: {
          navy: "#0a2540",
          blue: "#1e3a8a",
          amber: "#d97706",
          green: "#059669",
          slate: "#334155",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
