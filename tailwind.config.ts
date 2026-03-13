import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#faf7f2',
        'bg-secondary': '#f0ebe3',
        'bg-elevated': '#ffffff',
        'text-primary': '#2c2520',
        'text-secondary': '#6b6058',
        'text-muted': '#9a9088',
        'accent': '#8b6914',
        'accent-dim': '#c9a96e',
        'movement': '#a67c00',
        'policy': '#4a6074',
        'org-event': '#8b7330',
        'social': '#7a7570',
        'environment': '#4a7a52',
        'community': '#5a7a94',
        'welfare': '#a05a66',
        'other-sector': '#7a7068',
      },
      fontFamily: {
        ja: ['"Noto Sans JP"', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
