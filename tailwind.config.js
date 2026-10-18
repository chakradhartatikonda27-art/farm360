/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#064B35',
          dark: '#033D2B',
          deep: '#022C1F',
          light: '#0D5E43',
        },
        evergreen: {
          DEFAULT: '#033D2B',
        },
        botanical: {
          DEFAULT: '#1E6B48',
          hover: '#175639',
        },
        ivory: {
          DEFAULT: '#F7F4EA',
          light: '#FAF8F2',
          surface: '#FDFBF7',
          dark: '#EFE9D9',
        },
        cream: {
          DEFAULT: '#EFE9D9',
          border: '#E2DAC8',
        },
        gold: {
          DEFAULT: '#C7A65A',
          hover: '#B59449',
          light: '#DFCB96',
          pale: '#F2EBD6',
        },
        sage: {
          DEFAULT: '#A8B69A',
          light: '#C9D4BF',
          dark: '#879778',
        },
        charcoal: {
          DEFAULT: '#252C26',
          muted: '#525B54',
          subtle: '#78837A',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'DM Serif Display', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        loose: '0.2em',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(6, 75, 53, 0.05)',
        'elevated': '0 12px 36px -4px rgba(6, 75, 53, 0.08)',
        'gold-glow': '0 4px 24px -2px rgba(199, 166, 90, 0.25)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
