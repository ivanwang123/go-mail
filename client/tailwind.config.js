module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: "#FBFBFB",
        primary: "#3A3A3A",
        secondary: "#707475",
        accent: "#DC4B4E",
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ["disabled", "hover"],
      textColor: ["disabled"],
      display: ["group-hover"],
    },
  },
  plugins: [],
};
