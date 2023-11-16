import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button } from "antd";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useSWR from "swr";
import Swal from 'sweetalert2'
import api from "../../api/api";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";

function PedidosGeneral() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedidos, setSelectedPedidos] = useState({});
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const location = useLocation();

  const machineIdQueryParam = new URLSearchParams(location.search).get(
    "machineId"
  );
  const machineModelQueryParam = new URLSearchParams(location.search).get(
    "machineModel"
  );
  const showCheckbox = machineIdQueryParam !== null;
  const [showMachineName, setShowMachineName] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/orders");
    return response.data;
  };

  const { data } = useSWR("orders", fetcher);

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }
  }, [data]);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) => {
      if (filtroEstatus === "") {
        return true;
      } else {
        return pedido.orderStatus === filtroEstatus;
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      return (
        pedido.client.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.user.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.user.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.id_order.toString().includes(filtro)
      );
    });

    setFilteredPedidos(textFiltered);
  }, [filtro, filtroEstatus, pedidos]);

  if (!data) return <h2>Loading...</h2>;

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleFiltroEstatusChange = (event) => {
    setFiltroEstatus(event.target.value);
  };

  const handleNotificarCliente = async (pedido) => {
    console.log(`Notifying the client for ID Order: ${pedido.id_order}`);
    try {
      setShowMachineName(false);
      showNotification("NOTIFICACIÓN ENVIADA...");
      await api.post("/sendMessage", {
        id_order: pedido.id_order,
        name: pedido.client.name,
        email: pedido.client.email,
        tel: "521" + pedido.client.phone,
        message: `Tu pedido con el folio: ${pedido.id_order} está listo, Ya puedes pasar a recogerlo.`,
        subject: 'Tu Ropa esta Lista',
        text: `Tu ropa esta lista, esperamos que la recojas a su brevedad`,
        warning: false,
      });
      console.log("NOTIFICACIÓN ENVIADA...");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No hay respuesta del servidor.");
      } else {
        setErrMsg("Error al mandar la notificación");
      }
    }
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationVisible(true);

    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  const notifyAll = async () => {
    Swal.fire({
      title: "Notificar a todos los clientes?",
      text: "Estas seguro de notificar a todos los clientes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const filteredOrder = pedidos.filter((pedido) => pedido.orderStatus === "finished")
        try {
          await api.post("/notifyAll", {
            filteredOrder: filteredOrder,
          });
          setShowMachineName(false);
          showNotification("NOTIFICACIONES ENVIADAS...");
          console.log("NOTIFICACIONES ENVIADAS...");
        } catch (err) {
          if (!err?.response) {
            setErrMsg("No hay respuesta del servidor.");
          } else {
            setErrMsg("Error al mandar la notificación");
            console.log(err)
          }
        }
      }
    });
  };

  const handleSeleccionarPedido = (pedido, pedidoId) => {
    const pedidoSeleccionado = pedido;

    if (pedidoSeleccionado && pedidoSeleccionado.orderStatus === "pending") {
      if (selectedPedidos[machineIdQueryParam]) {
        setSelectedPedidos((prevState) => ({
          ...prevState,
          [machineIdQueryParam]: null,
        }));
      }

      const pedidosActualizados = pedidos.map((pedido) => {
        if (pedido.id_order === pedidoId) {
          Axios.api(`/orders/${pedidoId}`, {
            orderStatus: "inProgress",
          });
          return { ...pedido, orderStatus: "inProgress" };
        }
        return pedido;
      });

      setSelectedPedidos((prevState) => ({
        ...prevState,
        [machineIdQueryParam]: pedido.id_order,
      }));

      setPedidos(pedidosActualizados);

      const modal = Modal.info({
        title: "Pedido en Proceso",
        content: (
          <div>
            <p>
              El pedido para el cliente: {pedido.client.name} ha sido cambiado a
              "En Proceso".
            </p>
            {machineModelQueryParam && <p>EQUIPO: {machineModelQueryParam}</p>}
          </div>
        ),
        onOk() { },
        footer: null,
      });

      setTimeout(() => {
        modal.destroy();
      }, 1500);
    } else {
      const modal = Modal.error({
        title: "Error",
        content: "No se puede cambiar el estado de este pedido.",
        onOk() { },
      });

      setTimeout(() => {
        modal.destroy();
      }, 1500);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Pedidos General</strong>
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
          <div className="absolute top-2.5 left-2.5 text-gray-400">
            <HiOutlineSearch fontSize={20} className="text-gray-400" />
          </div>
        </div>
        <button className="btn-primary text-xs" onClick={() => notifyAll()}>Notificar a todos los Clientes</button>
        <select
          className="select-category"
          value={filtroEstatus}
          onChange={handleFiltroEstatusChange}
        >
          <option className="text-base font-semibold" value="">
            Todos
          </option>
          <option
            value="pending"
            className="text-gray-600 font-semibold text-base"
          >
            Pendientes
          </option>
          <option
            value="inProgress"
            className="text-yellow-600 font-semibold text-base"
          >
            En Proceso
          </option>
          <option
            value="finished"
            className="text-blue-600 font-semibold text-base"
          >
            Finalizados
          </option>
          <option
            value="delivered"
            className="text-green-600 font-semibold text-base"
          >
            Entregados
          </option>
          <option
            value="stored"
            className="text-fuchsia-600 font-semibold text-base"
          >
            Almacenados
          </option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th>No. Folio</th>
              <th>Recibió</th>
              <th>Entregó</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>
                Fecha de <br />
                Entrega
              </th>
              <th>Forma de Pago</th>
              <th>Estatus</th>
              <th></th>
              {showCheckbox && <th className="py-3 px-6">Seleccionar</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.slice(startIndex, endIndex).map((pedido) => (
              <tr className="bg-white border-b" key={pedido.id_order}>
                <td className="py-3 px-1 text-center">{pedido.id_order}</td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.user.name}
                </td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.user.name}
                </td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.client.name}
                </td>
                <td className="py-3 px-6">
                  {pedido.ServiceOrderDetail.find(
                    (service) => service.id_serviceOrderDetail
                  ) != undefined
                    ? pedido.ServiceOrderDetail.length
                    : 0}
                </td>
                <td className="py-3 px-6">
                  {formatDate(pedido.scheduledDeliveryDate)}
                </td>
                <td className="py-3 px-6">
                  {pedido.payForm === "delivery" ? "Entrega" : "Anticipo"}
                </td>
                <td className="py-3 px-6 font-bold">
                  {pedido.orderStatus === "pending" ? (
                    <span className="text-gray-600 pl-1">
                      <MinusCircleOutlined /> Pendiente
                    </span>
                  ) : pedido.orderStatus === "stored" ? (
                    <span className="text-fuchsia-600 pl-1">
                      <DropboxOutlined /> Almacenado
                    </span>
                  ) : pedido.orderStatus === "inProgress" ? (
                    <span className="text-yellow-600 pl-1">
                      <ClockCircleOutlined /> En Proceso
                    </span>
                  ) : pedido.orderStatus === "finished" ? (
                    <span className="text-blue-600 pl-1">
                      <IssuesCloseOutlined /> Finalizado no entregado
                    </span>
                  ) : pedido.orderStatus === "delivered" ? (
                    <span className="text-green-600 pl-1">
                      <CheckCircleOutlined /> Finalizado Entregado
                    </span>
                  ) : (
                    <span className="text-red-600 pl-1">
                      <StopOutlined /> Cancelado
                    </span>
                  )}
                </td>

                {showCheckbox && (
                  <td className="py-3 px-6">
                    {pedido.orderStatus === "pending" ? (
                      selectedPedidos[machineIdQueryParam] ? (
                        <input type="checkbox" className="h-6 w-6" disabled />
                      ) : (
                        <input
                          type="checkbox"
                          className="h-6 w-6"
                          onChange={() =>
                            handleSeleccionarPedido(pedido, pedido.id_order)
                          }
                        />
                      )
                    ) : null}
                  </td>
                )}
                <td>
                  {pedido.orderStatus === "finished" && (
                    <button
                      onClick={() => handleNotificarCliente(pedido)}
                      className="btn-primary mt-1"
                    >
                      Notificar al Cliente
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center my-8">
        <ReactPaginate
          previousLabel="Anterior"
          nextLabel="Siguiente"
          breakLabel="..."
          pageCount={Math.ceil(filteredPedidos.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination flex"
          pageLinkClassName="pageLinkClassName"
          previousLinkClassName="prevOrNextLinkClassName"
          nextLinkClassName="prevOrNextLinkClassName"
          breakLinkClassName="breakLinkClassName"
          activeLinkClassName="activeLinkClassName"
        />
      </div>
      <Modal
        open={notificationVisible}
        footer={null}
        onCancel={() => setNotificationVisible(false)}
        destroyOnClose
        afterClose={() => setNotificationVisible(false)}
      >
        <div className="text-center">
          <div style={{ fontSize: "36px", color: "#52c41a" }}>
            <CheckCircleOutlined />
          </div>
          <p>{notificationMessage}</p>
          {showMachineName && <p>EQUIPO: {machineModelQueryParam}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default PedidosGeneral;
