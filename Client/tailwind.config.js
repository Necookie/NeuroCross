/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          50: 'hsl(var(--mono-50) / <alpha-value>)',
          100: 'hsl(var(--mono-100) / <alpha-value>)',
          200: 'hsl(var(--mono-200) / <alpha-value>)',
          300: 'hsl(var(--mono-300) / <alpha-value>)',
          400: 'hsl(var(--mono-400) / <alpha-value>)',
          500: 'hsl(var(--mono-500) / <alpha-value>)',
          600: 'hsl(var(--mono-600) / <alpha-value>)',
          700: 'hsl(var(--mono-700) / <alpha-value>)',
          800: 'hsl(var(--mono-800) / <alpha-value>)',
          900: 'hsl(var(--mono-900) / <alpha-value>)',
          950: 'hsl(var(--mono-950) / <alpha-value>)',
        },
        signal: {
          red: 'hsl(var(--signal-red) / <alpha-value>)',
          amber: 'hsl(var(--signal-amber) / <alpha-value>)',
          green: 'hsl(var(--signal-green) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 35px hsl(var(--mono-950) / 0.45)',
        lift: '0 10px 25px hsl(var(--mono-950) / 0.4)',
      },
      transitionTimingFunction: {
        'soft-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(6px)' },
        },
        shimmer: {
          '0%': { opacity: '0.35' },
          '100%': { opacity: '0.75' },
        },
      },
      animation: {
        drift: 'drift 6s ease-in-out infinite alternate',
        shimmer: 'shimmer 2.4s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
