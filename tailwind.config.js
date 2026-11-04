/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { colors: { cream: '#F7F3ED', beige: '#E8DED1', warm: '#FCFAF7', cocoa: '#8B735E', espresso: '#44372E', charcoal: '#292724', sage: '#A7B09B' }, fontFamily: { sans: ['Be Vietnam Pro', 'ui-sans-serif', 'system-ui'], serif: ['Playfair Display', 'serif'] }, boxShadow: { soft: '0 12px 32px rgba(68,55,46,.09)' } } },
  plugins: []
}
