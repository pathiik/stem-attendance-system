// This file is used to configure Tailwind CSS.
// It is used to define the colors, fonts, and other styles that are used in the application.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1d2951', // Navy Blue
        secondary: '0e4d92', // Lighter Navy Blue
        text: '4c516d', // Text Color
      },
    },
  },
  plugins: [],
}