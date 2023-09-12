import React from "react";
import { Link } from "react-router-dom";

export default function MenuPuntoVenta() {
  return (
    <div className="bg-gray-200 p-8 text-center rounded-md">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Bienvenido Usuario, ¿que desea hacer?
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link
          to="/puntoVenta"
          className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Crear Pedido</div>
          <div className="mt-2">Iniciar un nuevo pedido</div>
        </Link>
        <Link
          to="/pedidosProceso"
          className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Ver Pedidos en Proceso</div>
          <div className="mt-2">Consultar pedidos en curso</div>
        </Link>
        <Link
          to="/pedidosFinalizados"
          className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Pedidos Finalizados</div>
          <div className="mt-2">Ver pedidos completados</div>
        </Link>
        <Link
          to="/cajas"
          className="bg-orange-500 text-white p-6 rounded-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none "
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Cajas</div>
          <div className="mt-2">Ver movimientos de dinero</div>
        </Link>
      </div>
    </div>
  );
}
