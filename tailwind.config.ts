import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/pages/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      gridTemplateColumns: {
        "auto/1fr": "auto 1fr",
        "1fr/auto": "1fr auto",
      },
      cursor: {
        grab: "grab",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["group-focus"],
      borderWidth: ["hover", "focus"],
    },
  },
  plugins: [],
};

export default config;
