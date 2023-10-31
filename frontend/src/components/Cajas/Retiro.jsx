import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";

function Retiro() {
  const [retiros, setRetiros] = useState([]);
  const [filteredRetiros, setFilteredRetiros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const { cookies } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const dummyRetiros = [
      {
        id: 1,
        fecha: "20/09/2023",
        monto: 500,
        motivo: "Gastos varios",
        usuario: "Usuario1",
      },
      {
        id: 2,
        fecha: "21/09/2023",
        monto: 300,
        motivo: "Retiro personal",
        usuario: "Usuario2",
      },
      {
        id: 3,
        fecha: "22/09/2023",
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
    let isValid = true;

    if (!monto) {
      setMontoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMontoError("");
    }

    if (!motivo) {
      setMotivoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (isValid) {
      const currentDate = moment();
      const formattedDate = currentDate.format("DD/MM/YYYY");

      const nuevoRetiro = {
        id: retiros.length + 1,
        fecha: formattedDate,
        monto: parseInt(monto),
        motivo: motivo,
        usuario: cookies.username,
      };

      setRetiros([...retiros, nuevoRetiro]);
      setFilteredRetiros([...retiros, nuevoRetiro]);

      setVisible(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Registro de Retiros</strong>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="input-search"
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
            <th>ID</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Motivo</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {filteredRetiros
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((retiro) => (
              <tr className="bg-white border-b" key={retiro.id}>
                <td className="py-3 px-1 text-center">{retiro.id}</td>
                <td className="py-3 px-6">{retiro.fecha}</td>
                <td className="py-3 px-6">{"$" + retiro.monto}</td>
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
              Monto:
            </label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto"
              addonBefore="$"
            />
            <p className="text-red-500">{montoError}</p>
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
            <p className="text-red-500">{motivoError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario:
            </label>
            <Input
              value={cookies.username} // Utiliza el nombre de usuario desde las cookies
              readOnly // Hacer el campo solo de lectura
            />
            <p className="text-red-500">{usuarioError}</p>
          </div>
        </form>
      </Modal>
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredRetiros.length / itemsPerPage)}
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
  );
}

export default Retiro;
