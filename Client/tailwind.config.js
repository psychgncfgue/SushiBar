/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      margin: {
        '10p': '10%', // Кастомное значение отступа
      },
    },
  },
  plugins: [],
}