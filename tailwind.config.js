/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          100: "#f97316",  //priary
          200: "#fdac74", //secondary
          300: "#fed7aa", //neutral
          400: "#F8FAFC", //bg
          500: "#FFFFFF", //card
          600: "#d9d9d9", //sidebar
        },
        gray: {
          100: "#1E293B", //text primary
          200: "#64748B",// text secondry
        }
      }
    },
  },
  plugins: [],
}

