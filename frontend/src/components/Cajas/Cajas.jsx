import React from "react";
import { Link } from "react-router-dom";

export default function Cajas() {
  return (
    <div className="bg-gray-200 p-8 text-center rounded-md">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Bienvenido Usuario, ¿que desea hacer?
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Link
          to="/cajaEntregas"
          className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Entregas</div>
          <div className="mt-2">Registrar entregas</div>
        </Link>
        <Link
          to="/CajaDevolucion"
          className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Devoluciones</div>
          <div className="mt-2">Registrar devoluciones</div>
        </Link>
        <Link
          to="/cajaRetiros"
          className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Retiros</div>
          <div className="mt-2">Registrar retiros de caja</div>
        </Link>
        <Link
          to="/corteCaja"
          className="bg-orange-500 text-white p-6 rounded-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none"
          style={{ textDecoration: "none" }}
        >
          <div className="text-2xl font-semibold">Corte de Caja</div>
          <div className="mt-2">Realizar el cierre diario</div>
        </Link>
      </div>
    </div>
  );
}
