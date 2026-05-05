import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#EBE7DC',
          50: '#F4F1E8',
          100: '#EBE7DC',
          200: '#E2DBCE'
        },
        ink: {
          DEFAULT: '#26180f',
          900: '#1a1208',
          800: '#26180f',
          700: '#3a2820',
          600: '#5a4538'
        },
        amber: {
          DEFAULT: '#F5C460',
          50: '#FBEFC7',
          100: '#F8DD94',
          400: '#F5C460',
          500: '#E5974f',
          600: '#D98031',
          700: '#B86b28'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
      },
      maxWidth: {
        prose: '640px'
      }
    }
  },
  plugins: []
};

export default config;
