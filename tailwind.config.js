/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  corePlugins: { preflight: false },
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
};
