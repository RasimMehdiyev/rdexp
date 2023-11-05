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
            'indigo': "#5C6AC4",
            'white': "#FFFFFF",
            'black': "#000000",
            'orange': "#F2994A",
            'zinc': "#656A6B",
            'yellow': "#F2C94C",
            'green': "#219653",
            'red': "#EB5757"
        },
        // text stroke

        extend: {},
    },
    fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
        'arial': ['Arial', 'sans-serif'],
        'inter-regular': ['"Inter Regular"', 'sans'],
        'inter-bold': ['"Inter Bold"', 'sans'],
        'inter-medium': ['"Inter Medium"', 'sans'],
        'inter-semibold': ['"Inter SemiBold"', 'sans'],
        'inter-light': ['"Inter Light"', 'sans'],
        'inter-thin': ['"Inter Thin"', 'sans'],
        'inter-extralight': ['"Inter ExtraLight"', 'sans'],
        'inter-extrabold': ['"Inter ExtraBold"', 'sans'],
        'inter-black': ['"Inter Black"', 'sans'],
        'russo': ['"Russo One"', 'sans'],
        'nicomoji': ['"Nico Moji"', 'sans'],
    },


    plugins: [],
    safelist:[
        'bg-gradient-to-b',
        'from-indigo-100',
    ]
}