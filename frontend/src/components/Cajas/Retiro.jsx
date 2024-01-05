import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";
import useSWR from "swr";
import { formatDate } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/api";

function Retiro() {
  const navigate = useNavigate();
  const [retiros, setRetiros] = useState([]);
  const [filteredRetiros, setFilteredRetiros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const { cookies } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/cashWithdrawals");
    return response.data;
  };

  const { data } = useSWR("cashWithdrawals", fetcher);

  useEffect(() => {
    if (data) {
      const retirosFiltrados = data.filter(
        (retiro) => retiro.cashWithdrawalType === "withdrawal"
      );
      setRetiros(retirosFiltrados);
      setFilteredRetiros(retirosFiltrados);
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = retiros.filter(
      (retiro) =>
        retiro.cause.toLowerCase().includes(searchTerm) ||
        retiro.created.toLowerCase().includes(searchTerm) ||
        retiro.user.name.toLowerCase().includes(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredRetiros(filtered);
    setCurrentPage(0);
  };

  const handleRetiro = () => {
    if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }
    setVisible(true);
  };

  const handleMotivoInput = () => {
    setMotivoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleMontoInput = () => {
    setMontoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
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

    if (!localStorage.getItem("cashCutId")) {
      setMotivoError("No se ha inicializado la caja");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (isValid) {
      const date = moment().format();

      api.post("/cashWithdrawals", {
        cashWithdrawalType: "withdrawal",
        fk_cashCut: parseInt(localStorage.getItem("cashCutId")),
        fk_user: cookies.token,
        amount: parseInt(monto),
        cause: motivo,
        date: date,
      });
      setVisible(false);

      const nuevoRetiro = {
        id_cashWithdrawal: retiros.length + 1,
        amount: parseInt(monto),
        cause: motivo,
        date: date,
        user: { name: cookies.username },
      };

      setRetiros([...retiros, nuevoRetiro]);
      setFilteredRetiros([...retiros, nuevoRetiro]);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setMonto("");
    setMotivo("");
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Registro de Retiros</strong>
        </div>
      </div>
      <div className="flex items-center">
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
        <button onClick={handleRetiro} className="btn-primary">
          Registrar Retiro
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th>No. Retiro</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Motivo</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {filteredRetiros
            .slice()
            .reverse()
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((retiro) => (
              <tr className="bg-white border-b" key={retiro.id_cashWithdrawal}>
                <td className="py-3 px-1 text-center">
                  {retiro.id_cashWithdrawal}
                </td>
                <td className="py-3 px-6">{formatDate(retiro.date)}</td>
                <td className="py-3 px-6">{"$" + retiro.amount}</td>
                <td className="py-3 px-6">{retiro.cause}</td>
                <td className="py-3 px-6">{retiro.user.name} {retiro.user.firsLN} {retiro.user.secondLN}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        title="Registrar Retiro de Caja"
        open={visible}
        onOk={handleConfirmRetiro}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmRetiro}
            className="btn-print text-white"
          >
            Confirmar Retiro de Caja
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
