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
      //* BLUE
      // Oscuro
      OxfordBlue: '#001529',
      // Claro
      PennBlue: '#001f54',
      IndigoDye: '#034078',
      //* Verde Azulado
      // Oscuro
      Cerulean: '#1282a2',
      // Claro
      Moonstone: '#3898B1',  
      NonPhotoblue: '#a8dadc',
      
      // ROJOS
      // Claro
      RedPantone: '#e63946',
      //Oscuro
      FireBrick: '#BC1E2C',

      //GREEN
      Malachite: '#33C944',
    }, 
  },
  plugins: [],
}
}
