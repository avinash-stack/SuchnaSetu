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
          50: "#EAF0FA",
          100: "#D0DEF4",
          200: "#A6C1EC",
          300: "#6A97DF",
          400: "#336FCC",
          500: "#013089",
          600: "#013089", // Finalized Deep Navy #013089
          700: "#01276E",
          800: "#011E55",
          900: "#01153D",
          950: "#000B22",
          DEFAULT: "#013089",
          saffron: "#FE8D01", // Finalized Saffron #FE8D01
        },
        gov: {
          navy: "#013089",
          blue: "#013089",
          amber: "#FE8D01",
          saffron: "#FE8D01",
          green: "#059669",
          slate: "#172033",
        },
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
