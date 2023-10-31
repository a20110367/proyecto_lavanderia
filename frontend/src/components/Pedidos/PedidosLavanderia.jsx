import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";

function PedidosLavanderia() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const dummyPedidos = [
      {
        id_pedido: 1,
        empleado_recibio: "Juan",
        empleado_entrego: "María",
        cliente: "Saul Rodriguez",
        id_cobro: 1,
        pedidoDetalle: "Lavado de patas",
        orderstatus: "Pendiente",
        fecha_entrega_real: "15/09/2023",
      },
      {
        id_pedido: 2,
        empleado_recibio: "Axel",
        empleado_entrego: "María",
        cliente: "Maria Fernandez",
        id_cobro: 2,
        pedidoDetalle: "Monas Chinas",
        orderstatus: "En proceso",
        fecha_entrega_real: "16/09/2023",
      },
      {
        id_pedido: 3,
        empleado_recibio: "Carlos",
        empleado_entrego: "Luis",
        cliente: "Luis Robledo",
        id_cobro: 3,
        pedidoDetalle: "Lavado",
        orderstatus: "Finalizado",
        fecha_entrega_real: "17/09/2023",
      },
      {
        id_pedido: 4,
        empleado_recibio: "Laura",
        empleado_entrego: "Ana",
        cliente: "Axel Vergara",
        id_cobro: 4,
        pedidoDetalle: "Lavado delicado",
        orderstatus: "Entregado",
        fecha_entrega_real: "18/09/2023",
      },
      {
        id_pedido: 5,
        empleado_recibio: "Fernanda",
        empleado_entrego: "Maya",
        cliente: "Ximena Marquez",
        id_cobro: 5,
        pedidoDetalle: "Lavado basico",
        orderstatus: "CANCELADO",
        fecha_entrega_real: "18/09/2023",
      },
      {
        id_pedido: 6,
        empleado_recibio: "Fernanda",
        empleado_entrego: "Hector",
        cliente: "Kevin Miranda",
        id_cobro: 6,
        pedidoDetalle: "Lavado basico",
        orderstatus: "Almacenado",
        fecha_entrega_real: "19/09/2023",
      },
    ];

    setPedidos(dummyPedidos);
    setFilteredPedidos(dummyPedidos);
  }, []);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) => {
      if (filtroEstatus === "") {
        return true;
      } else {
        return pedido.orderstatus.toLowerCase() === filtroEstatus.toLowerCase();
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      return (
        pedido.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.empleado_recibio.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.empleado_entrego.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.id_pedido.toString().includes(filtro)
      );
    });

    setFilteredPedidos(textFiltered);
  }, [filtro, filtroEstatus, pedidos]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleFiltroEstatusChange = (event) => {
    setFiltroEstatus(event.target.value);
  };

  const handleNotificarCliente = (pedido) => {
    console.log(`Notifying the client for pedido ID: ${pedido.id_pedido}`);
    showNotification("NOTIFICACIÓN ENVIADA...");
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationVisible(true);

    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
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
            value="Pendiente"
            className="text-gray-600 font-semibold text-base"
          >
            Pendientes
          </option>
          <option
            value="En proceso"
            className="text-yellow-600 font-semibold text-base"
          >
            En Proceso
          </option>
          <option
            value="Finalizado"
            className="text-blue-600 font-semibold text-base"
          >
            Finalizados
          </option>
          <option
            value="Entregado"
            className="text-green-600 font-semibold text-base"
          >
            Entregados
          </option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th>No. Folio</th>
              <th>Empleado que Recibió</th>
              <th>Empleado que Entregó</th>
              <th>Nombre del Cliente</th>
              <th>Detalle del pedido</th>
              <th>Fecha de Entrega</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.slice(startIndex, endIndex).map((pedido) => (
              <tr className="bg-white border-b" key={pedido.id_pedido}>
                <td className="py-3 px-1 text-center">{pedido.id_pedido}</td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.empleado_recibio}
                </td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.empleado_entrego}
                </td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.cliente}
                </td>
                <td className="py-3 px-6">{pedido.pedidoDetalle}</td>
                <td className="py-3 px-6">{pedido.fecha_entrega_real}</td>
                <td className="py-3 px-6">
                  {pedido.orderstatus === "Pendiente" ? (
                    <span className="text-gray-600 pl-1">
                      <MinusCircleOutlined /> Pendiente
                    </span>
                  ) : pedido.orderstatus === "Almacenado" ? (
                    <span className="text-fuchsia-600 pl-1">
                      <DropboxOutlined /> Almacenado
                    </span>
                  ) : pedido.orderstatus === "En proceso" ? (
                    <span className="text-yellow-600 pl-1">
                      <ClockCircleOutlined /> En Proceso
                    </span>
                  ) : pedido.orderstatus === "Finalizado" ? (
                    <span className="text-blue-600 pl-1">
                      <IssuesCloseOutlined /> Finalizado no entregado
                      <button
                        onClick={() => handleNotificarCliente(pedido)}
                        className="btn-primary mt-1"
                      >
                        Notificar al Cliente
                      </button>
                    </span>
                  ) : pedido.orderstatus === "Entregado" ? (
                    <span className="text-green-600 pl-1">
                      <CheckCircleOutlined /> Finalizado Entregado
                    </span>
                  ) : (
                    <span className="text-red-600 pl-1">
                      <StopOutlined /> Cancelado
                    </span>
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
        visible={notificationVisible}
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

export default PedidosLavanderia;
