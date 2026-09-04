/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg-canvas)',
          light: '#F8FAFC',
          dark: '#0A0D14',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          glass: 'var(--bg-surface-glass)',
        },
        heading: 'var(--text-heading)',
        body: 'var(--text-body)',
        muted: 'var(--text-muted)',
        dim: 'var(--text-dim)',
        crimson: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          glow: 'rgba(239, 68, 68, 0.45)',
        },
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        card: 'var(--border-card)',
        accent: 'var(--border-accent)',
      },
      boxShadow: {
        'crimson-glow': '0 0 24px rgba(239, 68, 68, 0.40)',
        'crimson-glow-lg': '0 0 40px rgba(239, 68, 68, 0.30)',
        'card-glow': '0 8px 30px -4px rgba(239, 68, 68, 0.18)',
      },
      backgroundImage: {
        'crimson-gradient': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'dark-ambient': 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.18) 0%, transparent 60%)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
