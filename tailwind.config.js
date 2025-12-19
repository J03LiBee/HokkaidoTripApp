/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Base Colors
        'pure-white': '#FFFFFF',
        'frost-gray': '#F5F7FA',
        
        // Icy Lavender (冰薰衣草色) - 主要輔助色
        lavender: {
          50: '#FAF9FC',
          100: '#F3F1F9',
          200: '#E6E6FA',  // Icy Lavender base
          300: '#D8D4F5',
          400: '#C5BEF0',
          500: '#B0A8E8',
          600: '#9A91DD',
          700: '#837AD0',
          800: '#6D64B8',
          900: '#57509A',
        },
        // Sage Green (鼠尾草綠) - 冬日松樹
        sage: {
          50: '#F6F9F7',
          100: '#E8F2EB',
          200: '#C9DFD1',  // Sage Green base
          300: '#A8CEB5',
          400: '#87BC99',
          500: '#6BAA7E',
          600: '#559467',
          700: '#437952',
          800: '#335E3F',
          900: '#25442D',
        },
        // Pale Silver (淺銀) - 文字和邊框
        silver: {
          50: '#FAFBFC',
          100: '#F5F7F9',
          200: '#E8EBED',  // Pale Silver base
          300: '#D1D6DB',
          400: '#B4BBC3',
          500: '#99A1AB',
          600: '#7D8693',
          700: '#636D7A',
          800: '#4A5562',
          900: '#333E4A',
        },
        // Warm Apricot (暖杏色) - CTA only
        apricot: {
          50: '#FFF8F3',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Keep mint for backward compatibility
        mint: {
          50: '#F6F9F7',
          100: '#E8F2EB',
          200: '#C9DFD1',
          300: '#A8CEB5',
          400: '#87BC99',
          500: '#6BAA7E',
          600: '#559467',
          700: '#437952',
          800: '#335E3F',
          900: '#25442D',
        },
        // Snow (same as before)
        snow: {
          50: '#FAFCFE',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
        },
      },
      animation: {
        'fall': 'fall linear infinite',
        'fall-slow': 'fall 20s linear infinite',
        'fall-medium': 'fall 15s linear infinite',
        'fall-fast': 'fall 10s linear infinite',
        'scaleIn': 'scaleIn 0.15s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) translateX(0px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(20px) rotate(360deg)', opacity: '0' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
