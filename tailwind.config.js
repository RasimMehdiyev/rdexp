/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {    
        fontFamily: {
            interReg: ['Inter Regular', 'sans'],
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
            'primary': '#80C9D9',
            'lf-dark-gray':"#949a9c",
            'lf-light-gray':"#D9D9D9",
            'indigo': "#5C6AC4",
            'white': "#FFFFFF",
            'black': "#000000",
            'orange': "#F2994A",
            'zinc': "#656A6B",
            'yellow': "#F2C94C",
            'green': "#219653",
            'red': "#EB5757",
            'sn-main-blue':"#1C3FB7",
            'sn-light-blue':"#E1E8FF",
            'practice-orange':"#F27430",
            'game-blue':"#2D68F8",
            'teambuilding-green':"#6BC54B",
            'neutral':{
                '900':"#333333",
                '600':"#4F4F4F",
                '300':"#828282",
                '100':"#BDBDBD",
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