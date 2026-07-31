/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0D1B2A",
          800: "#1B263B",
          600: "#415A77",
        },
        gold: "#D4AF37",
        cream: "#F7F3E9",
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(to right, #000000, #152331)",
      },
    },
  },
  plugins: [],
};
