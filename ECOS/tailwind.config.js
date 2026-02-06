/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#050505',
          card: '#0b0b0b',
          accent: '#f97316',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
