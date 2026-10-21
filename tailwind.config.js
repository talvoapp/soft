/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'md:grid-cols-5',
    'md:grid-cols-6',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};