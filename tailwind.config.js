/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#007AFF', 
      },
      fontFamily: {
        'space-mono': ['"Space Mono"', 'monospace'],
        'poppins': ['"Poppins"', 'sans-serif'], 

      },
    },
  },
  plugins: [],
}

