/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme:{
  extend: {
    colors: {
      'zab-navbar': '#5E48E8',
      'zab-caption': '#8979ee', // custom color name
      'zab-sidenav': '#ecf5fb', // another custom color
      'zab-hombtn':'#ffD014'
    },
  },
  fontFamily: {
    roboto: ['Roboto', 'sans-serif'],
  },
},
  plugins: [],
}

