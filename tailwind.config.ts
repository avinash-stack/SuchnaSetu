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
          50: "#EBF1FB",
          100: "#D3E0F6",
          200: "#ACC4EE",
          300: "#7CA2E3",
          400: "#4D80D7",
          500: "#013089",
          600: "#013089", // Official Deep Navy
          700: "#01266E",
          800: "#011D54",
          900: "#01153D",
          950: "#000B22",
          DEFAULT: "#013089",
          saffron: "#FE8D01", // Official Saffron
          saffronHover: "#E67E00",
        },
        gov: {
          navy: "#013089",
          saffron: "#FE8D01",
          gold: "#D97706",
          green: "#059669",
          dark: "#0F172A",
          muted: "#475569",
          border: "#E2E8F0",
        },
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "6px",
        xl: "8px",
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
