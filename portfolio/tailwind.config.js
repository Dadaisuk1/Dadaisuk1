/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Dark Mode
        dark: {
          bg: "#0D1B2A",
          surface: "#1B263B",
          accent: "#415A77",
        },
        // Light Mode
        light: {
          bg: "#F9F7F4",
          surface: "#EFE9E0",
          accent: "#D4AF37",
        },
        // Accent Colors
        gold: "#D4AF37",
        cream: "#F7F3E9",
        primary: "#D4AF37",
        secondary: "#06B6D4",
        text: {
          light: "#F7F3E9",
          dark: "#0D1B2A",
        },
        // Toggle Colors
        toggle: {
          lightTrack: "#E5E7EB",
          darkTrack: "#1F2937",
          knob: "#FFFFFF",
        },
      },
      animation: {
        "slide-toggle": "slideToggle 0.3s ease-in-out",
      },
      keyframes: {
        slideToggle: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
