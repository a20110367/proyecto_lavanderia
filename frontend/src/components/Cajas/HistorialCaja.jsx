import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";

function HistorialCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const dummyCortes = [
      {
        id: 1,
        fecha: "2023-09-20",
        dineroFondo: 20000,
        retirosTotales: 0,
        ingresosTotales: 20000,
        ingresoEfectivo: 10000,
        ingresoTarjeta: 10000,
        finalTotalCaja: 0,
        usuario: "Usuario1",
        turno: "Matutino",
      },
      {
        id: 2,
        fecha: "2023-09-18",
        dineroFondo: 15000,
        retirosTotales: 300,
        ingresosTotales: 15000,
        ingresoEfectivo: 7000,
        ingresoTarjeta: 8000,
        finalTotalCaja: 0,
        usuario: "Usuario2",
        turno: "Vespertino",
      },
      {
        id: 3,
        fecha: "2023-09-15",
        dineroFondo: 18000,
        retirosTotales: 600,
        ingresosTotales: 16000,
        ingresoEfectivo: 9000,
        ingresoTarjeta: 7000,
        finalTotalCaja: 0,
        usuario: "Usuario3",
        turno: "Matutino",
      },
    ];

    // Calcular finalTotalCaja para cada corte
    const cortesConFinalTotalCaja = dummyCortes.map((corte) => ({
      ...corte,
      finalTotalCaja:
        corte.dineroFondo + corte.ingresosTotales - corte.retirosTotales,
    }));

    setCortes(cortesConFinalTotalCaja);
    setFilteredCortes(cortesConFinalTotalCaja);
  }, []);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = Cortes.filter(
      (corte) =>
        corte.usuario.toLowerCase().includes(searchTerm) ||
        corte.usuario.toLowerCase().startsWith(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredCortes(filtered);
  };

  const handleDetallesClick = (corte) => {
    console.log("Mostrar detalles del corte:", corte);
  };

  return (
    <div className="text-center mt-4">
        <div>
          <div className="mb-3">
            <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1 mt-4">
              <strong>Historial de cortes</strong>
            </div>
          </div>
          <div className="bg-neutral-600 rounded-md min-h-screen p-4">
            <div className="flex items-center mb-4">
              <div className="relative w-full">
                  <div className="relative w-full flex items-center">
                    <div className="absolute left-1 top-4 text-gray-400">
                      <HiOutlineSearch
                        fontSize={20}
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="border-2 rounded-md py-2 px-4 pl-10 text-gray-600 focus:outline-none focus:ring focus:border-blue-300 border-black mt-2"
                      value={filtro}
                      onChange={handleFiltroChange}
                    />
                  </div>
              </div>
            </div>
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th className="py-3 px-1 text-center">ID</th>
                    <th className="py-3 px-6">FECHA</th>
                    <th className="py-3 px-6">DINERO EN FONDO</th>
                    <th className="py-3 px-6">INGRESO EN EFECTIVO</th>
                    <th className="py-3 px-6">INGRESO EN TARJETA</th>
                    <th className="py-3 px-6">INGRESOS TOTALES</th>
                    <th className="py-3 px-6">RETIROS TOTALES</th>
                    <th className="py-3 px-6">FINAL TOTAL CAJA</th>
                    <th className="py-3 px-6">USUARIO</th>
                    <th className="py-3 px-6">TURNO</th>
                    <th className="py-3 px-6">ACCIONES</th>{" "}
                  </tr>
                </thead>
                <tbody>
                  {filteredCortes.map((corte) => (
                    <tr className="bg-white border-b" key={corte.id}>
                      <td className="py-3 px-1 text-center">{corte.id}</td>
                      <td className="py-3 px-6">{corte.fecha}</td>
                      <td className="py-3 px-6">{corte.dineroFondo}</td>
                      <td className="py-3 px-6">{corte.retirosTotales}</td>
                      <td className="py-3 px-6">{corte.ingresosTotales}</td>
                      <td className="py-3 px-6">{corte.ingresoEfectivo}</td>
                      <td className="py-3 px-6">{corte.ingresoTarjeta}</td>
                      <td className="py-3 px-6">{corte.finalTotalCaja}</td>
                      <td className="py-3 px-6">{corte.usuario}</td>
                      <td className="py-3 px-6">{corte.turno}</td>
                      <td className="py-3 px-6">
                        <button
                          className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
                          onClick={() => handleDetallesClick(corte)}
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

          </div>
        </div>
    </div>
  );
}

export default HistorialCaja;
