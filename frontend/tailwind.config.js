/** 
 * @format
 * @type {import('tailwindcss').Config}
 */ 

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Agrega clases personalizadas para mostrar u ocultar elementos
      variants: {
        display: ["group-hover", "group-focus"],
      },
  },
  plugins: [],
}
}