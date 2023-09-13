import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // Simulación de datos (dummy)
    const dummyPedidos = [
      {
        id: 1,
        nombreCliente: "Saul",
        nombreEmpleado: "Juan",
        tipoServicio: { descripcion: "Lavado de patas", precio: 100 },
        fechaPedido: "2023-09-12",
        estatus: "Pagado",
        adeudo: 0,
      },
      {
        id: 2,
        nombreCliente: "Axel",
        nombreEmpleado: "Maria",
        tipoServicio: { descripcion: "Monas Chinas", precio: 150 },
        fechaPedido: "2023-09-13",
        estatus: "Adeudo",
        adeudo: 50,
      },
      {
        id: 3,
        nombreCliente: "Carlos",
        nombreEmpleado: "Luis",
        tipoServicio: { descripcion: "Planchado", precio: 80 },
        fechaPedido: "2023-09-14",
        estatus: "Adeudo",
        adeudo: 30,
      },
    ];

    setPedidos(dummyPedidos);
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Pedidos</strong>
        </div>
      </div>
      <div className="bg-neutral-600 rounded-md min-h-screen p-4">
        <div className="flex items-center mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar por nombre del cliente o ID..."
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
              <th className="py-3 px-6">Nombre del Empleado</th>
              <th className="py-3 px-6">Tipo de Servicio</th>
              <th className="py-3 px-6">Fechas del Pedido</th>
              <th className="py-3 px-6">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {pedidos
              .filter((pedido) => {
                return (
                  pedido.nombreCliente
                    .toLowerCase()
                    .includes(filtro.toLowerCase()) ||
                  pedido.id.toString().includes(filtro) ||
                  pedido.nombreEmpleado
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
                );
              })
              .map((pedido) => (
                <tr className="bg-white border-b" key={pedido.id}>
                  <td className="py-3 px-1 text-center">{pedido.id}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.nombreCliente}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.nombreEmpleado}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.tipoServicio.descripcion} ($
                    {pedido.tipoServicio.precio})
                  </td>
                  <td className="py-3 px-6">{pedido.fechaPedido}</td>
                  <td
                    className={`py-3 px-6 ${
                      pedido.estatus === "Adeudo"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {pedido.estatus === "Adeudo" ? (
                      <span className="text-red-600 pl-1">
                        Anticipo ${pedido.tipoServicio.precio - pedido.adeudo}{" "}
                        (+${pedido.adeudo} Adeudo)
                      </span>
                    ) : (
                      `Pagado $${pedido.tipoServicio.precio}`
                    )}
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

export default Pedidos;
