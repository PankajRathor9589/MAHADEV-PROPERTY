/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f3",
          100: "#d4efe4",
          500: "#1f7a64",
          600: "#155f4e",
          700: "#114c3e",
          900: "#0b2821"
        },
        accent: {
          100: "#fff4d6",
          400: "#f6b73c",
          500: "#dc9221",
          600: "#b87317"
        }
      },
      boxShadow: {
        soft: "0 24px 60px -32px rgba(15, 23, 42, 0.35)",
        panel: "0 18px 45px -28px rgba(17, 76, 62, 0.35)"
      }
    }
  },
  plugins: []
};
