import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";
import Axios from "axios";
import useSWR from "swr";

function Reembolso() {
  const [reembolsos, setReembolsos] = useState([]);
  const [filteredReembolsos, setFilteredReembolsos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const { cookies } = useAuth();
  const [numeroPedidoError, setNumeroPedidoError] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/cashWhithdrawals");
    return response.data;
  };

  const { data } = useSWR("cashWhithdrawals", fetcher);

  useEffect(() => {
    if (data) {
      setReembolsos(data);
    setFilteredReembolsos(data);
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = reembolsos.filter(
      (reembolso) =>
        reembolso.fk_cashCut.toLowerCase().includes(searchTerm) ||
        reembolso.amount.toString().toLowerCase().includes(searchTerm) ||
        reembolso.cause.toLowerCase().includes(searchTerm) ||
        reembolso.date.toLowerCase().includes(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredReembolsos(filtered);
  };

  const handleReembolso = () => {
    setVisible(true);
  };

  const handleMontoInput = () => {
    setMontoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };
  
  const handleNpedidoInput = () => {
    setNumeroPedidoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleMotivoInput = () => {
    setMotivoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
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

    if (!localStorage.getItem("cashCutId")) {
      setMotivoError("No se ha inicializado la caja");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (isValid) {
      const date = moment().format(); 

      Axios.post("http://localhost:5000/cashWhithdrawals", {
        cashWhithdrawalType : "refound",
        fk_cashCut : parseInt(localStorage.getItem("cashCutId")),
        fk_user:cookies.token,
        amount : parseInt(monto),
        cause: motivo,
        date: date
      });

      const nuevoReembolso = {
        id_cashWhithdrawal: reembolsos.length + 1,
        numeroPedido: numeroPedido,
        amount: parseInt(monto),
        cause: motivo,
        date: date,
      };

      setReembolsos([...reembolsos, nuevoReembolso]);
      setFilteredReembolsos([...reembolsos, nuevoReembolso]);

      setVisible(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
              <th >No. Reembolso</th>
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
              <tr className="bg-white border-b" key={reembolso.id_cashWhithdrawal}>
                <td className="py-3 px-1 text-center">{reembolso.id_cashWhithdrawal}</td>
                <td className="py-3 px-6">{reembolso.id_order}</td>
                <td className="py-3 px-6">{"$" + reembolso.amount}</td>
                <td className="py-3 px-6">{reembolso.cause}</td>
                <td className="py-3 px-6">{formatDate(reembolso.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <Modal
        title="Registrar Reembolso"
        open={visible}
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
            className="btn-cancel-modal text-white"
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
              onInput={handleNpedidoInput}
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
              onInput={handleMontoInput}
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
              onInput={handleMotivoInput}
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
