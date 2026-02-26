/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#0f766e',
          600: '#0d6660'
        }
      }
    }
  },
  plugins: []
};
