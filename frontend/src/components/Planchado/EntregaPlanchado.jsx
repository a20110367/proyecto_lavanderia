import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";


function EntregaPlanchado() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);

  useEffect(() => {
    const dummyPedidos = [
      {
        id_pedido: 1,
        user: "Saul",
        cliente: "Juan",
        id_cobro: 1,
        pedidoDetalle: "Planchado de patas",
        orderstatus: "Pagado",
        totalPrice: 100,
        forma_pago: "Tarjeta",
        fentrega: "2023-09-15",
        f_recepcion: "2023-09-12",
      },
      {
        id_pedido: 2,
        user: "Maria",
        cliente: "Axel",
        id_cobro: 2,
        pedidoDetalle: "Monas Chinas Planchadas",
        orderstatus: "Adeudo",
        totalPrice: 150,
        forma_pago: "Efectivo",
        fentrega: "2023-09-16",
        f_recepcion: "2023-09-13",
      },
      {
        id_pedido: 3,
        user: "Luis",
        cliente: "Carlos",
        id_cobro: 3,
        pedidoDetalle: "Planchado",
        orderstatus: "Adeudo",
        totalPrice: 80,
        forma_pago: "Efectivo",
        fentrega: "2023-09-17",
        f_recepcion: "2023-09-14",
      },
    ];

    setPedidos(dummyPedidos);
    setFilteredPedidos(dummyPedidos);
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    filterPedidos(event.target.value);
  };

  const filterPedidos = (filterText) => {
    const filtered = pedidos.filter((pedido) => {
      return (
        pedido.cliente.toLowerCase().includes(filterText.toLowerCase()) ||
        pedido.user.toLowerCase().includes(filterText.toLowerCase()) ||
        pedido.id_pedido.toString().includes(filterText)
      );
    });
    setFilteredPedidos(filtered);
  };

  const handleCobrar = (pedido) => {
    setSelectedPedido(pedido);
    setVisible(true);
  };

  const handleEntregar = () => {
    if (selectedPedido && selectedPedido.orderstatus === "Pagado") {
      const updatedFilteredPedidos = filteredPedidos.filter(
        (pedido) => pedido.id_pedido !== selectedPedido.id_pedido
      );
      setFilteredPedidos(updatedFilteredPedidos);
    }

    setVisible(false);
    
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedPedido(null);
  };

  const handleEliminarPedido = () => {
    // Remove the selectedPedido from both pedidos and filteredPedidos
    const updatedPedidos = pedidos.filter(
      (pedido) => pedido.id_pedido !== selectedPedido.id_pedido
    );
    setPedidos(updatedPedidos);
    setFilteredPedidos(updatedPedidos);
    setVisible(false);
  };


  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Entregas Planchado</strong>
        </div>
      </div>
      <div className="bg-neutral-600 rounded-md min-h-screen p-4">
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
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="py-3 px-1 text-center">ID</th>
              <th className="py-3 px-6">Nombre del Cliente</th>
              <th className="py-3 px-6">Nombre del Empleado</th>
              <th className="py-3 px-6">Detalle del pedido</th>
              <th className="py-3 px-6">Fecha de Recepción</th>
              <th className="py-3 px-6">Estatus</th>
              <th className="py-3 px-6">Forma de Pago</th>
              <th className="py-3 px-6">Fecha de Entrega</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos
              .filter((pedido) => {
                return (
                  pedido.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
                  pedido.user.toLowerCase().includes(filtro.toLowerCase()) ||
                  pedido.id_pedido.toString().includes(filtro)
                );
              })
              .map((pedido) => (
                <tr className="bg-white border-b" key={pedido.id_pedido}>
                  <td className="py-3 px-1 text-center">{pedido.id_pedido}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.cliente}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user}
                  </td>
                  <td className="py-3 px-6">{pedido.pedidoDetalle}</td>
                  <td className="py-3 px-6">{pedido.f_recepcion}</td>
                  <td
                    className={`py-3 px-6 ${
                      pedido.orderstatus === "Adeudo"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {pedido.orderstatus === "Adeudo" ? (
                      <span className="text-red-600 pl-1">
                        <ExclamationCircleOutlined /> Adeudo ${pedido.totalPrice}{" "}
                      </span>
                    ) : (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Pagado  ${pedido.totalPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6">{pedido.forma_pago}</td>
                  <td className="py-3 px-6">{pedido.fentrega}</td>
                  <td>
                    <button
                      onClick={() => handleCobrar(pedido)}
                      className="bg-blue-500 text-white p-2 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
                    >
                      Cobrar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Link
          to="/menuPuntoVenta"
          className="mt-4 flex text-center text-decoration-none"
        >
          <button className="bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm">
            <div className="text-lg font-semibold">Volver</div>
          </button>
        </Link>
      </div>
      <Modal
        title="Detalles del Pedido"
        visible={visible}
        onOk={handleEntregar}
        onCancel={handleClose}
        width={600}
        footer={[
          selectedPedido?.orderstatus === "Adeudo" ? (
            <Button
              key="cobrarEntregar"
              onClick={handleEntregar}
              className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
            >
              Realizar Cobro y Entregar
            </Button>
          ) : null,
          selectedPedido?.orderstatus === "Pagado" ? (
            <Button
              key="eliminarPedido"
              onClick={handleEliminarPedido}
              className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
            >
              Eliminar Pedido
            </Button>
          ) : null,
          <Button
            key="cerrar"
            onClick={handleClose}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Cerrar
          </Button>,
        ]}
      >
        <div className="text-center">
          {selectedPedido?.orderstatus === "Adeudo" ? (
            <ExclamationCircleOutlined
              style={{ fontSize: "64px", color: "red" }}
            />
          ) : (
            <CheckCircleOutlined
              style={{ fontSize: "64px", color: "green" }}
            />
          )}
        </div>
        <p>
          <strong>Cliente:</strong> {selectedPedido?.cliente}
        </p>
        <p>
          <strong>Pedido:</strong> {selectedPedido?.pedidoDetalle}
        </p>
        <p>
          <strong>Estatus:</strong>{" "}
          {selectedPedido?.orderstatus === "Pagado" ? "Pagado" : "Adeudo"}
        </p>
        {selectedPedido?.orderstatus === "Pagado" && (
          <p>
            <strong>Total Pagado:</strong> ${selectedPedido?.totalPrice}
          </p>
        )}
        {selectedPedido?.orderstatus === "Adeudo" && (
          <p>
            <strong>Adeudo:</strong> ${selectedPedido?.totalPrice}
          </p>
        )}
      </Modal>
    </div>
  );
}

export default EntregaPlanchado;
