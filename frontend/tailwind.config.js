/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#14b8a6",
          "secondary": "#059669", 
          "accent": "#0d9488",
          "neutral": "#374151",
          "base-100": "#ffffff",
          "base-200": "#f0fdfa",
          "base-300": "#ccfbf1",
          "info": "#0891b2",
          "success": "#16a34a",
          "warning": "#d97706",
          "error": "#dc2626",
        },
        dark: {
          "primary": "#14b8a6",
          "secondary": "#059669",
          "accent": "#0d9488", 
          "neutral": "#374151",
          "base-100": "#111827",
          "base-200": "#1f2937",
          "base-300": "#374151",
          "info": "#0891b2",
          "success": "#16a34a",
          "warning": "#d97706",
          "error": "#dc2626",
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}
