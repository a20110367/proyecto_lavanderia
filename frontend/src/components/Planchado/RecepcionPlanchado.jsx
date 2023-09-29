import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import Axios from "axios";

function RecepcionPlanchado() {
  const [filtro, setFiltro] = useState("");

  const { data: clients } = useSWR("clients", async () => {
    const response = await Axios.get("http://localhost:5000/clients");
    return response.data;
  });

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Recepción de Lavandería</strong>
        </div>
      </div>
      <div className="bg-neutral-600 rounded-md min-h-screen p-4">
        <div className="flex items-center mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="border-2 rounded-md py-2 px-4 pl-10 text-gray-600 focus:outline-none focus:ring focus:border-blue-300 border-black"
              value={filtro}
              onChange={handleFiltroChange}
            />
            <div className="absolute top-2.5 left-1 text-gray-400">
              <HiOutlineSearch fontSize={20} className="text-gray-400" />
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="py-3 px-1 text-center">ID</th>
              <th className="py-3 px-6">Nombre del Cliente</th>
              <th className="py-3 px-6">Servicios Más Usados</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients &&
              clients
                .filter((client) => {
                  return client.name
                    .toLowerCase()
                    .includes(filtro.toLowerCase());
                })
                .map((client, index) => (
                  <tr className="bg-white border-b" key={index}>
                    <td className="py-3 px-1 text-center">{index + 1}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="py-3 px-6">Planchado</td>
                    <td>
                    <Link to={`/puntoVenta?clientName=${client.name}`}>
  <button className="bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm">
    <div className="text-lg font-semibold">Generar pedido</div>
  </button>
</Link>

                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        <Link
          to="/menuPuntoVenta"
          className="mt-4 flex text-center text-decoration-none"
        >
          <button className="bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm">
            <div className="text-lg font-semibold">Volver</div>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RecepcionPlanchado;
