/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dental: {
          bg: '#F8FBFA',
          card: '#FFFFFF',
          mint: '#DCEFEB',
          accent: '#70B8AC',
          'accent-hover': '#5CA598',
          'accent-light': '#EBF7F4',
          text: '#344C52',
          muted: '#6B858D',
          border: '#E3ECE9',
          error: '#D9534F',
          'error-bg': '#FDF2F0',
          success: '#4E9F8E',
          'success-bg': '#EAF6F3',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 8px 30px rgba(52, 76, 82, 0.06), 0 1px 3px rgba(52, 76, 82, 0.04)',
        'soft-float': '0 20px 40px -15px rgba(112, 184, 172, 0.25)',
        'soft-input': '0 2px 6px rgba(52, 76, 82, 0.03)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}

