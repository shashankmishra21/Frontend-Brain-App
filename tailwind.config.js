/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          100: "#FF7D29",  //primary
          200: "#FFEEA9", //secondary
          300: "#FFBF78", //hover secondary
          700: "#e66f21", // hover primay
          400: "#111827", //bg
          500: "#FFFFFF", //card
          600: "#FFEEA9", //sidebar
        },
        gray: {
          100: "#1E293B", //text primary
          200: "#64748B",// text secondry
        }
      }
    },
    fontFamily:{ 
      'roboto':['Roboto','sans-serif'],
      'dmsans': ['DM Sans', 'sans-serif'],
    }
  },
  plugins: [],
}

