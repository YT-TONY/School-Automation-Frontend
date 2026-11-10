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
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        primarySubtle: "var(--color-primary-subtle)",
        primaryBorder: "var(--color-primary-border)",
        textOnPrimary: "var(--color-text-on-primary)",
      },
    },
  },
  plugins: [],
};
export default config;