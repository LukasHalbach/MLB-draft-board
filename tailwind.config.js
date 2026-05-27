/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#1a1f2e',
          925: '#0d1117',
          950: '#0a0d14',
        },
      },
    },
  },
  plugins: [],
}
