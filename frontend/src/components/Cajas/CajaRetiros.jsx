import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function CajaRetiros() {
    const [retiros, setRetiros] = useState([]);
    const [filtro, setFiltro] = useState("");
  
    useEffect(() => {
      // Simulación de datos (dummy)
      const dummyRetiros = [
        {
          id: 1,
          encargadoCaja: "Juan",
          motivoRetiro: "Compra de suministros",
        },
        {
          id: 2,
          encargadoCaja: "Ana",
          motivoRetiro: "Pago a proveedor",
        },
      ];
  
      setRetiros(dummyRetiros);
    }, []);
  
    const handleFiltroChange = (event) => {
      setFiltro(event.target.value);
    };
  
    const filteredRetiros = retiros.filter((retiro) => {
      return (
        retiro.encargadoCaja.toLowerCase().includes(filtro.toLowerCase()) ||
        retiro.id.toString().includes(filtro) ||
        retiro.motivoRetiro.toLowerCase().includes(filtro.toLowerCase())
      );
    });
  
    return (
      <div>
        <div className="mb-3">
          <div className="bg-white px-4 pt-3 pb-4 rounded-md border vorder-gray-200 flex-1">
            <strong>Retiros</strong>
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
                <th className="py-3 px-6">Encargado de Caja</th>
                <th className="py-3 px-6">Motivo de Retiro</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetiros.map((retiro) => (
                <tr className="bg-white border-b" key={retiro.id}>
                  <td className="py-3 px-1 text-center">{retiro.id}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {retiro.encargadoCaja}
                  </td>
                  <td className="py-3 px-6">{retiro.motivoRetiro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
