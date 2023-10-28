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
import ReactPaginate from "react-paginate";

function EntregaLavanderia() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [cobroInfo, setCobroInfo] = useState({
    metodoPago: "",
    fechaPago: moment().format("YYYY-MM-DD"),
  });

  const [entregando, setEntregando] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const dummyPedidos = [
      {
        id_pedido: 1,
        user: "Saul",
        cliente: "Juan",
        id_cobro: 1,
        pedidoDetalle: "Lavado de patas",
        orderstatus: "Pagado",
        totalPrice: 100,
        fentregaEstimada: "15/09/2023",
        f_recepcion: "17/09/2023",
        empleadoRecibe: "Saul",
        metodoPago: "Tarjeta",
      },
      {
        id_pedido: 2,
        user: "Maria",
        cliente: "Axel",
        id_cobro: 2,
        pedidoDetalle: "Monas Chinas",
        orderstatus: "Adeudo",
        totalPrice: 150,
        fentregaEstimada: "16/09/2023",
        f_recepcion: "18/09/2023",
        empleadoRecibe: "Maria",
        metodoPago: "Efectivo",
      },
      {
        id_pedido: 3,
        user: "Luis",
        cliente: "Carlos",
        id_cobro: 3,
        pedidoDetalle: "Lavado",
        orderstatus: "Adeudo",
        totalPrice: 80,
        fentregaEstimada: "17/09/2023",
        f_recepcion: "19/09/2023",
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

  const handleEntregar = (pedido) => {
    if (pedido.orderstatus === "Pagado") {
      setSelectedPedido(pedido);

      setEntregando(true);

      setTimeout(() => {
        setEntregando(false);
        const doc = new jsPDF();
        doc.text(`Detalles del Pedido`, 10, 10);
        doc.text(`Cliente: ${pedido.cliente}`, 10, 20);
        doc.text(`Pedido: ${pedido.pedidoDetalle}`, 10, 30);
        doc.text(`Estatus: Entregado`, 10, 40);
        doc.text(`Método de Pago: ${pedido.metodoPago}`, 10, 50);
        doc.text(
          `Fecha de Pago: ${moment(pedido.f_recepcion).format("DD/MM/YYYY")}`,
          10,
          60
        );
        doc.text(`Total: $${pedido.totalPrice}`, 10, 70);
        doc.save(`pedido_${pedido.id_pedido}.pdf`);
      }, 1500);
    }
  };

  return (
    <div>
      <div className="mb-3">
      <div className="title-container">
          <strong className="title-strong">Entregas Lavanderia</strong>
        </div>
      </div>
        <div className="flex items-center mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="search-ipt"
              value={filtro}
              onChange={handleFiltroChange}
            />
            <div className="absolute top-2.5 left-3 text-gray-400">
              <HiOutlineSearch fontSize={20} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="">ID</th>
                <th className="">Nombre del Cliente</th>
                <th className="">Empleado que Recibe</th>
                <th className="">Detalle del pedido</th>
                <th className="">Fecha de Recepción</th>
                <th className="">Estatus</th>
                <th className="">Fecha de Entrega Estimada</th>
                <th className="">Acciones</th>
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
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.empleadoRecibe}
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
                        <ExclamationCircleOutlined /> Adeudo ${pedido.totalPrice}
                      </span>
                    ) : (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Pagado ${pedido.totalPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6">{pedido.fentregaEstimada}</td>
                  <td>
                    {pedido.orderstatus === "Pagado" ? (
                      <button
                        onClick={() => handleEntregar(pedido)}
                        className="bg-green-500 text-white p-2 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
                      >
                        Entregar
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
        </div>
        <div className="flex justify-center mt-4">
  <ReactPaginate
    previousLabel={"Anterior"}
    nextLabel={"Siguiente"}
    breakLabel={"..."}
    pageCount={Math.ceil(filteredPedidos.length / itemsPerPage)}
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
    onPageChange={handlePageChange}
    containerClassName={"pagination flex"}
    pageLinkClassName="bg-blue-500 text-white py-2 px-4 rounded-full mx-1 hover:bg-blue-600 hover:no-underline"
    previousLinkClassName="bg-blue-500 text-white py-2 px-4 rounded-full mx-1 hover:bg-blue-600 hover:no-underline"
    nextLinkClassName="bg-blue-500 text-white py-2 px-4 rounded-full mx-1 hover:bg-blue-600 hover:no-underline"
    breakLinkClassName="text-gray-600 py-2 px-4 rounded-full mx-1"
    activeLinkClassName="bg-blue-700 text-white py-2 px-4 rounded-full mx-1"
  />
</div>

      {selectedPedido && entregando && selectedPedido.orderstatus === "Pagado" && (
        <Modal
          title="Pedido Entregado"
          visible={entregando}
          closable={false}
          footer={null}
        >
          <div className="text-center">
            <CheckCircleOutlined style={{ fontSize: "64px", color: "green" }} />
            <p className="text-green-600 font-bold text-lg mt-2">
              Pedido Entregado...
            </p>
          </div>
        </Modal>
      )}

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
                readOnly
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

export default EntregaLavanderia;