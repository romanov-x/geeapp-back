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
        paper: "#f5f4f7",
        ink: "#211d2a",
        muted: "#665e70",
        accent: "#6230b4",
        signal: "#d7c4ff",
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
            background: "#f5f4f7",
            foreground: "#211d2a",
            focus: "#7b42d6",
          },
        },
      },
    }),
  ],
};

export default config;