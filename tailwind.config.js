/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-bg': 'var(--tg-theme-bg-color, #ffffff)',
        'tg-text': 'var(--tg-theme-text-color, #000000)',
        'tg-hint': 'var(--tg-theme-hint-color, #999999)',
        'tg-button': 'var(--tg-theme-button-color, #3390ec)',
        'tg-button-text': 'var(--tg-theme-button-text-color, #ffffff)',
        'tg-secondary-bg': 'var(--tg-theme-secondary-bg-color, #f3f3f3)',
        'success': '#34c759',
        'danger': '#ff3b30',
        'header-light': '#1c2a38',
        'header-dark': '#101921',
        'searchInput-light': '#24252a',
        'searchInput-dark': '#2a2a2a',
      },
    }
  },
  plugins: [],
}