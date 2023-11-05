/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          'primary': '#80C9D9',
          'lf-dark-gray': '#B7BDBE',
          'lf-light-gray': '#D9D9D9',
        },
        fontFamily: {
          inter: ['Inter', 'sans'],
          sans: ['"Open Sans"', 'sans-serif'],
          serif: ['"Merriweather"', 'serif'],
          arial: ['"Arial"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };