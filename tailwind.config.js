/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#09090b', // Zinc 950
        foreground: '#fafafa', // Zinc 50
        card: {
          DEFAULT: '#18181b', // Zinc 900
          foreground: '#fafafa',
        },
        popover: {
          DEFAULT: '#09090b',
          foreground: '#fafafa',
        },
        primary: {
          DEFAULT: '#3b82f6', // Blue 500
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#27272a', // Zinc 800
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#27272a', // Zinc 800
          foreground: '#a1a1aa', // Zinc 400
        },
        accent: {
          DEFAULT: '#27272a', // Zinc 800
          foreground: '#fafafa',
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          success: '#10b981',
          error: '#ef4444',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        border: '#27272a', // Zinc 800
        'border-subtle': '#2D3548',
        input: '#27272a',
        ring: '#3b82f6',
        'bg-primary': '#0A0E14',
        'bg-secondary': '#18181b',
        'bg-tertiary': '#27272a',
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
