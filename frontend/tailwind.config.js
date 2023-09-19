/** 
 * @format
 * @type {import('tailwindcss').Config}
 */ 

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,ts,tsx}"],
  theme: {
    borderRadius:{
      'none': '0',
      'sm': '15px 50px 30px 5px',
      'md': '0.375rem',
      'lg': '0.5rem',
      'full': '9999px',
      'large': '12px',
    },
    extend: {
      // Agrega clases personalizadas para mostrar u ocultar elementos
      variants: {
        display: ["group-hover", "group-focus"],
      },
    colors: {
      indigoBlue: '#134157',
      oxfordBlue: '#02182B',
      dodgerBlue: '#0197F6',
      sapphire: '#0055B6',
      blush: '#E15B7F',
      raspberry: '#DA2B5A',
    }, 
  },
  plugins: [],
}
}