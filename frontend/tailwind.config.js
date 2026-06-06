// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        background: '#09090b',
        surface: '#18181b',
        surfaceHighlight: '#27272a',
        surfaceElevated: '#1e1e22',
        textMain: '#f4f4f5',
        textMuted: '#a1a1aa',
        textDim: '#71717a',
        border: '#27272a',
        borderLight: '#3f3f46',
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
        warning: { 400: '#facc15', 500: '#eab308', 600: '#ca8a04', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
        danger: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
        info: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}