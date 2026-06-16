const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        main: colors.teal,
      },
      fontFamily: {
        sans: ['var(--app-font-family)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
