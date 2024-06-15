/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.tsx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    // require('daisyui')
    require('@nextui-org/react').nextui({
      themes: {
        light: {
          colors: {
            // default: '#F1EEDC',
            primary: '#538392'
            // background: '#F1EEDC'
          }
        }
      }
    })
  ]
}

