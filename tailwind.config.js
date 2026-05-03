/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FCD535',
          active: '#f0b90b',
          disabled: '#3a3a1f',
        },
        surface: {
          DEFAULT: '#0b0e11',
          card: '#1e2329',
          elevated: '#2b3139',
        },
        trading: {
          up: '#0ecb81',
          down: '#f6465d',
        },
      },
      spacing: {
        'section': '80px',
      },
      borderRadius: {
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
