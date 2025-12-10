/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fall': 'fall linear infinite',
        'scaleIn': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) translateX(0px)' },
          '100%': { transform: 'translateY(110vh) translateX(20px)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

