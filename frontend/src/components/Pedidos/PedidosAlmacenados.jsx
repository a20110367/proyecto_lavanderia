import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "antd";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { orderTicket } from "../Ticket/Tickets";
import api from "../../api/api";
import jsPDF from "jspdf";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../hooks/auth/auth";

const PedidosAlmacenados = () => {
  const { cookies } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [nameClient, setNameClient] = useState("");
  const [firstNameClient, setFirstNameClient] = useState("");
  const [secondNameClient, setSecondNameClient] = useState("");
  const [id_order, setId_order] = useState("");
  const [searchType, setSearchType] = useState("client");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [entregando, setEntregando] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
    setSelectedPedido(null);
  };
  const [cobroInfo, setCobroInfo] = useState({
    metodoPago: "cash",
    fechaPago: moment(),
  });

  useEffect(() => {
    setNameClient("");
    setId_order("");
  }, [searchType]);

  const handleSearch = async () => {
    if (
      (searchType === "client" && !nameClient && !firstNameClient && !secondNameClient) ||
      (searchType === "id_order" && !id_order)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes rellenar el campo para buscar.",
        confirmButtonColor: "#034078",
      });
      return;
    }

    if (searchType === "client" && !isNaN(nameClient) && !isNaN(firstNameClient) && !isNaN(secondNameClient)) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: 'Para buscar por número de pedido, selecciona la opción "Número de pedido"',
        confirmButtonColor: "#034078",
      });
      return;
    }

    try {
      let results;

      if (searchType === "client") {
        const res = await api.post("/storedOrdersByClientName", { //orderstored 
          clientName: nameClient,
          firstName: firstNameClient,
          secondNameClient: secondNameClient,
        });
        results = res.data ? res.data : [];
      } else if (searchType === "id_order") {
        const res = await api.get(`orders/ ${id_order}`);
        results = res.data ? [res.data] : []; // Verifica si existe data en la respuesta
      }

      if (results.length > 0) {
        setFilteredPedidos(results);
        setShowTable(true);
      } else {
        setShowTable(false);
        Swal.fire({
          icon: "info",
          title: "Lo sentimos",
          text: "No se encontraron coincidencias.",
          confirmButtonColor: "#034078",
        });
      }

      console.log("Resultados de búsqueda:", results);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error al buscar los pedidos.",
        confirmButtonColor: "#034078",
      });
    }
  };

  const handleReturn = () => {
    setShowTable(false);
    setSearchType("client");
    setNameClient("");
    setId_order("");
    setFilteredPedidos([]);
    setCurrentPage(0);
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
        const doc = new jsPDF();
        doc.text(`Detalles del Pedido`, 10, 10);
        doc.text(
          `Cliente: ${pedido.client.name} ${pedido.client.firstLN} ${pedido.client.secondLN}`,
          10,
          20
        );
        doc.text(
          `Pedido: ${
            pedido.ServiceOrderDetail.find(
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
          `Método de Pago: ${
            pedido.payment
              ? pedido.payment.payMethod === "cash"
                ? "Efectivo"
                : pedido.payment.payMethod === "credit"
                ? "Tarjeta"
                : "N/A"
              : "N/A"
          }`,
          10,
          50
        );
        doc.text(
          `Fecha de Pago: ${formatDate(pedido.scheduledDeliveryDate)}`,
          10,
          60
        );
        doc.text(`Total: $${pedido.totalPrice}`, 10, 70);
        doc.save(`pedido_${pedido.id_order}.pdf`);
      }, 1500);
    }
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
          payTotal: pedido.totalPrice,
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
      cart.push({
        description: pedido.ServiceOrderDetail[0].LaundryService
          ? pedido.ServiceOrderDetail[0].LaundryService.description
          : "ERROR",
        id_service: pedido.ServiceOrderDetail[0].fk_Service,
        totalPrice: pedido.ServiceOrderDetail[0].subtotal,
        quantity: pedido.ServiceOrderDetail[0].units,
      });

      let serviceType;
      pedido.fk_categoryId === 1
        ? (serviceType = "autoservicio")
        : pedido.fk_categoryId === 2
        ? (serviceType = "encargo")
        : pedido.fk_categoryId === 3
        ? (serviceType = "planchado")
        : pedido.fk_categoryId === 4
        ? (serviceType = "tintoneria")
        : pedido.fk_categoryId === 5
        ? (serviceType = "varios")
        : (serviceType = "ERROR");

      let payMethod;
      if (cobroInfo.metodoPago === "cash") {
        payMethod = "EFECTIVO";
      } else {
        payMethod = "TARJETA";
      }

      let pieces = 0
      if (pedido.fk_categoryId === 3) {
        pieces = pedido.ironPieces;
      } else if (pedido.fk_categoryId === 4) {
        pieces = pedido.drycleanPieces;
      }
  
      const order = {
        id_order: pedido.id_order,
        payForm: pedido.payForm,
        payStatus: "paid",
        payMethod: payMethod,
        subtotal: pedido.totalPrice,
        casher: pedido.user.name,
        client:
          pedido.client.name +
          " " +
          pedido.client.firstLN +
          " " +
          pedido.client.secondLN,
        receptionDate: pedido.receptionDate,
        receptionTime: pedido.receptionTime,
        scheduledDeliveryDate: pedido.scheduledDeliveryDate,
        scheduledDeliveryTime: pedido.scheduledDeliveryTime,
        pieces: pieces,
        serviceType: serviceType,
        notes: pedido.notes,
        cart: cart,
      };
      // GENERAR EL TICKET
      await api.post("/generateTicket", {
        order: order,
      });
      // const order = {
      //   id_order: pedido.id_order,
      //   payForm: pedido.payForm,
      //   payStatus: "paid",
      //   payMethod: cobroInfo.metodoPago,
      //   subtotal: pedido.totalPrice,
      //   casher: pedido.user.name,
      //   client: pedido.client.name,
      //   scheduledDeliveryDate: pedido.scheduledDeliveryDate,
      //   scheduledDeliveryTime: pedido.scheduledDeliveryTime,
      //   receptionDate: pedido.receptionDate,
      //   receptionTime: pedido.receptionTime,
      //   notes: pedido.notes,
      //   cart: cart,
      // };
      // orderTicket(order);
      const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
        return order.id_order !== pedido.id_order;
      });
      setFilteredPedidos(updatedFilteredPedidos);
    } catch (err) {
      console.log(err);
    }

    const doc = new jsPDF();
    doc.text(`Detalles del Pedido`, 10, 10);
    doc.text(
      `Cliente: ${updatedPedido.client.name} ${updatedPedido.client.firstLN} ${updatedPedido.client.secondLN}`,
      10,
      20
    );
    doc.text(
      `Pedido: ${
        pedido.ServiceOrderDetail.find(
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
      `Método de Pago: ${
        pedido.payment
          ? pedido.payment.payMethod === "cash"
            ? "Efectivo"
            : pedido.payment.payMethod === "credit"
            ? "Tarjeta"
            : "N/A"
          : "N/A"
      }`,
      10,
      50
    );
    doc.text(`Fecha de Pago: ${formatDate(pedido.receptionTime)}`, 10, 60);
    doc.text(`Adeudo: $${updatedPedido.totalPrice}`, 10, 70);
    doc.save(`pedido_${updatedPedido.id_order}.pdf`);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Pedidos Almacenados</strong>
        </div>
      </div>
      {showTable ? (
        <div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th>No. Pedido</th>
                <th>Usuario</th>
                <th>Cliente</th>
                <th>Categoría</th>
                <th>Piezas</th>
                <th>Estatus</th>
                <th>
                  Estatus <br />
                  de Pago
                </th>
                <th>Notas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((pedido) => (
                  <tr key={pedido.id_order}>
                    <td>{pedido.id_order}</td>
                    <td>
                      {pedido.user.name} {pedido.user.firstLN}{" "}
                      {pedido.user.secondLN}
                    </td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {pedido.client.name} {pedido.client.firstLN}{" "}
                      {pedido.client.secondLN}
                    </td>
                    <td>
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
                          : "Otro"
                        : "Categoría no definida"}
                    </td>
                    <td>
                      {pedido.category &&
                      pedido.category.categoryDescription === "planchado"
                        ? pedido.ironPieces !== null
                          ? pedido.ironPieces
                          : "-"
                        : pedido.category &&
                          pedido.category.categoryDescription === "tintoreria"
                        ? pedido.drycleanPieces !== null
                          ? pedido.drycleanPieces
                          : "-"
                        : "-"}
                    </td>
                    <td className="py-3 px-6 font-bold">
                      {pedido.orderStatus === "pending" ? (
                        <span className="text-gray-600 pl-1">
                          <MinusCircleOutlined /> Pendiente
                        </span>
                      ) : pedido.orderStatus === "stored" ? (
                        <span className="text-fuchsia-600 pl-1">
                          <DropboxOutlined /> Almacenado
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
                      ) : pedido.orderStatus === "cancelled" ? (
                        <span className="text-red-600 pl-1">
                          <StopOutlined /> Cancelado
                        </span>
                      ) : (
                        <span className="text-gray-600 pl-1">
                          Estado Desconocido
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-6 ${
                        pedido.payStatus === "unpaid"
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
                          <CheckCircleOutlined />
                          Pagado ${pedido.totalPrice}
                        </span>
                      )}
                    </td>
                    <td>{pedido.notes}</td>
                    <td>
                      {pedido.orderStatus === "delivered" ||
                      pedido.orderStatus === "pending" ||
                      pedido.orderStatus === "inprogress" ||
                      pedido.orderStatus ===
                        "canceled" ? null : pedido.payStatus === "paid" ? ( // No mostrar ningún botón si el estado del pedido es uno de estos
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

          <div className="flex justify-center items-center mt-8">
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
          <div className="flex justify-between items-center mr-20">
            <div></div>
            <div>
              <button className="btn-back" onClick={handleReturn}>
                Regresar
              </button>
            </div>
          </div>
          {selectedPedido &&
            entregando &&
            selectedPedido.payStatus === "paid" && (
              <Modal
                title="Pedido Entregado"
                open={entregando}
                closable={false}
                footer={null}
              >
                <div className="text-center">
                  <CheckCircleOutlined
                    style={{ fontSize: "64px", color: "green" }}
                  />
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
                  <strong>Cliente:</strong> {selectedPedido?.client.name}{" "}
                  {selectedPedido?.client.firstLN}{" "}
                  {selectedPedido?.client.secondLN}
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
                <CheckCircleOutlined
                  style={{ fontSize: "64px", color: "green" }}
                />
              )}
              {selectedPedido?.payStatus === "paid" && (
                <p className="text-green-600 font-bold text-lg mt-2">
                  Pago Confirmado...
                </p>
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-5">
          <div className="bg-PennBlue rounded-lg p-8 shadow-lg text-white text-2xl">
            <div className="flex items-center mb-4">
              <DropboxOutlined
                style={{ fontSize: "48px", marginRight: "8px" }}
              />
              <h1 className="text-3xl font-bold">Pedidos almacenados</h1>
            </div>
            <p>
              Bienvenido a pedidos almacenados. <br />
              Busca tu pedido por el{" "}
              <strong className="font-bold">nombre completo</strong> del cliente
              o por número del pedido.
            </p>
            <form
              className="flex items-center mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Select
                defaultValue="client"
                className=" mr-2 font-bold"
                onChange={(value) => setSearchType(value)}
              >
                <Select.Option
                  className="text-base font-semibold"
                  value="client"
                >
                  Nombre del Cliente
                </Select.Option>
                <Select.Option
                  className="text-base font-semibold"
                  value="id_order"
                >
                  Número del pedido
                </Select.Option>
              </Select>
              {searchType === "id_order" ? (
                <Input
                  className="mr-2"
                  type="number"
                  placeholder="Escriba el número de pedido"
                  value={id_order}
                  onChange={(e) => setId_order(e.target.value)}
                />
              ) : (
                <div>
                  <Input
                    className="mr-2"
                    placeholder="Escriba el nombre completo del cliente"
                    value={nameClient}
                    onChange={(e) => setNameClient(e.target.value)}
                  />
                  <Input
                    className="mr-2"
                    placeholder="Escriba el primer apellido completo del cliente"
                    value={firstNameClient}
                    onChange={(e) => setFirstNameClient(e.target.value)}
                  />
                  <Input
                    className="mr-2"
                    placeholder="Escriba el segundo apellido completo del cliente"
                    value={secondNameClient}
                    onChange={(e) => setSecondNameClient(e.target.value)}
                  />
                </div>)}
              <Button
                type="primary"
                className="btn-search-stored"
                onClick={handleSearch}
                htmlType="submit"
              >
                Buscar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosAlmacenados;
