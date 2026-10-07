/** @type {import('tailwindcss').Config} */

/*
 * Eduvia brand palette — sampled directly from the company logo.
 *   Royal Blue  #203890  (graduation cap, globe, swoosh)
 *   Crimson Red #E8232A  ("Eduvia" script, phone number)
 *
 * primary   = the logo blue, used for structure (headers, footers, brand surfaces)
 * secondary = a brighter sibling of the same blue, used for links and icons
 * accent    = the logo red, reserved for calls to action and emphasis
 * dark      = a cool slate tuned toward the brand blue, used for all text
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './views/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f4fd',
          100: '#e2e8fa',
          200: '#c6d0f4',
          300: '#9fb0e9',
          400: '#6f88dc',
          500: '#203890',
          600: '#1b3079',
          700: '#162663',
          800: '#111d4c',
          900: '#0d1636',
          950: '#080e22',
        },
        secondary: {
          50: '#f1f4fe',
          100: '#e3e9fc',
          200: '#c8d3f8',
          300: '#a3b6f0',
          400: '#7590e3',
          500: '#3c5bd0',
          600: '#203890',
          700: '#1a2e78',
          800: '#152561',
          900: '#111e4a',
          950: '#0c1534',
        },
        accent: {
          50: '#fef1f1',
          100: '#fde2e3',
          200: '#fac9ca',
          300: '#f7a1a3',
          400: '#f2686d',
          500: '#de1f26',
          600: '#c4161c',
          700: '#a3121a',
          800: '#871419',
          900: '#70161a',
          950: '#3d0709',
        },
        dark: {
          50: '#f6f8fc',
          100: '#edf1f9',
          200: '#dfe5f1',
          300: '#c7ccd8',
          400: '#6d7589',
          500: '#5b6376',
          600: '#4b5368',
          700: '#3d4459',
          800: '#2c3145',
          900: '#1b1f31',
          950: '#101322',
        },
      },
      fontFamily: {
        // Variable names come from next/font in app/layout.tsx, so the families
        // are served from this origin instead of fonts.googleapis.com.
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        // Handwritten accents ("Your Dreams Our Guidance")
        script: ['var(--font-caveat)', 'Segoe Script', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16, 19, 34, 0.05)',
        soft: '0 1px 2px rgba(16, 19, 34, 0.04), 0 4px 12px -2px rgba(16, 19, 34, 0.06)',
        medium: '0 2px 4px rgba(16, 19, 34, 0.04), 0 12px 28px -6px rgba(16, 19, 34, 0.10)',
        strong: '0 4px 8px rgba(16, 19, 34, 0.05), 0 24px 48px -12px rgba(16, 19, 34, 0.18)',
        brand: '0 8px 24px -6px rgba(32, 56, 144, 0.28)',
        'brand-lg': '0 18px 44px -12px rgba(32, 56, 144, 0.38)',
        accent: '0 8px 24px -6px rgba(232, 35, 42, 0.30)',
        'accent-lg': '0 18px 44px -12px rgba(232, 35, 42, 0.40)',
      },
      transitionTimingFunction: {
        // Shared motion tokens — one rhythm across the whole product.
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '220ms',
        slow: '400ms',
        slower: '700ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Slow colour drift for the ambient section backdrops.
        auroraDrift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(5%, -7%, 0) scale(1.1)' },
          '66%': { transform: 'translate3d(-6%, 5%, 0) scale(0.94)' },
        },
        // Light sweep across primary CTAs on hover.
        // (keyframes defined in index.css — driven from raw CSS, not a utility)
        // Ambient halo behind focal elements.
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        aurora: 'auroraDrift 22s ease-in-out infinite',
        'aurora-slow': 'auroraDrift 30s ease-in-out infinite reverse',
        'pulse-glow': 'pulseGlow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
