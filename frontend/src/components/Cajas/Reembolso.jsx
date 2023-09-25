import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button, Input, DatePicker } from "antd";
import moment from "moment";

function Reembolso() {
  const [reembolsos, setReembolsos] = useState([]);
  const [filteredReembolsos, setFilteredReembolsos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const dummyReembolsos = [
      {
        id: 1,
        numeroPedido: "1001",
        monto: 500,
        motivo: "Decoloracion de ropa",
        fecha: "2023-09-20",
      },
      {
        id: 2,
        numeroPedido: "1002",
        monto: 300,
        motivo: "Quemado por plancha",
        fecha: "2023-09-21",
      },
      {
        id: 3,
        numeroPedido: "1003",
        monto: 1000,
        motivo: "Rasgado por lavadora",
        fecha: "2023-09-22",
      },
    ];

    setReembolsos(dummyReembolsos);
    setFilteredReembolsos(dummyReembolsos);
  }, []);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = reembolsos.filter(
      (reembolso) =>
        reembolso.numeroPedido.toLowerCase().includes(searchTerm) ||
        reembolso.monto.toString().toLowerCase().includes(searchTerm) ||
        reembolso.motivo.toLowerCase().includes(searchTerm) ||
        reembolso.fecha.toLowerCase().includes(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredReembolsos(filtered);
  };

  const handleReembolso = () => {
    setVisible(true);
  };

  const handleConfirmReembolso = () => {
    const currentDate = moment(); 
    const formattedDate = currentDate.format("YYYY-MM-DD"); 

    const nuevoReembolso = {
      id: reembolsos.length + 1,
      numeroPedido: numeroPedido,
      monto: parseInt(monto),
      motivo: motivo,
      fecha: formattedDate,
    };

    setReembolsos([...reembolsos, nuevoReembolso]);
    setFilteredReembolsos([...reembolsos, nuevoReembolso]);

    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Registro de Reembolsos</strong>
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
              <th className="py-3 px-6">Número de Pedido</th>
              <th className="py-3 px-6">Monto</th>
              <th className="py-3 px-6">Motivo</th>
              <th className="py-3 px-6">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredReembolsos.map((reembolso) => (
              <tr className="bg-white border-b" key={reembolso.id}>
                <td className="py-3 px-1 text-center">{reembolso.id}</td>
                <td className="py-3 px-6">{reembolso.numeroPedido}</td>
                <td className="py-3 px-6">{reembolso.monto}</td>
                <td className="py-3 px-6">{reembolso.motivo}</td>
                <td className="py-3 px-6">{reembolso.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            onClick={handleReembolso}
            className="bg-red-500 text-white p-3 rounded-md shadow-lg hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Registrar Reembolso
          </button>
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
      <Modal
        title="Registrar Reembolso"
        visible={visible}
        onOk={handleConfirmReembolso}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmReembolso}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Confirmar Reembolso
          </Button>,
          <Button
            key="cancelar"
            onClick={handleClose}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Cancelar
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de Pedido:
            </label>
            <Input
              type="text"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
              placeholder="Ingrese el número de pedido"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Monto:
            </label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo:
            </label>
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Reembolso;
