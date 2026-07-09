/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#C9A84C',
          600: '#B8962E',
          700: '#92740A',
          800: '#78610A',
          900: '#5C4A0A',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d7fe',
          300: '#a4bbfd',
          400: '#7b94fb',
          500: '#1B2B4B',
          600: '#162340',
          700: '#0F1929',
          800: '#0A1020',
          900: '#060B17',
        },
        charcoal: '#2C2C2C',
        cream: '#FAF8F3',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(27,43,75,0.92) 0%, rgba(11,18,38,0.85) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #F5D380 50%, #C9A84C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft: { '0%': { opacity: 0, transform: 'translateX(-30px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(0,0,0,0.12)',
        'gold': '0 4px 20px rgba(201,168,76,0.3)',
      }
    },
  },
  plugins: [],
}
