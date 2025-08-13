/** @type {import('tailwindcss').Config} */
module.exports = {
  // react to either 'dark' class or our data attribute
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
