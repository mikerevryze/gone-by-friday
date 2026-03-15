/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f9f8f6',
        surface: '#ffffff',
        border: '#e8e4de',
        text: '#1a1916',
        sub: '#8c8880',
        faint: '#f0ede8',
        green: '#1a7a4a',
        'green-bg': '#eef6f1',
        amber: '#b85c00',
        'amber-bg': '#fdf3eb',
        gold: '#9a6f2a',
        'gold-bg': '#fdf6e8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}
