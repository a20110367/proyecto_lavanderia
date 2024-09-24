import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";
import useSWR from "swr";
import Swal from "sweetalert2";
import api from "../../api/api";

function Cancelacion() {
  const navigate = useNavigate();
  const [cancelaciones, setCancelaciones] = useState([]);
  const [filteredCancelaciones, setFilteredCancelaciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [motivo, setMotivo] = useState("");
  const { cookies } = useAuth();
  const [numeroPedidoError, setNumeroPedidoError] = useState("");
  const [motivoError, setMotivoError] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/orderCancelable");
    return response.data;
  };
  const { data } = useSWR("orderCancelable", fetcher);

  useEffect(() => {
    if (data) {
      setCancelaciones(data);
      setFilteredCancelaciones(data);
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = cancelaciones.filter(
      (cancelacion) => {
        return (
          cancelacion.id_order.toString().toLowerCase().includes(searchTerm) ||
          cancelacion.cliente.name.toLowerCase().includes(searchTerm)
        );
      });
    setFiltro(event.target.value);
    setFilteredCancelaciones(filtered);
    setCurrentPage(0);
  };

  const handleCancelacion = () => {
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

  const handleMontoInput = () => {
    setMontoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleNpedidoInput = () => {
    setNumeroPedidoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleMotivoInput = () => {
    setMotivoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleConfirmCancelacion = async () => {
    try {
      // Validación de campos obligatorios
      let isValid = true;

      if (!numeroPedido) {
        setNumeroPedidoError("Este campo es obligatorio");
        isValid = false;
      } else {
        setNumeroPedidoError("");
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

        await api.patch("/cancelOrder", {
          id_order: numeroPedido,
          cause: motivo,
        })

        // const nuevaCancelacion = {
        //   id_cashWithdrawal: res.data.id_cashWithdrawal,
        //   cashWithdrawalType: "refound",
        //   serviceOrder: parseInt(numeroPedido),
        //   amount: parseInt(monto),
        //   cause: motivo,
        //   date: date,
        // };

        // setFilteredCancelaciones([...cancelaciones, nuevaCancelacion]);

        setVisible(false);
      }
    }
    catch (err) {
      console.error(err)
    }
  };

  const handleClose = () => {
    setVisible(false);
    setMotivo("");
    setNumeroPedido("")
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Cancelación de Servicios</strong>
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
      <table className="w-full text-sm text-left text-gray-500 mt-8">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th>No. Orden</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estatus del Pago</th>
            <th>Estatus de la Orden</th>
            <th>Cajero</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCancelaciones
            .slice()
            .reverse()
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((cancelacion) => (
              <tr
                className="bg-white border-b"
                key={cancelacion.id_order}
              >
                <td className="py-3 px-1 text-center">
                  {cancelacion.id_order}
                </td>
                <td className="py-3 px-6">{cancelacion.client.name + ' ' + cancelacion.client.firstLN + ' ' + cancelacion.client.secondLN }</td>
                <td className="py-3 px-6 font-bold">{"$" + cancelacion.totalPrice}</td>
                <td className="py-3 px-6">{cancelacion.payStatus === 'paid' ? 'PAGADO' : 'NO PAGADO'}</td>
                <td className="py-3 px-6">{cancelacion.orderStatus}</td>
                <td className="py-3 px-6">{cancelacion.user.name + ' ' + cancelacion.user.firstLN + ' ' + cancelacion.user.secondLN}</td>
                <td>
                  <button
                    onClick={() =>
                      handleCancelacion()
                    }
                    className={`py-3 px-6 ${cancelacion.payStatus === 'paid'
                      ? "btn-back w-11/12 p-0 m-0"
                      : "btn-payment w-11/12 p-0 m-0"
                    }`}
                    >{cancelacion.payStatus === 'paid' ? 'Reembolsar' : 'Cancelar'}
                  </button></td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        title="Registrar Reembolso / Cancelación"
        open={visible}
        onOk={handleConfirmCancelacion}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCancelacion}
            className="btn-print text-white"
          >
            Confirmar Cancelación de Servicio
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
              type="number"
              value={numeroPedido}
              onChange={(e) => setNumeroPedido(e.target.value)}
              placeholder="Ingrese el número de pedido"
              onInput={handleNpedidoInput}
            />
            <p className="text-red-500">{numeroPedidoError}</p>
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
          pageCount={Math.ceil(filteredCancelaciones.length / itemsPerPage)}
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

export default Cancelacion;
