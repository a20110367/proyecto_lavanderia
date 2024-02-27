import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Checkbox } from "antd";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../hooks/auth/auth";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";

function PedidosVarios() {
  const [pedidos, setPedidos] = useState([]);
  const { cookies } = useAuth();
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [notificationMessage, setNotificationMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/otherQueue");
    return response.data;
  };

  const { data } = useSWR("otherQueue", fetcher);

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
        return pedido.serviceStatus === filtroEstatus;
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      const searchTerm = filtro.toLowerCase();
      const searchTermsArray = searchTerm.split(" ");


      const isMatch = searchTermsArray.every((term) =>
        [pedido.serviceOrder.client.name, pedido.serviceOrder.client.firstLN, pedido.serviceOrder.client.secondLN]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
      return (
        isMatch ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.id_otherEvent.toString().includes(filtro) ||
        pedido.id_otherEvent.toString().includes(filtro) ||
        pedido.id_description.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setFilteredPedidos(textFiltered);
    setCurrentPage(0);
  }, [filtro, filtroEstatus, pedidos]);

  if (!data) return <h2>Loading...</h2>;
  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleFiltroEstatusChange = (event) => {
    setFiltroEstatus(event.target.value);
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationVisible(true);

    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  const handleStartProcess = async (pedido) => {
    try {
      if (!pedido || !pedido.id_otherEvent) {
        console.error("El pedido es inválido o no tiene un ID válido.");
        return;
      }

      setLoading(true);

      const updatedPedidos = pedidos.map((p) =>
        p.id_otherEvent === pedido.id_otherEvent
          ? { ...p, serviceStatus: "inProgress" }
          : p
      );
      setPedidos(updatedPedidos);

      await api.patch(`/startOtherQueue/${pedido.id_otherEvent}`, {
        fk_idStaffMember: cookies.token,
      });
      showNotification(`Pedido iniciado`);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishProcess = async (pedido) => {
    setLoading(true);

    if (!pedido) {
      console.error("El pedido seleccionado es indefinido.");
      setLoading(false);
      return;
    }

    try {
      // Actualizar localmente el estado del pedido a "finished"
      const updatedPedidos = pedidos.map((p) =>
        p.id_otherEvent === pedido.id_otherEvent
          ? { ...p, serviceStatus: "finished" }
          : p
      );
      setPedidos(updatedPedidos);

      const res = await api.patch(`/FinishOtherQueue/${pedido.id_otherEvent}`, {
        fk_idStaffMember: cookies.token,
      });

      showNotification(
        "Pedido finalizado correctamente, NOTIFICACIÓN ENVIADA..."
      );
      if (res.data.orderStatus === "finished") {
        await api.post("/sendMessage", {
          id_order: pedido.fk_idServiceOrder,
          name:
            pedido.serviceOrder.client.name +
            " " +
            pedido.serviceOrder.client.firstLN +
            " " +
            pedido.serviceOrder.client.secondLN,
          email: pedido.serviceOrder.client.email,
          tel: "521" + pedido.serviceOrder.client.phone,
          message: `Tu pedido con el folio: ${pedido.fk_idServiceOrder} está listo, Ya puedes pasar a recogerlo.`,
          subject: "Tu Ropa esta Lista",
          text: `Tu ropa esta lista, esperamos que la recojas a su brevedad`,
          warning: false,
        });
      }
    } catch (error) {
      console.error("Error al finalizar el pedido:", error);
    }
  };
  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Pedidos de Lavanderia</strong>
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
            className="text-Cerulean font-semibold text-base"
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
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Fecha de Entrega</th>
              <th>Estatus</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos
              .filter(
                (pedido) =>
                  pedido.serviceStatus !== "finished" &&
                  pedido.serviceStatus !== "delivered"
              ) // Filtrar pedidos que no tienen estado "finished"
              .slice(startIndex, endIndex)
              .map((pedido) => (
                <tr key={pedido.id_otherEvent}>
                  <td className="py-3 px-1 text-center">
                    {pedido.id_description}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.serviceOrder.user.name} {pedido.serviceOrder.user.firstLN} {pedido.serviceOrder.user.secondLN}
                  </td>

                  <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.serviceOrder.client.name} {pedido.serviceOrder.client.firstLN} {pedido.serviceOrder.client.secondLN}  
                  </td>
                  <td className="py-3 px-6">
                    {pedido.otherService.description}
                  </td>

                  <td className="py-3 px-6">
                    {formatDate(pedido.otherService.created)}
                  </td>
                  <td className="py-3 px-6 font-bold ">
                    {pedido.serviceStatus === "pending" ? (
                      <span className="text-gray-600 pl-1">
                        <MinusCircleOutlined /> Pendiente
                      </span>
                    ) : pedido.serviceStatus === "stored" ? (
                      <span className="text-fuchsia-600 pl-1">
                        <DropboxOutlined /> Almacenado
                      </span>
                    ) : pedido.serviceStatus === "inProgress" ? (
                      <span className="text-yellow-600 pl-1">
                        <ClockCircleOutlined /> En Proceso de Lavado
                      </span>
                    ) : pedido.serviceStatus === "finished" ? (
                      <span className="text-blue-600 pl-1">
                        <IssuesCloseOutlined /> Finalizado no entregado
                      </span>
                    ) : pedido.serviceStatus === "delivered" ? (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Finalizado Entregado
                      </span>
                    ) : pedido.serviceStatus === "cancelled" ? (
                      <span className="text-red-600 pl-1">
                        <StopOutlined /> Cancelado
                      </span>
                    ) : (
                      <span className="text-gray-600 pl-1">
                        Estado Desconocido
                      </span>
                    )}
                  </td>
                  <td>
                    {pedido.serviceOrder.notes
                      ? pedido.serviceOrder.notes
                      : "No hay notas"}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.serviceStatus === "pending" && (
                      <button
                        onClick={() => handleStartProcess(pedido)}
                        className="btn-primary ml-2 mt-1"
                      >
                        Iniciar
                      </button>
                    )}
                    {pedido.serviceStatus === "inProgress" && (
                      <button
                        onClick={() => handleFinishProcess(pedido)}
                        className="btn-finish ml-2 mt-1"
                      >
                        Terminar
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
          pageCount={Math.ceil(
            filteredPedidos.filter(
              (pedido) =>
                pedido.serviceStatus !== "finished" &&
                pedido.serviceStatus !== "delivered"
            ).length / itemsPerPage
          )}
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
      >
        <div className="text-center">
          <div style={{ fontSize: "36px", color: "#52c41a" }}>
            <CheckCircleOutlined />
          </div>
          <p>{notificationMessage}</p>
        </div>
      </Modal>
    </div>
  );
}

export default PedidosVarios;
