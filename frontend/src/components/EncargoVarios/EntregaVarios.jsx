import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button } from "antd";
import { formatDate } from "../../utils/format";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import moment from "moment";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../hooks/auth/auth";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function EntregaVarios() {
  const navigate = useNavigate();
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
  const [amount, setAmount] = useState(0.0);

  const [entregando, setEntregando] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/ordersOtherService");
    return response.data;
  };

  const { data } = useSWR("ordersOtherService", fetcher);

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    filterPedidos(event.target.value);
  };

  const filterPedidos = (filterText) => {
    const filtered = pedidos.filter((pedido) => {
      const searchTerm = filtro.toLowerCase();
      const searchTermsArray = searchTerm.split(" ");

      const isMatch = searchTermsArray.every((term) =>
        [pedido.client.name, pedido.client.firstLN, pedido.client.secondLN]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
      return (
        isMatch ||
        (pedido.user &&
          pedido.user.name &&
          pedido.user.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (pedido.id_order && pedido.id_order.toString().includes(filterText))
      );
    });
    setFilteredPedidos(filtered);
    setCurrentPage(0);
  };

  const calculateTotalCredit = () => {
    let pivot = 0.0
    selectedPedido.ServiceOrderDetail.forEach(item =>
      pivot = parseFloat(pivot + (item.OtherService.priceCredit * item.units)))
    // console.log(pivot)
    // pivot += 0.1;
    setAmount(pivot)
  };

  const calculateTotal = () => {
    let pivot = 0
    selectedPedido.ServiceOrderDetail.forEach(item =>
      pivot = parseFloat(pivot + (item.OtherService.price * item.units)))
    // console.log(pivot)
    // pivot += 0.1;
    setAmount(pivot)
  };

  const calculateSubtotal = (service) => {
    console.log(cobroInfo.metodoPago === 'credit' ? service.OtherService.priceCredit * service.units : service.OtherService.price * service.units)
    return cobroInfo.metodoPago === 'credit' ? service.OtherService.priceCredit * service.units : service.OtherService.price * service.units
  };

  const handleCobrar = (pedido) => {
    if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }
    console.log("Pedido seleccionado para cobrar:", pedido);
    setSelectedPedido(pedido);
    setAmount(pedido.totalPrice)
    setCobroInfo({
      metodoPago: "cash",
      fechaPago: moment(),
    });
    setVisible(true);
  };

  const handleCobroInfoChange = (event) => {
    const { name, value } = event.target;
    setCobroInfo({
      ...cobroInfo,
      [name]: value,
    });
    value === 'credit' ? calculateTotalCredit() : calculateTotal()

  };

  const handleGuardarCobro = async (pedido) => {
    const fechaEntrega = moment(cobroInfo.fechaPago)
      .add(3, "days")
      .format("DD/MM/YYYY");

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
      await api.post("/paymentsDelivery", {
        payment: {
          fk_idOrder: pedido.id_order,
          payMethod: cobroInfo.metodoPago,
          payDate: cobroInfo.fechaPago.toISOString(),
          payTime: cobroInfo.fechaPago.toISOString(),
          fk_cashCut: parseInt(localStorage.getItem("cashCutId")),
          payTotal: amount,
        },
        deliveryDetail: {
          fk_userCashier: cookies.token,
          deliveryDate: cobroInfo.fechaPago.toISOString(),
          deliveryTime: cobroInfo.fechaPago.toISOString(),
          fk_idOrder: pedido.id_order,
        },
      });
      ///////////////////////////// TICKET //////////////////////////////////
      const cart = [];
      pedido.ServiceOrderDetail.forEach(service => {
        cart.push({
          description: service.OtherService.description
            ? service.OtherService.description
            : "ERROR",
          price: service.OtherService.price,
          priceCredit: service.OtherService.priceCredit,
          totalPrice: calculateSubtotal(service),
          quantity: service.units,
        });
      });

      const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
        return order.id_order !== pedido.id_order;
      });
      setFilteredPedidos(updatedFilteredPedidos);

      const order = {
        id_order: pedido.id_order,
        payForm: pedido.payForm,
        payStatus: "paid",
        payMethod: cobroInfo.metodoPago,
        subtotal: amount,
        casher: pedido.user.name,
        client: pedido.client.name + ' ' + pedido.client.firstLN + ' ' + pedido.client.secondLN,
        receptionDate: pedido.receptionDate,
        receptionTime: pedido.receptionTime,
        scheduledDeliveryDate: pedido.scheduledDeliveryDate,
        scheduledDeliveryTime: pedido.scheduledDeliveryTime,
        pieces: 0,
        serviceType: 'varios',
        notes: pedido.notes,
        cart: cart,
      };
      // GENERAR EL TICKET
      await api.post('/generateTicket', {
        order: order,
      })
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedPedido(null);
  };

  const handleEntregar = async (pedido) => {
    if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }

    if (pedido.payStatus === "paid") {
      setSelectedPedido(pedido);

      try {
        await api.post("/deliveryDetails", {
          fk_idOrder: pedido.id_order,
          fk_idPayment: pedido.payment.id_payment,
          fk_userCashier: cookies.token,
          deliveryDate: cobroInfo.fechaPago.toISOString(),
          deliveryTime: cobroInfo.fechaPago.toISOString(),
        });
        // PIENSO ENVIAR EL TICKET PDF AL CLIENTE
        const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
          return order.id_order !== pedido.id_order;
        });
        setFilteredPedidos(updatedFilteredPedidos);
      } catch (err) {
        console.log(err);
      }

      setEntregando(true);
      console.log(pedido);
      setTimeout(() => {
        setEntregando(false);
      }, 1500);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Entregas Encargos Varios</strong>
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
              <th className="">Cliente</th>
              <th className="">Recibió</th>
              <th className="">Detalles</th>
              <th className="">
                Fecha <br />
                de Recepción
              </th>
              <th className="">Estatus</th>
              <th className="">
                Entrega <br /> Estimada
              </th>
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
                  <td className="th2 font-medium text-gray-900">
                    {pedido.client.name} {pedido.client.firstLN} {pedido.client.secondLN}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user.name} {pedido.user.firstLN} {pedido.user.secondLN}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.category.categoryDescription === "varios"
                      ? "Varios"
                      : pedido.category.categoryDescription}
                  </td>
                  <td className="py-3 px-6">
                    {formatDate(pedido.receptionDate)}
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
                    {formatDate(pedido.scheduledDeliveryDate)}
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
          pageCount={Math.ceil(
            filteredPedidos.filter(
              (pedido) => pedido.orderStatus === "finished"
            ).length / itemsPerPage
          )}
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
              {amount}
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

export default EntregaVarios;
