/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1d2951", // Navy Blue
        secondary: "0e4d92", // Lighter Navy Blue
        text: "4c516d", // Text Color
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-slide": "fadeInSlide 0.3s ease-out forwards",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
