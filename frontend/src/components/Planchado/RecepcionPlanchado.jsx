import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";

const generatePdfTicket = (pedido) => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Detalles del Pedido", 10, 10);
  
    doc.setFontSize(12);
    doc.text(`Cliente: ${pedido.cliente}`, 20, 20);
    doc.text(`Empleado: ${pedido.user}`, 20, 30);
    doc.text(`Pedido: ${pedido.pedidoDetalle}`, 20, 40);
    doc.text(`Estatus: ${pedido.orderstatus === "Pagado" ? "Pagado" : "Adeudo"}`, 20, 50);
  
    if (pedido.orderstatus === "Pagado") {
      doc.text(`Total Pagado: $${pedido.totalPrice}`, 20, 60);
    } else {
      doc.text(`Adeudo: $${pedido.totalPrice}`, 20, 60);
    }
  
    doc.save("pedido_ticket.pdf");
  };

function RecepcionPlanchado() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const dummyPedidos = [
      {
        id_pedido: 4,
        user: "Ana",
        cliente: "Pedro",
        id_cobro: 4,
        pedidoDetalle: "Planchado de sábanas",
        orderstatus: "A la entrega",
        totalPrice: 120,
        forma_pago: "Efectivo",
        f_recepcion: "2023-09-18",
      },
      {
        id_pedido: 2,
        user: "Maria",
        cliente: "Axel",
        id_cobro: 2,
        pedidoDetalle: "Monas Chinas planchadas",
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
  }, []);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleRecepcion = (pedido) => {
    generatePdfTicket(pedido);
  };


  return (
    <div>
      <div className="mb-3">
        <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <strong>Recepción de Planchado</strong>
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
              <th className="py-3 px-6">Estatus</th>
              <th className="py-3 px-6">Forma de Pago</th>
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
                  <td className="py-3 px-6">{pedido.forma_pago}</td>
                  <td>
                    <button
                      onClick={() => handleRecepcion(pedido)}
                      className="bg-blue-500 text-white p-2 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
                    >
                      Recepción
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <Link
          to="/menuPuntoVenta"
          className="mt-4 flex text-center text-decoration-none"
        >
          <button className="bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm">
            <div className="text-lg font-semibold">Volver</div>
          </button>
        </Link>
        </table>
      </div>
    </div>
  );
}

export default RecepcionPlanchado;
