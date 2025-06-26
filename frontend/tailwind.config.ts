import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FAFAFA',
        primaryAccent: '#18181B',
        brand: '#FF4017',
        background: {
          DEFAULT: '#111113',
          secondary: '#27272A'
        },
        secondary: '#f5f5f5',
        border: 'rgba(var(--color-border-default))',
        accent: '#27272A',
        muted: '#A1A1AA',
        destructive: '#E53935',
        positive: '#22C55E'
      },
      fontFamily: {
        geist: 'var(--font-geist-sans)',
        dmmono: 'var(--font-dm-mono)'
      },
      borderRadius: {
        xl: '10px'
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'gradient-border': {
          '0%': {
            'background-position': '0% 50%'
          },
          '100%': {
            'background-position': '200% 50%'
          }
        },
        'neon-glow': {
          '0%': {
            'box-shadow': '0 0 2px #fff, 0 0 4px #fff, 0 0 6px #3b82f6, 0 0 8px #3b82f6, 0 0 10px #3b82f6, 0 0 12px #3b82f6, 0 0 14px #3b82f6',
            'border-color': '#3b82f6'
          },
          '50%': {
            'box-shadow': '0 0 4px #fff, 0 0 8px #60a5fa, 0 0 12px #60a5fa, 0 0 16px #60a5fa, 0 0 20px #60a5fa, 0 0 24px #60a5fa, 0 0 28px #60a5fa',
            'border-color': '#60a5fa'
          },
          '100%': {
            'box-shadow': '0 0 2px #fff, 0 0 4px #fff, 0 0 6px #3b82f6, 0 0 8px #3b82f6, 0 0 10px #3b82f6, 0 0 12px #3b82f6, 0 0 14px #3b82f6',
            'border-color': '#3b82f6'
          }
        }
      },
      animation: {
        'spin': 'spin 1.5s linear infinite',
        'gradient-border': 'gradient-border 3s ease infinite',
        'neon-glow': 'neon-glow 1.5s ease-in-out infinite'
      }
    }
  },
  plugins: [tailwindcssAnimate]
} satisfies Config
