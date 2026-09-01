/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        sidebar: 'var(--color-sidebar)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        lavender: {
          DEFAULT: 'var(--color-lavender)',
          light: 'var(--color-lavender-light)',
        },
        mint: {
          DEFAULT: 'var(--color-mint)',
          light: 'var(--color-mint-light)',
        },
        blue: {
          DEFAULT: 'var(--color-blue)',
          light: 'var(--color-blue-light)',
        },
        peach: 'var(--color-peach)',
        rose: 'var(--color-rose)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(37, 35, 51, 0.04), 0 1px 8px rgba(37, 35, 51, 0.04)',
        elevated: '0 4px 16px rgba(37, 35, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
