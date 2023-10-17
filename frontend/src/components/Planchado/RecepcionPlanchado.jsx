import React, { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { RiUserSearchFill } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Axios from "axios";

function RecepcionPlanchado() {
  const [filtro, setFiltro] = useState("");
  const { data: clients } = useSWR("clients", async () => {
    const response = await Axios.get("http://localhost:5000/clients");
    return response.data;
  });

  const filteredClients = clients
    ? clients.filter((client) => {
        const searchTerm = filtro.toLowerCase();
        return (
          client.name.toLowerCase().includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm) ||
          client.phone.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  const shouldShowTable = filtro !== "" && filteredClients.length > 0;

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Recepción de Planchado</strong>
        </div>
      </div>
      <div className="search-bg">
        <div className="fc mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="search-ipt"
              value={filtro}
              onChange={(event) => setFiltro(event.target.value)}
            />
            <div className="absolute top-2.5 left-1 text-gray-400">
              <HiOutlineSearch fontSize={20} className="text-gray-400" />
            </div>
            <div className="mt-3 flex items-center">
              <AiOutlineInfoCircle className="text-yellow-500" size={24} />
              <span className="ml-1 text-white font-bold text-base">
                Busca por nombre, correo o teléfono
              </span>
            </div>
          </div>
        </div>
        {shouldShowTable ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th className="th1">ID</th>
                  <th className="th2">Nombre</th>
                  <th className="th2">Teléfono</th>
                  <th className="th2">Correo</th>
                  <th className="th2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr className="bg-white border-b" key={index}>
                    <td className="py-3 px-1 text-center">{index + 1}</td>
                    <td className="th2 font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="th2">{client.phone}</td>
                    <td className="th2">{client.email}</td>
                    <td>
                      <Link
                        to={`/puntoVenta?clientName=${client.name}&serviceType=Planchado`}
                      >
                        <button className="btn-generate">
                          <div className="subtitle m-1">Generar pedido</div>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center bg-white rounded-md p-4">
            {filtro === "" ? (
              <div className="fcj">
                <RiUserSearchFill className="mr-2 text-2xl" />{" "}
                <span className="title">CLIENTES ENCONTRADOS...</span>
              </div>
            ) : (
              <div className="fcj">
                <FaExclamationCircle className="mr-2 text-2xl text-red-500" />{" "}
                <span className="title">No se encontraron coincidencias</span>
              </div>
            )}
          </div>
        )}

        <div className="fcol-container">
          <Link to="/addClient">
            <button className="btn-big">
              <div className="subtitle m-1">Añadir Cliente</div>
            </button>
          </Link>
          <div className="text-blue-200 font-semibold mt-2">
            ¿El cliente no está registrado? ¡Regístralo!
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecepcionPlanchado;
