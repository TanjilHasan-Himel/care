import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        secondary: '#FB7185',
        accent: '#0EA5E9',
        muted: '#0F172A',
        surface: '#FFFFFF',
        background: '#F5F7FA'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 22px 48px -14px rgba(15, 23, 42, 0.16)'
      }
    }
  },
  plugins: []
};

export default config;
