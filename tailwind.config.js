/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A25F39',
        secondary: '#E1D4B2',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
