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
          50: "#fdf8ef",
          100: "#f8edcf",
          200: "#edd89a",
          300: "#dfbf64",
          400: "#d1aa49",
          500: "#C89B3C",
          600: "#a77b2a",
          700: "#815e21",
          800: "#5d4218",
          900: "#33220b"
        },
        brand: {
          50: "#fdf8ef",
          100: "#f8edcf",
          200: "#edd89a",
          300: "#dfbf64",
          400: "#d1aa49",
          500: "#C89B3C",
          600: "#a77b2a",
          700: "#815e21",
          800: "#5d4218",
          900: "#33220b"
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
        soft: "0 20px 60px rgba(17, 24, 39, 0.08)",
        panel: "0 30px 80px rgba(17, 24, 39, 0.12)",
        glow: "0 20px 55px rgba(200, 155, 60, 0.24)",
        glass: "0 24px 65px rgba(17, 24, 39, 0.1)"
      }
    }
  },
  plugins: []
};
