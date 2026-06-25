import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#08162d",
        ink: "#111827",
        charcoal: "#232833",
        mist: "#f4f6f8",
        magenta: "#a40f5f",
        wine: "#65123f",
        gold: "#c9a84c",
        copper: "#b87333"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(8, 22, 45, 0.12)"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      }
    }
  },
  plugins: [forms]
};

export default config;
