/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg) / <alpha-value>)',
        text: 'hsl(var(--color-text) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        modal: 'var(--shadow-modal)',
      },
      spacing: {
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
      },
      fontSize: {
        body: ['var(--font-size-base)', 'var(--line-height-relaxed)'],
        caption: ['var(--font-size-sm)', 'var(--line-height-relaxed)'],
        display: ['var(--font-size-4xl)', 'var(--line-height-tight)'],
        heading: ['var(--font-size-2xl)', 'var(--line-height-tight)'],
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      transitionDuration: {
        'base': '250ms',
        'fast': '150ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
};

