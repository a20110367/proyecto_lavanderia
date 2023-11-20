import React from "react";
import { Link } from "react-router-dom";
import lavanderia from "../assets/lavanderia.jpg"
import { useAuth } from "../hooks/auth/auth";

const customButtonStyle = {
  backgroundColor: "#00386c",
  '&:hover': { // Utiliza '&:hover' en lugar de ':hover'
    backgroundColor: "#0052a5", // Cambia el color de fondo al pasar el mouse
    // Puedes agregar otros estilos aquí si lo deseas
  },
  
  display: "flex",
  alignItems: "center",
  padding: "6px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  textDecoration: "none", // Quitar subrayado del texto
};

const imageStyle = {
  width: "50%",
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
};

const textContainerStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  flex: 1,
};

export default function MenuPuntoVenta() {
  const { cookies } = useAuth();
  return (
    <div className="bg-gray-200 p-8 text-center rounded-md">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Bienvenido {cookies.role === "admin" ? "Administrador" : "Empleado"}{" "} {cookies.username}, ¿qué desea hacer?
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link
          to="/puntoVenta"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 1" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Crear Pedido</div>
            <div>Iniciar un nuevo pedido</div>
          </div>
        </Link>
        <Link
          to="/pedidosProceso"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 2" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Ver Pedidos en Proceso</div>
            <div>Consultar pedidos en curso</div>
          </div>
        </Link>
        <Link
          to="/pedidosFinalizados"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 3" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Pedidos Finalizados</div>
            <div>Ver pedidos completados</div>
          </div>
        </Link>
        <Link
          to="/cajas"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 4" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Cajas</div>
            <div>Ver movimientos de dinero</div>
          </div>
        </Link>
        <Link
          to="/puntoVenta"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 5" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Auto Servicio</div>
            <div>No se lavado rapido</div>
          </div>
        </Link>
        <Link
          to="/pedidosProceso"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 6" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Lavado por encargo</div>
            <div>Dejar encargada la ropa</div>
          </div>
        </Link>
        <Link
          to="/pedidosFinalizados"
          className="text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={customButtonStyle}
        >
          <div style={imageStyle}>
            <img src={lavanderia} alt="Imagen 7" style={{ width: "100%" }} />
          </div>
          <div style={textContainerStyle}>
            <div className="text-2xl font-semibold">Planchado</div>
            <div>Planchar Ropa</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
