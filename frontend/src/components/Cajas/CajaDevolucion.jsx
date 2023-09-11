import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function CajaDevolucion() {
    const [devoluciones, setDevoluciones] = useState([]);
    const [filtro, setFiltro] = useState("");
  
    useEffect(() => {
      // Simulación de datos (dummy)
      const dummyDevoluciones = [
        {
          id: 1,
          nombreCliente: "Saul",
          tipoPedido: "Lavado de patas",
          formaReembolso: "Efectivo",
          reembolso: "$30",
          fechaDevolucion: "2023-09-15",
          encargadoCaja: "Juan",
          motivoDevolucion: "Cambio de opinión",
        },
        {
          id: 2,
          nombreCliente: "Axel",
          tipoPedido: "Monas Chinas",
          formaReembolso: "Tarjeta",
          reembolso: "$50",
          fechaDevolucion: "2023-09-16",
          encargadoCaja: "Ana",
          motivoDevolucion: "Producto defectuoso",
        },
      ];
  
      setDevoluciones(dummyDevoluciones);
    }, []);
  
    const handleFiltroChange = (event) => {
      setFiltro(event.target.value);
    };
  
    const filteredDevoluciones = devoluciones.filter((devolucion) => {
      return (
        devolucion.nombreCliente.toLowerCase().includes(filtro.toLowerCase()) ||
        devolucion.id.toString().includes(filtro) ||
        devolucion.tipoPedido.toLowerCase().includes(filtro.toLowerCase())
      );
    });
  
    return (
      <div>
        <div className="mb-3">
          <div className="bg-white px-4 pt-3 pb-4 rounded-md border vorder-gray-200 flex-1">
            <strong>Devoluciones</strong>
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
                <HiOutlineSearch fontSize={20} className="text-gray-400 " />
              </div>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="py-3 px-1 text-center">ID</th>
                <th className="py-3 px-6">Nombre del Cliente</th>
                <th className="py-3 px-6">Tipo de Pedido</th>
                <th className="py-3 px-6">Forma de Reembolso</th>
                <th className="py-3 px-6">Reembolso</th>
                <th className="py-3 px-6">Motivo de Devolución</th>
                <th className="py-3 px-6">Fecha de Devolución</th>
                <th className="py-3 px-6">Encargado de caja</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevoluciones.map((devolucion) => (
                <tr className="bg-white border-b" key={devolucion.id}>
                  <td className="py-3 px-1 text-center">{devolucion.id}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {devolucion.nombreCliente}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {devolucion.tipoPedido}
                  </td>
                  <td className="py-3 px-6">{devolucion.formaReembolso}</td>
                  <td className="py-3 px-6">{devolucion.reembolso}</td>
                  <td className="py-3 px-6">{devolucion.motivoDevolucion}</td>
                  <td className="py-3 px-6">{devolucion.fechaDevolucion}</td>
                  <td className="py-3 px-6">{devolucion.encargadoCaja}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
