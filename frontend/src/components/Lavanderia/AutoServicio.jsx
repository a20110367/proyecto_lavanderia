import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { RiUserSearchFill } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Axios from "axios";
import ReactPaginate from "react-paginate";

function AutoServicio() {
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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    // Verificar si estamos regresando desde PuntoVenta
    const isReturningFromPuntoVenta = localStorage.getItem(
      "returningFromPuntoVenta"
    );

    if (isReturningFromPuntoVenta === "true") {
      // Recuperar el nombre del cliente desde localStorage
      const lastSelectedClient = localStorage.getItem("lastSelectedClient");

      // Asignar el nombre del cliente al campo de búsqueda
      setFiltro(lastSelectedClient || "");

      // Eliminar la bandera de returningFromPuntoVenta de localStorage
      localStorage.removeItem("returningFromPuntoVenta");
    }
  }, []);

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Autoservicio</strong>
        </div>
      </div>
      <div className="fc mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="input-search"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          />
          <div className="absolute top-2.5 left-3 text-gray-400">
            <HiOutlineSearch fontSize={20} className="text-gray-400" />
          </div>
          <div className="mt-3 flex items-center">
            <AiOutlineInfoCircle className="text-yellow-500" size={24} />
            <span className="ml-1 text-black font-bold text-base">
              Busca por nombre, correo o teléfono
            </span>
          </div>
        </div>
      </div>
      {shouldShowTable ? (
        <div className="">
          <table className="w-full table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="">No. Cliente</th>
                <th className="">Nombre</th>
                <th className="">Teléfono</th>
                <th className="">Correo</th>
                <th className="">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((client, index) => (
                  <tr className="bg-white border-b" key={index}>
                    <td className="py-3 px-1 text-center">{index + 1}</td>
                    <td className="th2 font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="th2">{client.phone}</td>
                    <td className="th2">{client.email}</td>
                    <td>
                      <Link
                        to={`/puntoVenta?clientName=${client.name}&serviceType=Autoservicio`}
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
          <div className="flex justify-center mt-4 mb-4">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredClients.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName={"pagination flex"}
              pageLinkClassName="pageLinkClassName"
              previousLinkClassName="prevOrNextLinkClassName"
              nextLinkClassName="prevOrNextLinkClassName"
              breakLinkClassName="breakLinkClassName"
              activeLinkClassName="activeLinkClassName"
            />
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center bg-white rounded-md p-4 border border-blue-600 ">
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
        <div className="flex justify-between items-center">
          <div>
            <Link to="/addClient">
              <button className="btn-big-light">
                <div className="subtitle m-1">Añadir Cliente</div>
              </button>
            </Link>
            <div className="text-IndigoDye font-semibold mt-2">
              ¿El cliente no está registrado? ¡Regístralo!
            </div>
          </div>
          <div className="text-center ml-96">
            <Link
              to={`/puntoVenta?clientName=Público en General&serviceType=Autoservicio`}
            >
              <button className="btn-big-light">
                <div className="subtitle m-1">Público en General</div>
              </button>
            </Link>
            <div className="text-IndigoDye font-semibold mt-2">
              Generar servicio para clientes sin cuenta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoServicio;