/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // change the mainBackgroundColor to dark gray and columnBackgroundColor to a noticable color
        mainBackgroundColor: "#333333",
        columnBackgroundColor: "#242424",
        cardBackgroundColor: "#ffffff",
        cardBorderColor: "#d9d9d9",
      },
    },
  },
  plugins: [],
};
