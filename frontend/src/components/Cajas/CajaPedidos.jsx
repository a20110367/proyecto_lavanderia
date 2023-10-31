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
} from "@ant-design/icons";

function CajaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  

  useEffect(() => {
    const dummyPedidos = [
        {
            id_pedido: 1,
            cliente: "Saul Rodriguez",
            pedidoDetalle: "Lavado de patas",
            orderstatus: "Pendiente",
            fecha_entrega_real: "2023-09-15",
            forma_pago: "A la entrega",
            metodo_pago: "Efectivo",
            monto: 50.00,
          },
          {
            id_pedido: 2,
            cliente: "Maria Fernandez",
            pedidoDetalle: "Monas Chinas Planchadas",
            orderstatus: "En proceso",
            fecha_entrega_real: "2023-09-16",
            forma_pago: "Anticipado",
            metodo_pago: "Tarjeta de crédito",
            monto: 75.00,
          },
          {
            id_pedido: 3,
            cliente: "Luis Robledo",
            pedidoDetalle: "Lavado",
            orderstatus: "Finalizado",
            fecha_entrega_real: "2023-09-17",
            forma_pago: "A la entrega",
            metodo_pago: "Efectivo",
            monto: 30.00,
          },
          {
            id_pedido: 4,
            cliente: "Axel Vergara",
            pedidoDetalle: "Planchado Basico",
            orderstatus: "Entregado",
            fecha_entrega_real: "2023-09-18",
            forma_pago: "Anticipado",
            metodo_pago: "Tarjeta de débito",
            monto: 60.00,
          },
          {
            id_pedido: 5,
            cliente: "Ximena Marquez",
            pedidoDetalle: "Lavado basico",
            orderstatus: "CANCELADO",
            fecha_entrega_real: "2023-09-18",
            forma_pago: "A la entrega",
            metodo_pago: "Efectivo",
            monto: 20.00,
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
              className="border-2 rounded-md py-2 px-4 pl-10 text-gray-600 focus:outline-none focus:ring focus:border-blue-300 border-black"
              value={filtro}
              onChange={handleFiltroChange}
            />
            <div className="absolute top-2.5 left-1 text-gray-400">
              <HiOutlineSearch fontSize={20} className="text-gray-400" />
            </div>
          </div>
          <select
            className="ml-2 border-2 font-bold text-base rounded-md py-2 px-4 text-black focus:outline-none focus:ring focus:border-blue-300 border-black"
            value={filtroEstatus}
            onChange={handleFiltroEstatusChange}
          >
            <option className="text-base font-semibold" value="">
              Todos
            </option>
            <option value="Pendiente" className="text-gray-600 font-semibold text-base">
              Pendientes
            </option>
            <option value="En proceso" className="text-yellow-600 font-semibold text-base">
              En Proceso
            </option>
            <option value="Finalizado" className="text-blue-600 font-semibold text-base">
              Finalizados
            </option>
            <option value="Entregado" className="text-green-600 font-semibold text-base">
              Entregados
            </option>
          </select>
        </div>
        <div className="mt-4" style={{ overflowX: 'auto' }}>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th >ID Pedido</th>
              <th >Cliente</th>
              <th >Detalle del Pedido</th>
              <th >Estatus</th>
              <th >Forma de Pago</th>
              <th >Método de Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
          {filteredPedidos
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((pedido) => (
              <tr className="bg-white border-b" key={pedido.id_pedido}>
                <td className="py-3 px-1 text-center">{pedido.id_pedido}</td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.cliente}
                </td>
                <td className="py-3 px-6">{pedido.pedidoDetalle}</td>
                <td className="py-3 px-6">
                  {pedido.orderstatus === "Pendiente" ? (
                    <span className="text-gray-600 pl-1">
                      <MinusCircleOutlined /> Pendiente
                    </span>
                  ) : pedido.orderstatus === "En proceso" ? (
                    <span className="text-yellow-600 pl-1">
                      <ClockCircleOutlined /> En Proceso
                    </span>
                  ) : pedido.orderstatus === "Finalizado" ? (
                    <span className="text-blue-600 pl-1">
                      <IssuesCloseOutlined /> Finalizado no entregado
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
                <td className="py-3 px-6">{pedido.forma_pago}</td>
                <td className="py-3 px-6">{pedido.metodo_pago}</td>
                <td className="py-3 px-6">${pedido.monto.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>        
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
    <div className="flex justify-center mt-4 mb-4">
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
    </div>
  );
}

export default CajaPedidos;
