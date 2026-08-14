import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06080D',
        'bg-soft': '#0B0F17',
        blue: '#1E9EDB',
        'blue-2': '#0F6FB8',
        'blue-deep': '#0F2A51',
        text: '#EEF2F7',
        muted: '#8A97A8',
        wa: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        display: ['var(--font-ibm-plex-sans)', 'Arial', 'sans-serif'],
        subtitle: ['var(--font-space-grotesk)', 'Arial', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Consolas', 'monospace'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
export default config;
