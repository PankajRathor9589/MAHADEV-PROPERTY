/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf7f4",
          100: "#d0ebe2",
          200: "#a1d7c5",
          300: "#69bfae",
          400: "#34a391",
          500: "#0f7a67",
          600: "#0d6455",
          700: "#0b4e44",
          900: "#082a27"
        },
        sand: {
          50: "#f8f4ea",
          100: "#efe7d1",
          200: "#dfd0a5"
        },
        ink: "#102033",
        ember: "#d97706"
      },
      boxShadow: {
        card: "0 24px 64px -28px rgba(16, 32, 51, 0.28)",
        soft: "0 16px 40px -24px rgba(12, 24, 38, 0.22)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        "mesh-surface":
          "radial-gradient(circle at top left, rgba(15, 122, 103, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(217, 119, 6, 0.18), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,243,234,0.92))"
      }
    }
  },
  plugins: []
};
