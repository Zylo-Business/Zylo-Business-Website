/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0F6E56",
          light: "#D8F0E7",
          dark: "#085041",
          50: "#D8F0E7",
          600: "#0F6E56",
          800: "#085041",
        },
        navy: {
          DEFAULT: "#1B3A6B",
          light: "#E8EEF7",
          dark: "#0F2040",
        },
        gold: {
          DEFAULT: "#8B5E0A",
          light: "#FBF3DE",
          dark: "#5C3D06",
        },
        ink: "#0B1220",
        muted: "#5B6472",
        line: "#E7E5E4",
        canvas: "#FAFAF9",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "ui-sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "12px",
        badge: "6px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12)",
        sticky: "0 1px 4px rgba(0,0,0,0.10)",
        soft: "0 1px 2px rgba(11,18,32,0.04), 0 8px 30px rgba(11,18,32,0.06)",
        glow: "0 10px 40px -12px rgba(15,110,86,0.35)",
      },
    },
  },
  plugins: [],
};
