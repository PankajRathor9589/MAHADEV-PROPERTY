/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf7ee",
          100: "#f7ead4",
          200: "#edd4aa",
          300: "#ddb779",
          400: "#c99b57",
          500: "#b88a44",
          600: "#9a6f31",
          700: "#7a5725",
          800: "#5a411d",
          900: "#3d2b15"
        },
        brand: {
          50: "#fbf4e8",
          100: "#f4e6cd",
          200: "#e6cfa3",
          300: "#d7ba82",
          400: "#c59d5c",
          500: "#b88a44",
          600: "#9b7133",
          700: "#7b5927",
          800: "#5d431f",
          900: "#3f2d16"
        },
        cream: {
          50: "#fffdfa",
          100: "#fdf6ec",
          200: "#f5ecdc",
          300: "#eee0c8"
        },
        ink: {
          50: "#f6f3ee",
          100: "#ece4d7",
          200: "#d8ccb8",
          300: "#bda98f",
          400: "#917c62",
          500: "#675743",
          600: "#4b4033",
          700: "#2c2c2c",
          800: "#211f1c",
          900: "#171513"
        }
      },
      boxShadow: {
        soft: "0 16px 34px rgba(44, 44, 44, 0.08)",
        panel: "0 24px 54px rgba(184, 138, 68, 0.14)",
        glow: "0 14px 30px rgba(184, 138, 68, 0.24)"
      }
    }
  },
  plugins: []
};
