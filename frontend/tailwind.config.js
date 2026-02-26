/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e7f3ef",
          100: "#c2e0d3",
          500: "#0f766e",
          600: "#0a5a54",
          700: "#064740"
        },
        accent: "#f59e0b"
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
