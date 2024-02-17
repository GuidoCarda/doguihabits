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
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("autoprefixer"),
  ],
};
