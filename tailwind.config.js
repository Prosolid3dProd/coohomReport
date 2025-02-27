/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    fontFamily: {
      default: "Helvetica Neue,sans-serif;",
      login: "Muli,sans-serif",
    },
    fontSize: {
      sm: "8px",
      smd: "12px",
      md: "16px",
      sv: "24px",
      lg: "32px",
      xl: "40px",
      xxl: "80px",
    },
    extend: {
      backgroundImage: {
        login: "url('../../../assets/loginBg.jpg')",
      },
      animation: {
        editable: "animate-pulse",
      },
      screens: {
        tableHeader: { max: "768px" },
      },
    },
  },
  plugins: [],
};
