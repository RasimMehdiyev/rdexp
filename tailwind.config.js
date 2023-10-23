/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        colors: {
            'primary': '#80C9D9;',
            'lf-dark-gray':"#B7BDBE",
            'lf-light-gray':"#D9D9D9",
        },
        // text stroke

        extend: {},
    },
    fontFamily: {
        'sans': ['"Open Sans"', 'sans-serif'],
        'serif': ['"Merriweather"', 'serif'],
        'arial': ['"Arial"', 'sans-serif'],
    },


    plugins: [],
}