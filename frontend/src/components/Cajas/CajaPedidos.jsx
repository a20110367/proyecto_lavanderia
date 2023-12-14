import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import api from "../../api/api";
import useSWR from "swr";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

function CajaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
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
        return pedido.orderStatus.toLowerCase() === filtroEstatus.toLowerCase();
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      return (
        pedido.client.name.toLowerCase().includes(filtro.toLowerCase()) ||
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

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Lista de Pedidos</strong>
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
        </select>
      </div>
      <div className="mt-4" style={{ overflowX: "auto" }}>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th>No. Folio</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Estatus</th>
              <th>Forma de <br />Pago</th>
              <th>Método de Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos
              .slice()
              .reverse()
              .filter(
                (pedido) =>
                  pedido.orderStatus === "finished" ||
                  pedido.orderStatus === "delivered"
              )
              .slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              )
              .map((pedido) => (
                <tr className="bg-white border-b" key={pedido.id_order}>
                  <td className="py-3 px-1 text-center">{pedido.id_order}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user.name}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.category
                      ? pedido.category.categoryDescription === "autoservicio"
                        ? "Autoservicio"
                        : pedido.category.categoryDescription === "planchado"
                        ? "Planchado"
                        : pedido.category.categoryDescription === "encargo"
                        ? "Encargo Ropa"
                        : pedido.category.categoryDescription === "tintoreria"
                        ? "Tintoreria"
                        : pedido.category.categoryDescription === "varios"
                        ? "Encargo Varios"
                        : "Otro" // Si el texto no coincide con ninguna categoría específica
                      : "Categoría no definida"}
                  </td>
                  <td className="py-3 px-6 font-bold">
                    {pedido.orderStatus === "pending" ? (
                      <span className="text-gray-600 pl-1">
                        <MinusCircleOutlined /> Pendiente
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
                  <td className="py-3 px-6">
                    {pedido.payForm === "delivery" ? "Entrega" : "Anticipo"}
                  </td>
                  <td className="py-3 px-6">
                    {" "}
                    {pedido.payment
                      ? pedido.payment.payMethod === "cash"
                        ? "Efectivo"
                        : "Tarjeta"
                      : "N/A"}
                  </td>
                  <td className="py-3 px-6">${pedido.totalPrice}</td>
                </tr>
              ))}
          </tbody>
        </table>
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
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel="Anterior"
          nextLabel="Siguiente"
          breakLabel="..."
          pageCount={Math.ceil(
            filteredPedidos.filter(
              (pedido) =>
                pedido.orderStatus === "finished" ||
                pedido.orderStatus === "delivered"
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
    </div>
  );
}

export default CajaPedidos;
