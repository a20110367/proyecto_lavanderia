import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button, Input, DatePicker } from "antd";

function Retiro() {
  const [retiros, setRetiros] = useState([]);
  const [filteredRetiros, setFilteredRetiros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState(null);
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const dummyRetiros = [
      {
        id: 1,
        fecha: "2023-09-20",
        monto: 500,
        motivo: "Gastos varios",
        usuario: "Usuario1",
      },
      {
        id: 2,
        fecha: "2023-09-21",
        monto: 300,
        motivo: "Retiro personal",
        usuario: "Usuario2",
      },
      {
        id: 3,
        fecha: "2023-09-22",
        monto: 1000,
        motivo: "Pago a proveedor",
        usuario: "Usuario3",
      },
    ];

    setRetiros(dummyRetiros);
    setFilteredRetiros(dummyRetiros);
  }, []);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = retiros.filter(
      (retiro) =>
        retiro.motivo.toLowerCase().includes(searchTerm) ||
        retiro.fecha.toLowerCase().includes(searchTerm) ||
        retiro.usuario.toLowerCase().includes(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredRetiros(filtered);
  };

  const handleRetiro = () => {
    setVisible(true);
  };

  const handleConfirmRetiro = () => {
    const nuevoRetiro = {
      id: retiros.length + 1,
      fecha: fecha.format("YYYY-MM-DD"),
      monto: parseInt(monto),
      motivo: motivo,
      usuario: usuario,
    };

    setRetiros([...retiros, nuevoRetiro]);
    setFilteredRetiros([...retiros, nuevoRetiro]);

    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Registro de Retiros</strong>
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
              <th className="py-3 px-6">Fecha</th>
              <th className="py-3 px-6">Monto</th>
              <th className="py-3 px-6">Motivo</th>
              <th className="py-3 px-6">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {filteredRetiros.map((retiro) => (
              <tr className="bg-white border-b" key={retiro.id}>
                <td className="py-3 px-1 text-center">{retiro.id}</td>
                <td className="py-3 px-6">{retiro.fecha}</td>
                <td className="py-3 px-6">{retiro.monto}</td>
                <td className="py-3 px-6">{retiro.motivo}</td>
                <td className="py-3 px-6">{retiro.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            onClick={handleRetiro}
            className="bg-red-500 text-white p-3 rounded-md shadow-lg hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Registrar Retiro
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
        title="Registrar Retiro de Caja"
        visible={visible}
        onOk={handleConfirmRetiro}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmRetiro}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Confirmar Retiro de Caja
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
              Fecha:
            </label>
            <DatePicker
              format="YYYY-MM-DD"
              value={fecha}
              onChange={(date) => setFecha(date)}
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario:
            </label>
            <Input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese el nombre de usuario"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Retiro;
