/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sunshine: {
          50: '#FFFEF7',
          100: '#FFF9E6',
          200: '#FFF2CC',
          300: '#FFE999',
          400: '#FFD93D',
          500: '#F5C800',
        },
        warm: {
          50: '#FAFAF8',
          100: '#F5F4F0',
          200: '#E8E5DF',
          300: '#D4D0C8',
          400: '#A9A49B',
          500: '#7A756E',
          600: '#5C5751',
          700: '#3E3A35',
          800: '#272420',
          900: '#141210',
        },
        rose: {
          100: '#FFF5F5',
          200: '#FFE4E1',
          300: '#FFC0CB',
          400: '#F4A0B0',
        },
        milk: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif SC"', 'STSong', 'serif'],
        body: ['Nunito', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        hand: ['Caveat', 'Kalam', 'cursive'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'diary-sm': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
        'diary-md': '0 4px 16px -4px rgb(0 0 0 / 0.06), 0 2px 8px -2px rgb(0 0 0 / 0.04)',
        'diary-lg': '0 12px 32px -8px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06)',
        'diary-glow': '0 0 20px -4px rgb(255 217 61 / 0.25)',
      },
      animation: {
        'soft-bounce-in': 'soft-bounce-in 0.35s cubic-bezier(0.34, 1.3, 0.64, 1)',
        'heart-float': 'heart-float 0.8s ease-out forwards',
        'card-enter': 'card-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'count-up': 'count-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'breathe': 'breathe 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'soft-bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'heart-float': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1.2)' },
        },
        'card-enter': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(0.5em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'breathe': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
