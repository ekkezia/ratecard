module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      tablet: '900px',
      // => @media (min-width: 640px) { ... }
    },
    extend: {
      fontSize: {
        '2xs': '8px',
      },
    },
  },
  plugins: [],
};
