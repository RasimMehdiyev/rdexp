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
            'inter': ['Inter', 'sans-serif'],
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
            'red': "#EB5757",
            'sn-main-blue':"#1C3FB7",
            'sn-light-blue':"#A5B9F9",
            'sn-main-orange':'#F27430',
            'sn-light-orange':'#E8834C',
            'neutral':{
                '900':"#333333",
                '600':"#4F4F4F",
                '300':"#828282",
                '100':"#BDBDBD",
            },
            'blue':{
                '700':"rgb(29, 78, 216);",
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
                '700':"#EB5757",
                '500':"#EB5757",
                '300':"#F2994A",
                '100':"#F2C94C",
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

        extend: {},
    },

    plugins: [],

}


// text-indigo-50	color: rgb(238 242 255);
	
// Aa
// text-indigo-100	color: rgb(224 231 255);
	
// Aa
// text-indigo-200	color: rgb(199 210 254);
	
// Aa
// text-indigo-300	color: rgb(165 180 252);
	
// Aa
// text-indigo-400	color: rgb(129 140 248);
	
// Aa
// text-indigo-500	color: rgb(99 102 241);
	
// Aa
// text-indigo-600	color: rgb(79 70 229);
	
// Aa
// text-indigo-700	color: rgb(67 56 202);
	
// Aa
// text-indigo-800	color: rgb(55 48 163);
	
// Aa
// text-indigo-900	color: rgb(49 46 129);
	
// Aa
// text-indigo-950	color: rgb(30 27 75);