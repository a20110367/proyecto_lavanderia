import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button, Input, Select } from "antd";

function CorteCajaTurno() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [monto, setMonto] = useState("");
  const [turno, setTurno] = useState("Matutino");
  const [usuario, setUsuario] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const dummyCortes = [
      {
        id: 1,
        fecha: "2023-09-20",
        monto: 1500,
        usuario: "Usuario1",
        turno: "Matutino",
      },
      {
        id: 2,
        fecha: "2023-09-18",
        monto: 1200,
        usuario: "Usuario2",
        turno: "Vespertino",
      },
      {
        id: 3,
        fecha: "2023-09-15",
        monto: 1800,
        usuario: "Usuario3",
        turno: "Matutino",
      },
    ];

    setCortes(dummyCortes);
    setFilteredCortes(dummyCortes);
  }, []);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = Cortes.filter((corte) =>
      corte.usuario.toLowerCase().includes(searchTerm) ||
      corte.usuario.toLowerCase().startsWith(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredCortes(filtered);
  };
  

  const handleCorteCaja = () => {
    setVisible(true);
  };

  const handleConfirmCorteCaja = () => {
    const nuevoCorte = {
      id: Cortes.length + 1,
      fecha: fecha,
      monto: parseInt(monto),
      usuario: usuario,
      turno: turno,
    };

    setCortes([...Cortes, nuevoCorte]);
    setFilteredCortes([...Cortes, nuevoCorte]);

    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Corte de Caja Turno</strong>
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
              <th className="py-3 px-6">Usuario</th>
              <th className="py-3 px-6">Turno</th>
            </tr>
          </thead>
          <tbody>
            {filteredCortes.map((corte) => (
              <tr className="bg-white border-b" key={corte.id}>
                <td className="py-3 px-1 text-center">{corte.id}</td>
                <td className="py-3 px-6">{corte.fecha}</td>
                <td className="py-3 px-6">{corte.monto}</td>
                <td className="py-3 px-6">{corte.usuario}</td>
                <td className="py-3 px-6">{corte.turno}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            onClick={handleCorteCaja}
            className="bg-red-500 text-white p-3 rounded-md shadow-lg hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Corte de Caja
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
        title="Registrar Corte de Caja"
        visible={visible}
        onOk={handleConfirmCorteCaja}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCorteCaja}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Confirmar Corte de Caja
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
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
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
              Usuario:
            </label>
            <Input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese el usuario"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Turno:
            </label>
            <Select
              value={turno}
              onChange={(value) => setTurno(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="Matutino">Matutino</Select.Option>
              <Select.Option value="Vespertino">Vespertino</Select.Option>
            </Select>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CorteCajaTurno;
