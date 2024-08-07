import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../utils/format";
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
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const { cookies } = useAuth();
  const [numeroPedidoError, setNumeroPedidoError] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");

  const [prueba, setPrueba] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };


  // const fetch = async (data) => {
  //   const res = await data.map(
  //     (obj) => obj.payStatus = api.get(`/orders/${obj.serviceOrder}`).then(json => setPrueba({...prueba, json}))


  //   )
  //   console.log(res)
  //   return res;
  // }

  const fetcher = async () => {
    const response = await api.get("/cashWithdrawals");
    // return await fetch(response.data);
    return response.data;
  };
  const { data } = useSWR("cashWithdrawals", fetcher);

  useEffect(() => {
    if (data) {
      const cancelacionesFiltrados = data.map(
        (cancelacion) => cancelacion.cashWithdrawalType === "refound" ? {...cancelacion, payStatus: 'paid'} : cancelacion
      );

      setCancelaciones(cancelacionesFiltrados);
      setFilteredCancelaciones(cancelacionesFiltrados);
      console.log(cancelacionesFiltrados)
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = cancelaciones.filter(
      (cancelacion) => {
        const formattedDate = moment(cancelacion.date).format("DD/MM/YYYY");
        return (
          cancelacion.id_cashWithdrawal.toString().toLowerCase().includes(searchTerm) ||
          cancelacion.amount.toString().toLowerCase().includes(searchTerm) ||
          cancelacion.cause.toLowerCase().includes(searchTerm) ||
          formattedDate.toLowerCase().includes(searchTerm)
        );
      });
    setFiltro(event.target.value);
    setFilteredCancelaciones(filtered);
    setCurrentPage(0);
  };

  const handleReembolsar = () => {

  }

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

        const res = await api.post("/cashWithdrawals", {
          cashWithdrawalType: "refound",
          fk_cashCut: parseInt(localStorage.getItem("cashCutId")),
          fk_user: cookies.token,
          serviceOrder: parseInt(numeroPedido),
          amount: parseInt(monto),
          cause: motivo,
          date: date,
        });

        await api.patch(`/cancelOrder/${numeroPedido}`);

        const cashWithdrawal = {
          cashWithdrawalType: "refound",
          id_cashWithdrawal: res.data.id_cashWithdrawal,
          fk_cashCut: parseInt(localStorage.getItem("cashCutId")),
          serviceOrder: parseInt(numeroPedido),
          casher: cookies.username,
          amount: parseInt(monto),
          cause: motivo,
          date: date,
        }

        await api.post('/generateCashWithdrawalTicket', {
          cashWithdrawal: cashWithdrawal,
        })

        const nuevaCancelacion = {
          id_cashWithdrawal: res.data.id_cashWithdrawal,
          cashWithdrawalType: "refound",
          serviceOrder: parseInt(numeroPedido),
          amount: parseInt(monto),
          cause: motivo,
          date: date,
        };

        setCancelaciones([...cancelaciones, nuevaCancelacion]);
        setFilteredCancelaciones([...cancelaciones, nuevaCancelacion]);

        setVisible(false);
      }
    }
    catch (err) {
      console.log(err)
    }
  };

  const handleClose = () => {
    setVisible(false);
    setMonto("");
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
      <div className="mt-3 mb-3">
        <button onClick={handleCancelacion} className="btn-primary">
          Registrar Reembolso / Cancelación
        </button>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th>No. Cancelación</th>
            <th>Número de Pedido</th>
            <th>Estatus</th>
            <th>Monto</th>
            <th>Motivo</th>
            <th>Fecha</th>
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
                key={cancelacion.id_cashWithdrawal}
              >
                <td className="py-3 px-1 text-center">
                  {cancelacion.id_cashWithdrawal}
                </td>
                <td className="py-3 px-6">{cancelacion.serviceOrder}</td>
                <td className="py-3 px-6">{cancelacion.payStatus === 'paid' ? 'PAGAO' : 'NO PAGAO'}</td>
                <td className="py-3 px-6">{"$" + cancelacion.amount}</td>
                <td className="py-3 px-6">{cancelacion.cause}</td>
                <td className="py-3 px-6">{formatDate(cancelacion.date)}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/editEquipo/${machine.id_machine}`)
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
