/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "sans-serif"],
        display: ['"Cormorant Garamond"', "serif"]
      },
      colors: {
        navy: {
          50: "#f4f7fc",
          100: "#dfe7f5",
          200: "#c3d3ea",
          300: "#94acd1",
          400: "#6784b8",
          500: "#35578d",
          600: "#243f6b",
          700: "#1b3155",
          800: "#112544",
          900: "#0B1D3A",
          950: "#050D1C"
        },
        gold: {
          50: "#fdf8ec",
          100: "#f7eac4",
          200: "#efda92",
          300: "#e5c95f",
          400: "#dcb945",
          500: "#D4AF37",
          600: "#b38c22",
          700: "#8c6b18",
          800: "#654b0f",
          900: "#3a2a07"
        },
        brand: {
          50: "#fdf8ec",
          100: "#f7eac4",
          200: "#efda92",
          300: "#e5c95f",
          400: "#dcb945",
          500: "#D4AF37",
          600: "#b38c22",
          700: "#8c6b18",
          800: "#654b0f",
          900: "#3a2a07"
        },
        cream: {
          50: "#ffffff",
          100: "#f8f5ef",
          200: "#ece6d8",
          300: "#d8cfbc"
        },
        ink: {
          50: "#e8edf7",
          100: "#cbd4e4",
          200: "#9ba8bf",
          300: "#73839f",
          400: "#4d607f",
          500: "#314565",
          600: "#243552",
          700: "#1b2942",
          800: "#121d2f",
          900: "#0a1220"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(5, 13, 28, 0.24)",
        panel: "0 30px 80px rgba(5, 13, 28, 0.34)",
        glow: "0 20px 55px rgba(212, 175, 55, 0.32)",
        glass: "0 24px 65px rgba(4, 10, 20, 0.48)"
      }
    }
  },
  plugins: []
};
