/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {    
      screens: {
          'xxs': '320px',
          // => @media (min-width: 320px) { ... }
          'xs': '475px',
          // => @media (min-width: 475px) { ... }
          'sm': '640px',
          // => @media (min-width: 640px) { ... }
    
          'md': '768px',
          // => @media (min-width: 768px) { ... }
    
          'lg': '1024px',
          // => @media (min-width: 1024px) { ... }
    
          'xl': '1280px',
          // => @media (min-width: 1280px) { ... }
    
          '2xl': '1536px',
          // => @media (min-width: 1536px) { ... }
        },
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
            'almostwhite':"#F2F3F8",
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
            'sn-main-orange':'#F27430',
            'sn-light-orange':'#E8834C',
            'sn-lighter-orange':'#FBD5C0',
            'sn-bg-light-blue': '#E1E8FF',
            'sn-subheader-blue':"#4665D0",
            'teambuilding-green':"#A4E6BE",
            'eventcard-text':"#020617",
            'game-blue':"#CCDBFF",
            'practice-orange':"#FFE1D1",
            'neutral':{
                '900':"#333333",
                '600': "#4F4F4F",
                '500': '#656A6B',
                '300':"#828282",
                '100':"#BDBDBD",
            },
            'blue':{
                '900':"rgb(30, 58, 138);",
                '800':"rgb(30, 64, 175);",
                '700':"rgb(29, 78, 216);",
                '600':"rgb(37, 99, 235);",
                '500':"rgb(59, 130, 246);",
                '300':"#BBE1FA",
                '200':"rgb(191, 219, 254);",
                '100':"#E0F7FF",
            },
            'green':{
                '700':"#219653",
                '500':"#27AE60",
                '300':"#6FCF97",
                '100':"#DEF7EC",
            },
            'red':{
                '700':"#b91c1c",
                '600':"#dc2626",
                '500':"#ef4444",
                '400':"#F87171",
                '300':"#F2994A",
                '200':'#FECACA',
                '100':"#FEE2E2",
            },
            'orange':{
                '700':"#F27430",
                '500':"rgb(249, 115, 22);",
                '400':'rgb(156, 163, 175);',
                '300':"rgb(253, 186, 116);",
                '100':"#F2C94C",
            },
            'gray':{
                '900':"rgb(17, 24, 39);",
                '500':"rgb(107, 114, 128);",
                '700':"rgb(55, 65, 81);",
                '300':"rgb(209, 213, 219);",
                '100':"rgb(243, 244, 246);",
                '50': 'rgb(249, 250, 251)'
            },
            'indigo':{
                '950':"rgb(30, 27, 75);",
                '900':"rgb(49, 46, 129);",
                '800':"rgb(55, 48, 163);",
                '700':"rgb(67, 56, 202);",
                '600':"rgb(79, 70, 229);",
                '500':"rgb(99, 102, 241);",
                '400':"rgb(129, 140, 248);",
                '300':"rgb(165, 180, 252);",
                '200':"rgb(199, 210, 254);",
                '100':"rgb(224, 231 ,255);",
                '50':"rgb(238, 242, 255);",

            },
          },

        extend: {
            borderRadius:{
                '10px': '10px'
            },
            letterSpacing: {
                tighter: '-0.05em',  // You can adjust this value as needed
                evenTighter: '-0.1em', // You can adjust this value as needed
                evenMoreTighter: '-0.2em' // You can adjust this value as needed
            },
        },
    },

    plugins: [],

}
