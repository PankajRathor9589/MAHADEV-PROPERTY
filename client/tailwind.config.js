/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf4ff",
          100: "#d7e5fd",
          200: "#adc8fb",
          300: "#7ca2f0",
          400: "#527bd9",
          500: "#365fb5",
          600: "#27498f",
          700: "#1b3367",
          800: "#112141",
          900: "#09111f",
          950: "#040914"
        },
        gold: {
          50: "#fff9ec",
          100: "#fbeac0",
          200: "#f4cf76",
          300: "#ecb84b",
          400: "#df9f28",
          500: "#c98714",
          600: "#a56f12",
          700: "#7a520d",
          800: "#563909",
          900: "#2c1d05"
        }
      },
      boxShadow: {
        soft: "0 30px 80px -38px rgba(2, 10, 25, 0.78)",
        panel: "0 22px 60px -30px rgba(13, 31, 63, 0.72)",
        glow: "0 0 0 1px rgba(236, 184, 75, 0.24), 0 24px 80px -40px rgba(236, 184, 75, 0.65)"
      }
    }
  },
  plugins: []
};
