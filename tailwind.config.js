module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    screens: {
      'xs': '320px',
      // => @media (min-width: 320) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        custom: {
          0: "#7DD3FC",
          1: "#FDA4AF",
          2: "#6EE7B7",
          3: "#FDE68A",
          4: "#C4B5FD",
          5: "#CBD5E1",
          // --------
          6: "#347594",
          7: "#a3505a",
          8: "#187851",
          9: "#9c8736",
          10:"#52438a",
          11: "#637891"
        }
      },
    },
    fontFamily: {
      'body': ['"Nunito"'],
      'josefin': ['Josefin Sans'],
    }
  },
  plugins: [],
}
