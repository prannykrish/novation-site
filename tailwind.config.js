/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif']
      },
      keyframes: {
        scrollLeft: {
      '0%': { transform: 'translateX(0%)' },
      '100%': { transform: 'translateX(-100%)' },
    },
    scrollRight: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0%)' },
        },
        softpulse: {
      '0%, 100%': { opacity: '0.15' },
      '50%': { opacity: '0.25' },
    }
        
      },
      animation: {
        'scroll-left': 'scrollLeft 30s linear infinite',
        'scroll-right': 'scrollRight 35s linear infinite',
        softpulse: 'softpulse 2s ease-in-out infinite'     
      }
    }
  }
}
