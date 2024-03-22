/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkergray: "#27272A",
        lightergray: "#52525B",
        success: "#10B981",
        failed: "#EF4444",
      },
      gridTemplateRows: {
        7: "repeat(7, minmax(0, 1fr))",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("autoprefixer"),
  ],
};
