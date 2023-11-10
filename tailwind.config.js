/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {    
        fontFamily: {
            'inter': ['Inter Light', 'sans'],
            'interReg': ['Inter Regular', 'sans'],
            interBold: ['Inter Bold', 'sans'],
            interMed: ['Inter Medium', 'sans'],
            interSBold: ['Inter SemiBold', 'sans'],
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
            'primary': '#80C9D9',
            'lf-dark-gray':"#949a9c",
            'lf-light-gray':"#D9D9D9",
            'indigo': {
                '100':'#E1E8FF'
            },
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
            'sn-main-blue':"#1C3FB7",
            'sn-light-blue':"#A5B9F9",
            'sn-main-orange':"#F27430",
            'sn-light-orange':"#E6B79E",
            'neutral':{
                '900':"#333333",
                '600': "#4F4F4F",
                '500': '#656A6B',
                '300':"#828282",
                '100':"#BDBDBD",
            },
            'blue': {
                '800': '#1C3FB7',
            }
        },

        extend: {
            borderRadius:{
                '10px': '10px'
            }
        },
    },

    plugins: [],

}