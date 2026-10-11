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
        bg: {
          primary: '#101113',
          secondary: '#17191D',
          card: '#1D2025',
          elevated: '#252930',
        },
        text: {
          primary: '#F5F5F7',
          secondary: '#A5A9B2',
        },
        border: {
          DEFAULT: '#343840',
        },
        accent: {
          violet: '#9B87F5',
          'violet-hover': '#B4A0FF',
          'violet-glow': 'rgba(155, 135, 245, 0.3)',
          cyan: '#64D9F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(155, 135, 245, 0.15)',
        'glow-violet-lg': '0 0 40px rgba(155, 135, 245, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
