import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import Swal from 'sweetalert2'
import ReactPaginate from "react-paginate";
import { useAuth } from "../../hooks/auth/auth";
import { useNavigate } from "react-router-dom";
import { orderTicket } from '../Ticket/Tickets'
import api from "../../api/api";

function EntregaLavanderia() {

  const navigate = useNavigate()
  const { cookies } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [cobroInfo, setCobroInfo] = useState({
    metodoPago: "cash",
    fechaPago: moment(),
  });

  const [entregando, setEntregando] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/ordersLaundry"); // Assuming your API endpoint is /orders
        const ordersData = response.data;

        setPedidos(ordersData);
        setFilteredPedidos(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
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
    if (!localStorage.getItem('cashCutId')) {
      Swal.fire({
        icon: "warning",
        title: "No haz inicializado caja!",
        text: 'Da click en Iniciar Caja.',
        confirmButtonColor: '#034078'
      });
      navigate('/inicioCaja')
      return
    }
    console.log("Pedido seleccionado para cobrar:", pedido);
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

  const handleGuardarCobro = async (pedido) => {
    const fechaEntrega = moment(cobroInfo.fechaPago)
      .add(3, "days")
      .format("DD/MM/YYYY")

    const updatedPedido = {
      ...pedido,
      payStatus: "paid",
      metodoPago: cobroInfo.metodoPago,
      f_recepcion: cobroInfo.fechaPago.format("DD/MM/YYYY"),
      fentregaEstimada: fechaEntrega,
    };

    console.log("Pedido actualizado:", updatedPedido);

    const updatedFilteredPedidos = filteredPedidos.map((p) =>
      p.id_order === updatedPedido.id_order ? updatedPedido : p
    );
    setFilteredPedidos(updatedFilteredPedidos);

    setVisible(false);

    try {
      await api.post('/paymentsDelivery', {
        payment: {
          fk_idOrder: pedido.id_order,
          payMethod: cobroInfo.metodoPago,
          payDate: cobroInfo.fechaPago.toISOString().split("T")[0] + 'T00:00:00.000Z',
          payTime: "1970-01-01T" + cobroInfo.fechaPago.toISOString().split("T")[1],
          fk_cashCut: parseInt(localStorage.getItem('cashCutId')),
          payTotal: pedido.totalPrice
        },
        deliveryDetail: {
          fk_userCashier: cookies.token,
          deliveryDate: cobroInfo.fechaPago.toISOString().split("T")[0] + 'T00:00:00.000Z',
          deliveryTime: "1970-01-01T" + cobroInfo.fechaPago.toISOString().split("T")[1],
          fk_idOrder: pedido.id_order
        }
      })
      ///////////////////////////// TICKET //////////////////////////////////
      const cart = []
      cart.push({
        description: 'FALTA TRAER BACK',
        id_service: pedido.ServiceOrderDetail[0].fk_Service,
        totalPrice: pedido.ServiceOrderDetail[0].subtotal,
        quantity: pedido.ServiceOrderDetail[0].units
      })
      const order = {
        id_order: pedido.id_order,
        payForm: pedido.payForm,
        payStatus: 'paid',
        payMethod: cobroInfo.metodoPago,
        subtotal: pedido.totalPrice,
        casher: pedido.user.name,
        client: pedido.client.name,
        scheduledDeliveryDate: pedido.scheduledDeliveryDate,
        scheduledDeliveryTime: pedido.scheduledDeliveryTime,
        notes: '',
        cart: cart
      }
      orderTicket(order)
      const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
        return order.id_order !== pedido.id_order;
      })
      setFilteredPedidos(updatedFilteredPedidos);
    } catch (err) {
      console.log(err)
    }

    const doc = new jsPDF();
    doc.text(`Detalles del Pedido`, 10, 10);
    doc.text(`Cliente: ${updatedPedido.client.name}`, 10, 20);
    doc.text(
      `Pedido: ${pedido.ServiceOrderDetail.find(
        (service) => service.id_serviceOrderDetail
      ) != undefined
        ? pedido.ServiceOrderDetail.length
        : 0
      }`,
      10,
      30
    );
    doc.text(`Estatus: Adeudo`, 10, 40);
    doc.text(
      `Método de Pago: ${pedido.payment
        ? pedido.payment.payMethod === "cash"
          ? "Efectivo"
          : "Tarjeta"
        : "N/A"
      }`,
      10,
      50
    );
    doc.text(
      `Fecha de Pago: ${formatDateToGMTMinus6(pedido.receptionTime)}`,
      10,
      60
    );
    doc.text(`Adeudo: $${updatedPedido.totalPrice}`, 10, 70);
    doc.save(`pedido_${updatedPedido.id_order}.pdf`);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedPedido(null);
  };

  const handleEntregar = async (pedido) => {
    if (!localStorage.getItem('cashCutId')) {
      Swal.fire({
        icon: "warning",
        title: "No haz inicializado caja!",
        text: 'Da click en Iniciar Caja.',
        confirmButtonColor: '#034078'
      });
      navigate('/inicioCaja')
      return
    }

    if (pedido.payStatus === "paid") {
      setSelectedPedido(pedido);

      try {
        await api.post('/deliveryDetails', {
          fk_idOrder: pedido.id_order,
          fk_idPayment: pedido.payment.id_payment,
          fk_userCashier: cookies.token,
          deliveryDate: cobroInfo.fechaPago.toISOString().split("T")[0] + 'T00:00:00.000Z',
          deliveryTime: "1970-01-01T" + cobroInfo.fechaPago.toISOString().split("T")[1],
        })
        // PIENSO ENVIAR EL TICKET PDF AL CLIENTE
        const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
          return order.id_order !== pedido.id_order;
        })
        setFilteredPedidos(updatedFilteredPedidos);
      } catch (err) {
        console.log(err)
      }

      setEntregando(true);
      console.log(pedido);
      setTimeout(() => {
        setEntregando(false);
        const doc = new jsPDF();
        doc.text(`Detalles del Pedido`, 10, 10);
        doc.text(`Cliente: ${pedido.client.name}`, 10, 20);
        doc.text(
          `Pedido: ${pedido.ServiceOrderDetail.find(
            (service) => service.id_serviceOrderDetail
          ) != undefined
            ? pedido.ServiceOrderDetail.length
            : 0
          }`,
          10,
          30
        );
        doc.text(`Estatus: Entregado`, 10, 40);
        doc.text(
          `Método de Pago: ${pedido.payment
            ? pedido.payment.payMethod === "cash"
              ? "Efectivo"
              : "Tarjeta"
            : "N/A"
          }`,
          10,
          50
        );
        doc.text(
          `Fecha de Pago: ${formatDateToGMTMinus6(pedido.receptionTime)}`,
          10,
          60
        );
        doc.text(`Total: $${pedido.totalPrice}`, 10, 70);
        doc.save(`pedido_${pedido.id_order}.pdf`);
      }, 1500);
    }
  };

  const formatDateToGMTMinus6 = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() - 6);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
            className="input-search"
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
              <th className="">No. Folio</th>
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
              .filter((pedido) => pedido.orderStatus === "finished")
              .slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              )
              .map((pedido) => (
                <tr className="bg-white border-b" key={pedido.id_order}>
                  <td className="py-3 px-1 text-center">{pedido.id_order}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.client.name}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user.name}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.ServiceOrderDetail.find(
                      (service) => service.id_serviceOrderDetail
                    ) != undefined
                      ? pedido.ServiceOrderDetail.length
                      : 0}
                  </td>
                  <td className="py-3 px-6">
                    {formatDateToGMTMinus6(pedido.receptionTime)}
                  </td>
                  <td
                    className={`py-3 px-6 ${pedido.payStatus === "unpaid"
                      ? "text-red-600"
                      : "text-green-600"
                      }`}
                  >
                    {pedido.payStatus === "unpaid" ? (
                      <span className="text-red-600 pl-1">
                        <ExclamationCircleOutlined /> Adeudo $
                        {pedido.totalPrice}
                      </span>
                    ) : (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Pagado ${pedido.totalPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {formatDateToGMTMinus6(pedido.scheduledDeliveryDate)}
                  </td>
                  <td>
                    {pedido.payStatus === "paid" ? (
                      <button
                        onClick={() => handleEntregar(pedido)}
                        className="btn-delivery"
                      >
                        Entregar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCobrar(pedido)}
                        className="btn-payment"
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
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredPedidos
            .filter((pedido) => pedido.orderStatus === "finished").length / itemsPerPage)}
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
      {selectedPedido && entregando && selectedPedido.payStatus === "paid" && (
        <Modal
          title="Pedido Entregado"
          open={entregando}
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
        open={visible}
        onOk={() => handleGuardarCobro(selectedPedido)}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="guardarCobro"
            onClick={() => handleGuardarCobro(selectedPedido)}
            className="btn-print text-white"
          >
            Guardar Cobro
          </Button>,
          <Button
            key="cerrar"
            onClick={handleClose}
            className="btn-cancel-modal text-white"
          >
            Cerrar
          </Button>,
        ]}
      >
        {selectedPedido?.payStatus === "unpaid" && (
          <div>
            <p className="text-lg font-semibold">Detalles del Pedido</p>
            <p>
              <strong>Cliente:</strong> {selectedPedido?.client.name}
            </p>
            <p>
              <strong>Pedido:</strong> {selectedPedido.id_order}
            </p>
            <p>
              <strong>Estatus:</strong> Adeudo - <strong>Monto:</strong> $
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
                <option value="cash">Efectivo</option>
                <option value="credit">Tarjeta</option>
              </select>
            </div>
          </div>
        )}
        <div className="text-center">
          {selectedPedido?.payStatus === "unpaid" ? (
            <ExclamationCircleOutlined
              style={{ fontSize: "64px", color: "red" }}
            />
          ) : (
            <CheckCircleOutlined style={{ fontSize: "64px", color: "green" }} />
          )}
          {selectedPedido?.payStatus === "paid" && (
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
