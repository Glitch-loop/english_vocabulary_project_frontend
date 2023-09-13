/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        container: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      }
    },
  },
  plugins: [],
}

