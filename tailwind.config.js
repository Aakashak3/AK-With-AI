/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        primary: {
          DEFAULT: '#8B5CF6', // Electric Purple
          glow: 'rgba(139, 92, 246, 0.5)',
          dark: '#6D28D9',
        },
        accent: '#06B6D4', // Cyan
        'accent-glow': 'rgba(6, 182, 212, 0.5)',
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px theme("colors.primary.glow")',
        'neon-cyan': '0 0 5px theme("colors.accent"), 0 0 20px theme("colors.accent-glow")',
        'neon-lg': '0 0 10px theme("colors.primary.DEFAULT"), 0 0 40px theme("colors.primary.glow")',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        glass: '10px',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

module.exports = config;
