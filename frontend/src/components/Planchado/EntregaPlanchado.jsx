import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";

function EntregaPlanchado() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [cobroInfo, setCobroInfo] = useState({
    metodoPago: "",
    fechaPago: moment().format("YYYY-MM-DD"),
  });

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
        fentregaEstimada: "2023-09-15",
        f_recepcion: "2023-09-12",
        empleadoRecibe: "Saul",
        metodoPago: "Tarjeta",
      },
      {
        id_pedido: 2,
        user: "Maria",
        cliente: "Axel",
        id_cobro: 2,
        pedidoDetalle: "Monas Chinas Planchadas",
        orderstatus: "Adeudo",
        totalPrice: 150,
        fentregaEstimada: "2023-09-16",
        f_recepcion: "2023-09-13",
        empleadoRecibe: "Maria",
        metodoPago: "Efectivo",
      },
      {
        id_pedido: 3,
        user: "Luis",
        cliente: "Carlos",
        id_cobro: 3,
        pedidoDetalle: "Planchado basico",
        orderstatus: "Adeudo",
        totalPrice: 80,
        fentregaEstimada: "2023-09-17",
        f_recepcion: "2023-09-14",
        empleadoRecibe: "Luis",
        metodoPago: "Tarjeta",
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

  const handleCobroInfoChange = (event) => {
    const { name, value } = event.target;
    setCobroInfo({
      ...cobroInfo,
      [name]: value,
    });
  };

  const handleGuardarCobro = (pedido) => {
    const fechaEntrega = moment(cobroInfo.fechaPago)
      .add(3, "days")
      .format("YYYY-MM-DD");

    const updatedPedido = {
      ...pedido,
      orderstatus: "Pagado",
      metodoPago: cobroInfo.metodoPago,
      f_recepcion: cobroInfo.fechaPago,
      fentregaEstimada: fechaEntrega,
    };

    const updatedFilteredPedidos = filteredPedidos.map((p) =>
      p.id_pedido === updatedPedido.id_pedido ? updatedPedido : p
    );
    setFilteredPedidos(updatedFilteredPedidos);

    setVisible(false);

    const doc = new jsPDF();
    doc.text(`Detalles del Pedido`, 10, 10);
    doc.text(`Cliente: ${updatedPedido.cliente}`, 10, 20);
    doc.text(`Pedido: ${updatedPedido.pedidoDetalle}`, 10, 30);
    doc.text(`Estatus: Adeudo`, 10, 40);
    doc.text(`Método de Pago: ${updatedPedido.metodoPago}`, 10, 50);
    doc.text(
      `Fecha de Pago: ${moment(updatedPedido.f_recepcion).format(
        "DD/MM/YYYY"
      )}`,
      10,
      60
    );
    doc.text(`Adeudo: $${updatedPedido.totalPrice}`, 10, 70);
    doc.save(`pedido_${updatedPedido.id_pedido}.pdf`);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedPedido(null);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Entregas Lavanderia</strong>
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
              <th className="py-3 px-6">Empleado que Recibe</th>{" "}
              {/* Cambio de título */}
              <th className="py-3 px-6">Detalle del pedido</th>
              <th className="py-3 px-6">Fecha de Recepción</th>
              <th className="py-3 px-6">Estatus</th>
              <th className="py-3 px-6">Fecha de Entrega Estimada</th>{" "}
              {/* Cambio de título */}
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido) => (
              <tr className="bg-white border-b" key={pedido.id_pedido}>
                <td className="py-3 px-1 text-center">{pedido.id_pedido}</td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.cliente}
                </td>
                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.empleadoRecibe} {/* Cambio de campo */}
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
                      <CheckCircleOutlined /> Pagado ${pedido.totalPrice}
                    </span>
                  )}
                </td>
                <td className="py-3 px-6">{pedido.fentregaEstimada}</td>{" "}
                {/* Cambio de campo */}
                <td>
                  {pedido.orderstatus === "Pagado" ? (
                    <button
                      onClick={() => handleCobrar(pedido)}
                      className="bg-green-500 text-white p-2 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
                    >
                      Guardar Pedido
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCobrar(pedido)}
                      className="bg-blue-500 text-white p-2 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
                    >
                      Cobrar
                    </button>
                  )}
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
        onOk={() => handleGuardarCobro(selectedPedido)}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="guardarCobro"
            onClick={() => handleGuardarCobro(selectedPedido)}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Guardar Cobro
          </Button>,
          <Button
            key="cerrar"
            onClick={handleClose}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Cerrar
          </Button>,
        ]}
      >
        {selectedPedido?.orderstatus === "Adeudo" && (
          <div>
            <p className="text-lg font-semibold">Detalles del Pedido</p>
            <p>
              <strong>Cliente:</strong> {selectedPedido?.cliente}
            </p>
            <p>
              <strong>Pedido:</strong> {selectedPedido?.pedidoDetalle}
            </p>
            <p>
              <strong>Estatus:</strong> Adeudo - <strong>Adeudo:</strong> $
              {selectedPedido?.totalPrice}
            </p>
            <div className="mb-2">
              <strong>Método de Pago:</strong>{" "}
              <select
                name="metodoPago"
                value={cobroInfo.metodoPago}
                onChange={handleCobroInfoChange}
                className="bg-gray-200 rounded-md p-1"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
            <div>
              <strong>Fecha de Pago:</strong>{" "}
              <input
                type="date"
                name="fechaPago"
                value={cobroInfo.fechaPago}
                onChange={handleCobroInfoChange}
                className="bg-gray-200 rounded-md p-1"
              />
            </div>
          </div>
        )}
        <div className="text-center">
          {selectedPedido?.orderstatus === "Adeudo" ? (
            <ExclamationCircleOutlined
              style={{ fontSize: "64px", color: "red" }}
            />
          ) : (
            <CheckCircleOutlined style={{ fontSize: "64px", color: "green" }} />
          )}
          {selectedPedido?.orderstatus === "Pagado" && (
            <p className="text-green-600 font-bold text-lg mt-2">
              Pago Confirmado...
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default EntregaPlanchado;
