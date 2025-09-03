    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          colors: {
            bg: 'hsl(230 15% 7%)',
            text: 'hsl(230 15% 90%)',
            muted: 'hsl(230 15% 60%)',
            accent: 'hsl(30 95% 55%)',
            primary: 'hsl(240 85% 50%)',
            surface: 'hsl(230 15% 12%)',
          },
          borderRadius: {
            lg: '16px',
            md: '10px',
            sm: '6px',
            xl: '24px',
          },
          boxShadow: {
            card: '0 4px 12px hsla(0, 0%, 0%, 0.2)',
            modal: '0 12px 32px hsla(0, 0%, 0%, 0.3)',
          },
          spacing: {
            lg: '20px',
            md: '12px',
            sm: '8px',
            xl: '32px',
          },
          fontSize: {
            body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
            caption: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
            display: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
            heading: ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
          },
          transitionTimingFunction: {
            custom: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
          },
          transitionDuration: {
            base: '250ms',
            fast: '150ms',
            slow: '400ms',
          },
          container: {
            center: true,
            padding: {
              DEFAULT: '1rem',
              md: '1.5rem',
            },
            screens: {
              '2xl': '1024px',
            },
          },
          gridTemplateColumns: {
            12: 'repeat(12, minmax(0, 1fr))',
          },
          gap: {
            gutter: '16px',
          },
        },
      },
      plugins: [],
    };
  