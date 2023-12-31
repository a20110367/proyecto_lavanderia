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

const PedidosAlmacenados = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [searchType, setSearchType] = useState("client");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
    setSearchValue("");
  }, [searchType]);

  const pedidos = [
    {
      id_order: 1,
      user: "Nombre1",
      client: "Cliente1",
      categoryDescription: "Encargo",
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 150,
    },
    {
      id_order: 2,
      user: "Nombre2",
      client: "Cliente2",
      categoryDescription: "Planchado",
      pieces: 10,
      orderStatus: "stored",
      payStatus: "paid",
      notes: "Observaciones del pedido 2",
      totalPrice: 120,
    },
    {
      id_order: 3,
      user: "Nombre3",
      client: "Cliente1",
      categoryDescription: "Varios",
      orderStatus: "stored",
      payStatus: "paid",
      notes: "Sin notas",
      totalPrice: 100,
    },
    {
      id_order: 4,
      user: "Nombre4",
      client: "Cliente3",
      categoryDescription: "Tintoreria",
      pieces: 5,
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 250,
    },
    {
      id_order: 5,
      user: "Nombre5",
      client: "Cliente2",
      categoryDescription: "Encargo",
      orderStatus: "stored",
      payStatus: "paid",
      notes: "Observaciones del pedido 5",
      totalPrice: 50,
    },
    {
      id_order: 6,
      user: "Nombre6",
      client: "Cliente4",
      categoryDescription: "Planchado",
      pieces: 10,
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 180,
    },
    {
      id_order: 7,
      user: "Nombre7",
      client: "Cliente5",
      categoryDescription: "Encargo",
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 150,
    },
    {
      id_order: 8,
      user: "Nombre8",
      client: "Cliente6",
      categoryDescription: "Varios",
      orderStatus: "stored",
      payStatus: "paid",
      notes: "Observaciones del pedido 8",
      totalPrice: 100,
    },
    {
      id_order: 9,
      user: "Nombre9",
      client: "Cliente7",
      categoryDescription: "Varios",
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 120,
    },
    {
      id_order: 10,
      user: "Nombre10",
      client: "Cliente8",
      categoryDescription: "Tintoreria",
      pieces: 5,
      orderStatus: "stored",
      payStatus: "unpaid",
      notes: "Sin notas",
      totalPrice: 350,
    },
  ];

  const handleSearch = () => {
    if (!searchValue) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes rellenar el campo para buscar.",
        confirmButtonColor: "#034078",
      });
      return;
    }

    const results = pedidos.filter((pedido) => {
      if (searchType === "client") {
        return pedido.client.toLowerCase().includes(searchValue.toLowerCase());
      } else if (searchType === "id_order") {
        return pedido.id_order === parseInt(searchValue);
      }
      return false;
    });

    if (results.length > 0) {
      setSearchResults(results);
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

    setSearchResults(results);

    console.log("Resultados de búsqueda:", results);
  };

  const handleReturn = () => {
    setShowTable(false);
    setSearchType("client");
    setSearchValue("");
    setSearchResults([]);
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
        doc.text(`Cliente: ${pedido.client.name}`, 10, 20);
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
                : "Tarjeta"
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
      const order = {
        id_order: pedido.id_order,
        payForm: pedido.payForm,
        payStatus: "paid",
        payMethod: cobroInfo.metodoPago,
        subtotal: pedido.totalPrice,
        casher: pedido.user.name,
        client: pedido.client.name,
        scheduledDeliveryDate: pedido.scheduledDeliveryDate,
        scheduledDeliveryTime: pedido.scheduledDeliveryTime,
        receptionDate: pedido.receptionDate,
        receptionTime: pedido.receptionTime,
        notes: pedido.notes,
        cart: cart,
      };
      orderTicket(order);
      const updatedFilteredPedidos = filteredPedidos.filter(function (order) {
        return order.id_order !== pedido.id_order;
      });
      setFilteredPedidos(updatedFilteredPedidos);
    } catch (err) {
      console.log(err);
    }

    const doc = new jsPDF();
    doc.text(`Detalles del Pedido`, 10, 10);
    doc.text(`Cliente: ${updatedPedido.client.name}`, 10, 20);
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
            : "Tarjeta"
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
              {searchResults
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((pedido) => (
                  <tr key={pedido.id_order}>
                    <td>{pedido.id_order}</td>
                    <td>{pedido.user}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {pedido.client}
                    </td>
                    <td>{pedido.categoryDescription}</td>
                    <td>{pedido.pieces}</td>
                    <td className="py-3 px-6 font-bold">
                      {pedido.orderStatus === "stored" ? (
                        <span className="text-fuchsia-600 pl-1">
                          <DropboxOutlined /> Almacenado
                        </span>
                      ) : (
                        <span className="text-gray-600 pl-1">Otro estado</span>
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

          <div className="flex justify-center items-center mt-8">
            <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={Math.ceil(searchResults.length / itemsPerPage)}
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
                  <strong>Cliente:</strong> {selectedPedido?.client}
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
              Busca tu pedido por nombre del cliente o número del pedido.
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
                className="w-32 mr-2 font-bold"
                onChange={(value) => setSearchType(value)}
              >
                <Select.Option
                  className="text-base font-semibold"
                  value="client"
                >
                  Cliente
                </Select.Option>
                <Select.Option
                  className="text-base font-semibold"
                  value="id_order"
                >
                  Número
                </Select.Option>
              </Select>
              {searchType === "id_order" ? (
                <Input
                  className="mr-2"
                  type="number"
                  placeholder="Número de pedido"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              ) : (
                <Input
                  className="mr-2"
                  placeholder="Nombre del cliente"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}
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
