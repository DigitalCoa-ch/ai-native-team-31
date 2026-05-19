/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Surfaces
        surface: {
          deep: '#031427',      // Main backgrounds
          container: '#0b1c30', // Cards, sidebars
          elevated: '#112540',  // Elevated elements
        },
        // Primary - Teal (active states, data highlights)
        teal: {
          DEFAULT: '#00D2FF',
          dim: '#00A8CC',
          glow: 'rgba(0, 210, 255, 0.15)',
        },
        // Secondary - Gold (serif headlines, premium accents)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C967',
          dim: '#B8962E',
        },
        // Status
        success: '#10B981',
        alert: '#EF4444',
        // Text
        text: {
          primary: '#F0F4F8',
          secondary: '#8BA3C0',
          muted: '#4A6580',
        },
        // Border
        border: {
          DEFAULT: 'rgba(0, 210, 255, 0.12)',
          muted: 'rgba(255, 255, 255, 0.06)',
          glow: 'rgba(0, 210, 255, 0.4)',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 210, 255, 0.2), 0 0 10px rgba(0, 210, 255, 0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 210, 255, 0.4), 0 0 20px rgba(0, 210, 255, 0.2)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-lines': 'linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px)',
      },
      boxShadow: {
        'teal-glow': '0 0 15px rgba(0, 210, 255, 0.3), 0 0 30px rgba(0, 210, 255, 0.1)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
};