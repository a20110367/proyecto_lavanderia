import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import ReactPaginate from "react-paginate";

function Reembolso() {
  const [reembolsos, setReembolsos] = useState([]);
  const [filteredReembolsos, setFilteredReembolsos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [numeroPedidoError, setNumeroPedidoError] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const dummyReembolsos = [
      {
        id: 1,
        numeroPedido: "1001",
        monto: 500,
        motivo: "Decoloracion de ropa",
        fecha: "20/09/2023",
      },
      {
        id: 2,
        numeroPedido: "1002",
        monto: 300,
        motivo: "Quemado por plancha",
        fecha: "21/09/2023",
      },
      {
        id: 3,
        numeroPedido: "1003",
        monto: 1000,
        motivo: "Rasgado por lavadora",
        fecha: "23/09/2023",
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
    // Validación de campos obligatorios
    let isValid = true;

    if (!numeroPedido) {
      setNumeroPedidoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setNumeroPedidoError("");
    }

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
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mb-3">
      <div className="title-container">
          <strong className="title-strong">Registro de Reembolsos</strong>
        </div>
      </div>
        <div className="flex items-center -4">
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
        <div className="mt-3 mb-3">
          <button
            onClick={handleReembolso}
            className="btn-primary"
          >
            Registrar Reembolso
          </button>
        
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th >ID</th>
              <th >Número de Pedido</th>
              <th>Monto</th>
              <th >Motivo</th>
              <th >Fecha</th>
            </tr>
          </thead>
          <tbody>
          {filteredReembolsos
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((reembolso) => (
              <tr className="bg-white border-b" key={reembolso.id}>
                <td className="py-3 px-1 text-center">{reembolso.id}</td>
                <td className="py-3 px-6">{reembolso.numeroPedido}</td>
                <td className="py-3 px-6">{"$" + reembolso.monto}</td>
                <td className="py-3 px-6">{reembolso.motivo}</td>
                <td className="py-3 px-6">{reembolso.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            className="btn-print text-white"
          >
            Confirmar Reembolso
          </Button>,
          <Button
            key="cancelar"
            onClick={handleClose}
            className="btn-cancel-modal"
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
            <p className="text-red-500">{numeroPedidoError}</p>
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
        </form>
      </Modal>
      <div className="flex justify-center mt-4 mb-4">
    <ReactPaginate
      previousLabel={"Anterior"}
      nextLabel={"Siguiente"}
      breakLabel={"..."}
      pageCount={Math.ceil(filteredReembolsos.length / itemsPerPage)}
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

export default Reembolso;
