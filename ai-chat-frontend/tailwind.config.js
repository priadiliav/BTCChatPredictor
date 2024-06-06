/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#DFE5EB',
        card: '#F8F8FA',
        dark_main: '#31353F',
        dark_dashboard_secondary: '#1B2028'
      },
    },
  },
  plugins: [],
}

