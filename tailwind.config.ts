import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-canvas)",
        ink: "var(--color-ink)",
        muted: "var(--color-copy)",
        accent: "var(--color-action)",
        signal: "var(--color-selected)",
      },
      fontFamily: {
        sans: ["Medeo Sans", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: "#6230b4", foreground: "#ffffff" },
            background: "#f7f8fa",
            foreground: "#17212c",
            focus: "#6230b4",
          },
        },
      },
    }),
  ],
};

export default config;
