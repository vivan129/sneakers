/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#111111',
        'accent-hover': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse2: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '0.3' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.9s ease forwards',
        'fade-up-delay': 'fadeUp 0.9s ease 0.2s forwards',
        'fade-up-delay2': 'fadeUp 0.9s ease 0.4s forwards',
        'fade-up-delay3': 'fadeUp 0.9s ease 0.6s forwards',
        'fade-in': 'fadeIn 1.2s ease forwards',
        'slide-left': 'slideInLeft 0.9s ease forwards',
        'pulse2': 'pulse2 4s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
