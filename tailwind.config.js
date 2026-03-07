import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
  extend: {
    colors: {
      navy: {
        950: '#0A0F1E',
        900: '#0F1629',
        800: '#162036',
        700: '#1E2D4A',
        600: '#2A3F63',
        400: '#6B7FA3',
        200: '#A8B8D4',
        50:  '#F0F4FF',
      }
    }
  }
}
,
  plugins: [],
}

