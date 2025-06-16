import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Card } from "antd";
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
import { LuPackageSearch } from "react-icons/lu";
import moment from "moment";
import api from "../../api/api";
import jsPDF from "jspdf";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../hooks/auth/auth";
const { Meta } = Card;

const BuscarPedidos = () => {
  const [img, setImg] = useState([
    "https://www.asociacionaden.com/wp-content/uploads/2021/09/lavar-la-ropa-de-deporte.jpg",
    "https://www.ocu.org/-/media/ocu/images/home/electrodomesticos/secadora/secadora-eficiencia-tiempo-programa.jpg?rev=ceb8727f-ccca-46dc-a0d1-f4d3e83d8031&hash=D0C547A95C98B9C4704FA36A6B136090",
    "https://www.sincable.mx/wp-content/uploads/2020/02/centrodeplanchado-0-belchonock-105267335_l-scaled.jpg",
  ]);

  const [nameClient, setNameClient] = useState("");
  const [firstNameClient, setFirstNameClient] = useState("");
  const [secondNameClient, setSecondNameClient] = useState("");
  const [id_order, setId_order] = useState("");
  const [searchType, setSearchType] = useState("client");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [orderBy, setOrderBy] = useState("newToOld");
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
        const res = await api.post("/ordersByClientName", {
          //quitar restriccion de estatus probablemente cambie
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
        // Aplicar el orden según la opción seleccionada
        if (orderBy === "newToOld") {
          results.sort((a, b) => b.id_order - a.id_order);
        } else if (orderBy === "oldToNew") {
          results.sort((a, b) => a.id_order - b.id_order);
        }
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

  const handleOrderByChange = (value) => {
    setOrderBy(value);
    // Actualizar la lista de pedidos ordenada según la opción seleccionada
    if (value === "newToOld") {
      setFilteredPedidos(
        [...filteredPedidos].sort((a, b) => b.id_order - a.id_order)
      );
    } else if (value === "oldToNew") {
      setFilteredPedidos(
        [...filteredPedidos].sort((a, b) => a.id_order - b.id_order)
      );
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

  const handleViewDetails = (pedido) => {
    setSelectedPedido(pedido);
    setVisible(true);
  };

  const handlePrint = async () => {
    try {
      if (selectedPedido) {
        await api.post(`/generate/order/reprint`, {
          order: selectedPedido,
        })
        Swal.fire("Ticket Impreso", "", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error al imprimir", "", "error")
    }
  }

  const renderModalContent = () => {
    return (
      <div>
        <div className="text-lg grid grid-cols-2 gap-5">
          <div>
            <p>
              <strong>No. Pedido:</strong> {selectedPedido?.id_order}
            </p>
            <p>
              <strong>Cliente:</strong>{" "}
              {`${selectedPedido?.client.name} ${selectedPedido?.client.firstLN} ${selectedPedido?.client.secondLN}`}
            </p>
            <p>
              <strong>Recibio:</strong>{" "}
              {`${selectedPedido?.user.name} ${selectedPedido?.user.firstLN} ${selectedPedido?.user.secondLN}`}
            </p>
            <p>
              <strong>Fecha de Recepción:</strong>{" "}
              {formatDate(selectedPedido?.receptionDate)}
            </p>
            <p>
              <strong>Hora de Recepción:</strong>{" "}
              {new Date(selectedPedido?.receptionTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong> Entrega Programada:</strong>{" "}
              {formatDate(selectedPedido?.scheduledDeliveryDate)}
            </p>
            <p>
              <strong>Forma de pago:</strong>{" "}
              {selectedPedido?.payForm === "advance"
                ? "Anticipado"
                : selectedPedido?.payForm === "delivery"
                  ? "A la entrega"
                  : selectedPedido?.payForm}
            </p>
            <p>
              <strong>Método de pago:</strong>{" "}
              {selectedPedido?.payment
                ? selectedPedido.payment.payMethod === "credit"
                  ? "Tarjeta"
                  : selectedPedido.payment.payMethod === "cash"
                    ? "Efectivo"
                    : "No se ha pagado"
                : "No se ha pagado"}
            </p>
          </div>
          {selectedPedido?.deliveryDetail &&
            selectedPedido.deliveryDetail.deliveryDate ? (
            <div>
              <p>
                <strong>Entregó:</strong>{" "}
                {selectedPedido?.deliveryDetail &&
                  selectedPedido.deliveryDetail.user
                  ? `${selectedPedido.deliveryDetail.user.name} ${selectedPedido.deliveryDetail.user.firstLN} ${selectedPedido.deliveryDetail.user.secondLN}`
                  : "No se encontró información de entrega"}
              </p>

              <p>
                <strong>Fecha de entrega:</strong>{" "}
                {selectedPedido?.deliveryDetail &&
                  selectedPedido.deliveryDetail.deliveryDate
                  ? formatDate(selectedPedido.deliveryDetail.deliveryDate)
                  : "Fecha de entrega no disponible"}
              </p>
              <p>
                <strong>Hora de entrega:</strong>{" "}
                {selectedPedido?.deliveryDetail &&
                  selectedPedido.deliveryDetail.deliveryTime
                  ? new Date(
                    selectedPedido.deliveryDetail.deliveryTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "Hora de entrega no disponible"}
              </p>
            </div>
          ) : selectedPedido?.category?.categoryDescription === "autoservicio" ? (
            <div>
              <p>
                <strong></strong>{" "}
                <span className="text-green-600">
                  Es responsabilidad del cliente
                </span>
              </p>
              {/* Aquí puedes agregar los campos adicionales relacionados con el autoservicio */}
              {/* Por ejemplo, podrías mostrar el campo de Fecha de Entrega Programada o cualquier otro campo relevante */}
            </div>
          ) : (
            <div>
              <p>
                <span className="text-red-600">
                  No se ha entregado el pedido
                </span>
              </p>
            </div>
          )}
        </div>
        {/* Campos en la parte inferior */}
        <div className="text-lg">
          <br />
          <br />
          <br />
          <p>
            <strong>Categoría:</strong>{" "}
            {selectedPedido?.category?.categoryDescription
              ? selectedPedido.category.categoryDescription === "autoservicio"
                ? "Autoservicio"
                : selectedPedido.category.categoryDescription === "planchado"
                  ? "Planchado"
                  : selectedPedido.category.categoryDescription === "encargo"
                    ? "Encargo Ropa"
                    : selectedPedido.category.categoryDescription === "tintoreria"
                      ? "Tintoreria"
                      : selectedPedido.category.categoryDescription === "varios"
                        ? "Encargo Varios"
                        : "Otro"
              : "Categoría no definida"}
          </p>
          <p>
            <strong>Piezas:</strong>{" "}
            {selectedPedido?.ironPieces ??
              selectedPedido?.drycleanPieces ??
              "-"}
          </p>
          <p>
            <strong>Estatus:</strong>{" "}
            <span
              className={
                selectedPedido?.orderStatus === "pending"
                  ? "text-gray-600"
                  : selectedPedido?.orderStatus === "stored"
                    ? "text-fuchsia-600"
                    : selectedPedido?.orderStatus === "inProgress"
                      ? "text-yellow-600"
                      : selectedPedido?.orderStatus === "finished"
                        ? "text-blue-600"
                        : selectedPedido?.orderStatus === "delivered"
                          ? "text-green-600"
                          : selectedPedido?.orderStatus === "cancelled"
                            ? "text-red-600"
                            : "text-gray-600"
              }
            >
              {selectedPedido?.orderStatus === "pending" ? (
                <span className="pl-1 font-bold">
                  <MinusCircleOutlined /> Pendiente
                </span>
              ) : selectedPedido?.orderStatus === "stored" ? (
                <span className="pl-1 font-bold">
                  <DropboxOutlined /> Almacenado
                </span>
              ) : selectedPedido?.orderStatus === "inProgress" ? (
                <span className="pl-1 font-bold">
                  <ClockCircleOutlined /> En Proceso
                </span>
              ) : selectedPedido?.orderStatus === "finished" ? (
                <span className="pl-1 font-bold">
                  <IssuesCloseOutlined /> Finalizado no entregado
                </span>
              ) : selectedPedido?.orderStatus === "delivered" ? (
                <span className="pl-1 font-bold">
                  <CheckCircleOutlined /> Finalizado Entregado
                </span>
              ) : selectedPedido?.orderStatus === "cancelled" ? (
                <span className="pl-1 font-bold">
                  <StopOutlined /> Cancelado
                </span>
              ) : (
                <span className="pl-1 font-bold">Estado Desconocido</span>
              )}
            </span>
          </p>
          <p>
            <strong>Estatus de Pago:</strong>{" "}
            <span
              className={
                selectedPedido?.payStatus === "unpaid"
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {selectedPedido?.payStatus === "unpaid" ? (
                <span className="pl-1 font-bold">
                  <ExclamationCircleOutlined /> Adeudo $
                  {selectedPedido?.totalPrice}
                </span>
              ) : (
                <span className="pl-1 font-bold">
                  <CheckCircleOutlined /> Pagado ${selectedPedido?.totalPrice}
                </span>
              )}
            </span>
          </p>
          <p>
            <strong>Notas:</strong>{" "}
            {selectedPedido?.notes ? selectedPedido.notes : "No hay notas"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Buscar Pedidos</strong>
        </div>
        {showTable && ( // Condición para mostrar el select solo cuando se muestra la tabla
          <div className="flex justify-end items-end mt-3 mr-3">
            <select
              defaultValue="newToOld"
              onChange={(e) => handleOrderByChange(e.target.value)}
              className="select-category"
            >
              <option value="newToOld">Nuevo a Viejo</option>
              <option value="oldToNew">Viejo a Nuevo</option>
            </select>
          </div>
        )}
      </div>
      {showTable ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {filteredPedidos
              .slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
              )
              .map((pedido) => (
                <Card
                  key={pedido.id_order}
                  title={`Pedido No. ${pedido.id_order}`}
                  className="rounded-md  hover:shadow-md "
                  cover={<img alt="imagen del pedido" src={img[0]} />}
                  actions={[
                    <Button
                      key="details"
                      type="primary"
                      className="bg-blue-500 hover:bg-blue-700"
                      onClick={() => handleViewDetails(pedido)}
                    >
                      Ver Detalles
                    </Button>,
                  ]}
                >
                  <p className="text-lg">
                    <strong className="">Cliente:</strong>{" "}
                    {`${pedido.client.name} ${pedido.client.firstLN} ${pedido.client.secondLN}`}
                  </p>
                  <p>
                    <strong>Categoría:</strong>{" "}
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
                  </p>
                  <p>
                    <strong>Estatus:</strong>{" "}
                    {pedido.orderStatus === "pending" ? (
                      <span className="text-gray-600 pl-1 font-bold">
                        <MinusCircleOutlined /> Pendiente
                      </span>
                    ) : pedido.orderStatus === "stored" ? (
                      <span className="text-fuchsia-600 pl-1 font-bold">
                        <DropboxOutlined /> Almacenado
                      </span>
                    ) : pedido.orderStatus === "inProgress" ? (
                      <span className="text-yellow-600 pl-1 font-bold">
                        <ClockCircleOutlined /> En Proceso
                      </span>
                    ) : pedido.orderStatus === "finished" ? (
                      <span className="text-blue-600 pl-1 font-bold">
                        <IssuesCloseOutlined /> Finalizado no entregado
                      </span>
                    ) : pedido.orderStatus === "delivered" ? (
                      <span className="text-green-600 pl-1 font-bold">
                        <CheckCircleOutlined /> Finalizado Entregado
                      </span>
                    ) : pedido.orderStatus === "cancelled" ? (
                      <span className="text-red-600 pl-1 font-bold">
                        <StopOutlined /> Cancelado
                      </span>
                    ) : (
                      <span className="text-gray-600 pl-1 font-bold">
                        Estado Desconocido
                      </span>
                    )}
                  </p>
                </Card>
              ))}
          </div>

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
              <button className="btn-back mb-4" onClick={handleReturn}>
                Regresar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-5">
          <div className="bg-PennBlue rounded-lg p-8 shadow-lg text-white text-2xl">
            <div className="flex items-center mb-4">
              <LuPackageSearch
                style={{ fontSize: "56px", marginRight: "8px" }}
              />
              <h1 className="text-3xl font-bold">Buscar pedidos</h1>
            </div>
            <p>
              Bienvenido a busqueda de pedidos. <br />
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
                className="btn-search-stored ml-4"
                onClick={handleSearch}
                htmlType="submit"
              >
                Buscar
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Modal para ver detalles del pedido */}
      <Modal
        title={`Detalles del Pedido No. ${selectedPedido?.id_order}`}
        open={visible}
        onCancel={handleClose}
        footer={[
          <Button
            className="btn-print"
            key="print"
            onClick={() => handlePrint()}
          >
            Imprimir Ticket de la Orden
          </Button>,
          <Button
            className="btn-cancel-modal"
            key="close"
            onClick={handleClose}
          >
            Cerrar
          </Button>,
        ]}
        style={{ minWidth: "700px" }} // Ajusta el ancho del modal según tus necesidades
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default BuscarPedidos;