/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#0891b2",
          600: "#0e7490",
          700: "#155e75"
        }
      },
      boxShadow: {
        soft: "0 15px 35px -20px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};
