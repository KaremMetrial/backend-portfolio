/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        primary: "#6366f1", // Indigo 500
        secondary: "#8b5cf6", // Violet 500
      },
    },
  },
  plugins: [],
};
