/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        cta: "var(--color-cta)",
        background: "var(--color-background)",
        text: "var(--color-text)",
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        heading: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}