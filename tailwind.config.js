/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: {
          soft: '#0d0d0d',
          card: '#1a1a1a',
          elevated: '#262626',
        },
        carbon: '#2b2b2b',
        hairline: {
          DEFAULT: '#3c3c3c',
          strong: '#262626',
        },
        m: {
          blue: {
            light: '#0066b1',
            dark: '#1c69d4',
          },
          red: '#e22718',
        },
        electric: '#0653b6',
        primary: '#ffffff',
        'on-dark': '#ffffff',
        body: {
          DEFAULT: '#bbbbbb',
          strong: '#e6e6e6',
        },
        muted: '#7e7e7e',
        warning: '#f4b400',
        success: '#0fa336',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        machined: '1.5px',
        wide: '2px',
        tight: '-0.5px',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        full: '9999px',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        'xxl': '64px',
        'section': '96px',
      },
    },
  },
  plugins: [],
}
