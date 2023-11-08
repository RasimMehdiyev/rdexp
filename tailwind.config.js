/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {    
        fontFamily: {
            'interReg': ['Inter Regular', 'sans'],
            interBold: ['Inter Bold', 'sans'],
            interMed: ['Inter Medium', 'sans'],
            interSBold: ['Inter SemiBold', 'sans'],
            interLight: ['Inter Light', 'sans'],
            interthin: ['Inter Thin', 'sans'],
            interElight: ['Inter ExtraLight', 'sans'],
            interEBold: ['Inter ExtraBold', 'sans'],
            interBlack: ['Inter Black', 'sans'],
            'russoOne': ['Russo One', 'sans'],
            nicoMoji: ['Nico Moji', 'sans'],
            'sans': ['Open Sans', 'sans-serif'],
            'serif': ['Merriweather', 'serif'],
            'arial': ['Arial', 'sans-serif'],
        },
        colors: {
            'primary': '#80C9D9;',
            'lf-dark-gray':"#B7BDBE",
            'lf-light-gray':"#D9D9D9",
            'indigo': "#5C6AC4",
            'white': "#FFFFFF",
            'black': "#000000",
            'orange': {
                '500':'#F27430'
            },
            'zinc': {
                '300':'#D9D9D9'
            },
            'yellow': "#F2C94C",
            'green': "#219653",
            'red': "#EB5757",
            'neutral':{
                '900':"#333333",
                '600':"#4F4F4F",
                '300':"#828282",
                '100':"#BDBDBD",
            }
        },

        extend: {},
    },

    plugins: [],

}