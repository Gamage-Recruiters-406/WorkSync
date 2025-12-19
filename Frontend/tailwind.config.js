/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E8A8A',
        'primary-dark': '#0B6E6E',
        sidebar: '#F1F5F9',
        mainbg: '#F8FAFC',
        card: '#FFFFFF',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
        purpleSoft: '#8B5CF6',
        pinkSoft: '#FB7185',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
