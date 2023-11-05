import React, { useState } from "react";
import jsPDF from "jspdf";
import Axios from "axios";
import useSWR from "swr";
import { Link, useLocation } from "react-router-dom";
import { Modal, Select } from "antd";
import moment from "moment";
import "moment/locale/es";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { useAuth } from "../../hooks/auth/auth";

const { Option } = Select;

export default function PuntoVenta() {
  const { cookies } = useAuth();

  const [cart, setCart] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [img, setImg] = useState([
    "https://www.asociacionaden.com/wp-content/uploads/2021/09/lavar-la-ropa-de-deporte.jpg",
    "https://www.ocu.org/-/media/ocu/images/home/electrodomesticos/secadora/secadora-eficiencia-tiempo-programa.jpg?rev=ceb8727f-ccca-46dc-a0d1-f4d3e83d8031&hash=D0C547A95C98B9C4704FA36A6B136090",
    "https://www.sincable.mx/wp-content/uploads/2020/02/centrodeplanchado-0-belchonock-105267335_l-scaled.jpg",
  ]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const clientName = queryParams.get("clientName");
  const serviceType = queryParams.get("serviceType")?.toLowerCase();
  const shouldShowAllServices = !serviceType || serviceType === "";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] =
  useState(serviceType === "autoservicio" ? "advance" : "delivery");

  const [paymentMethod, setPaymentMethod] = useState(
    serviceType === "autoservicio" ? "cash" : ""
  );

  const [purchaseDate, setPurchaseDate] = useState(moment());
  const [deliveryDate, setDeliveryDate] = useState(moment().toISOString());
  const customDateFormat = "dd/MM/yyyy HH:mm:ss";

  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/services");
    return response.data;
  };

  const { data } = useSWR("services", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const addToCart = (serviceId, service) => {
    if (serviceType === "autoservicio") {
      const serviceToAdd = service;
      if (serviceToAdd) {
        const existingService = cart.find(
          (item) => item.id_service === serviceId
        );
        if (existingService) {
          const updatedCart = cart.map((item) =>
            item.id_service === serviceId
              ? { ...item, quantity: item.quantity + 1, totalPrice: item.price * (item.quantity + 1) }
              : item
          );
          setCart(updatedCart);
        } else {
          setCart([...cart, { ...serviceToAdd, quantity: 1, totalPrice: 0 }]);
        }
      }
    } else {
      if (cart.length === 0) {
        const serviceToAdd = { ...service, quantity: 1, price: service.price };
        if (serviceToAdd) {
          setCart([serviceToAdd]);
          setSelectedServiceId(serviceId);
          setIsAddButtonDisabled(true);
        }
      }
    }
  };

  const removeFromCart = (serviceId) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id_service === serviceId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        } else {
          return item;
        }
      })
      .filter(Boolean);

    setCart(updatedCart);

    if (serviceId === selectedServiceId) {
      setSelectedServiceId(null);
      setIsAddButtonDisabled(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const showModal = () => {
    console.log(cart)
    // const now = new Date();
    // console.log(now.toISOString())
    // console.log(now.toISOString().split("T")[0] + 'T00:00:00.000Z')
    setIsModalVisible(true);
    console.log(total)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTotalPrice(0)
  };

  const handleSaveAndGenerateTicket = async () => {
    setIsModalVisible(false);

    const now = new Date();
    const arrayServiceDetail = []

    let total = 0
    cart.map(detail => total = total + detail.totalPrice)

    cart.map( detail => 
      arrayServiceDetail.push({
        units: detail.quantity,
        subtotal: detail.quantity * detail.price,
        updatedAt: now.toISOString(),
        fk_Service: detail.id_service,
      }
    ))

    ///////////////////////////////////////////////
    //CART[0,1]
    try {
      await Axios.post("http://localhost:5000/orders", {
        serviceOrder: {
          receptionDate: now.toISOString().split("T")[0] + 'T00:00:00.000Z',
          receptionTime: 0,
          totalPrice: parseFloat(totalPrice),
          fk_client: clientId,
          numberOfItems: arrayServiceDetail.length,
          payForm: paymentMethod,
          payStatus: selectedPaymentOption,
          
          fk_user: cookies.token,
          scheduledDeliveryDate: 0,
          scheduledDeliveryTime: 0,
          fk_categoryId: 0,    
        },
        serviceOrderDetail: arrayServiceDetail,
      });
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      setUserName("");
      setPwd("");
      setMatchPwd("");
      navigate("/menuPuntoVenta");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
    }
    ///////////////////////

    const doc = new jsPDF();

    doc.text(`Ticket de Compra de: ${clientName}`, 10, 10);

    doc.text(`Le atendió:  ${cookies.username}`, 10, 20);

    doc.text("Productos:", 10, 30);
    let y = 40;

    cart.forEach((service) => {
      doc.text(
        `${service.description} x ${service.quantity} - $${
          service.price * service.quantity
        }`,
        10,
        y
      );
      y += 10;
    });

    doc.text(`Subtotal: $${calculateSubtotal()}`, 10, y + 10);
    doc.text(
      `Fecha de Recepcion: ${purchaseDate.format("DD/MM/YYYY HH:mm:ss")}`,
      10,
      y + 20
    );

    // Agregar el campo "Fecha de Entrega" al ticket
    doc.text(
      `Fecha de Entrega: ${deliveryDate.format("DD/MM/YYYY HH:mm:ss")}`,
      10,
      y + 30
    );

    doc.text(`Forma de Pago: ${selectedPaymentOption}`, 10, y + 40);

    if (selectedPaymentOption === "advance") {
      doc.text(`Método de Pago Anticipado: ${paymentMethod}`, 10, y + 50);
    }

    doc.save("ticket_compra.pdf");

    localStorage.setItem("lastSelectedClient", clientName);
    localStorage.setItem("returningFromPuntoVenta", "true");

    // Regresar a la página anterior
    window.history.back();

    console.log(cart);
  };

  const filteredServices = shouldShowAllServices
    ? data
    : data.filter((service) => {
        // Aquí aplicamos las condiciones para filtrar los servicios
        if (
          serviceType === "encargo" &&
          !service.description.toLowerCase().includes("autoservicio") &&
          !service.description.toLowerCase().includes("planchado")
        ) {
          return true;
        }
        if (
          serviceType === "planchado" &&
          !service.description.toLowerCase().includes("autoservicio") &&
          !service.description.toLowerCase().includes("encargo")
        ) {
          return true;
        }
        if (
          serviceType === "autoservicio" &&
          service.description.toLowerCase().includes("autoservicio")
        ) {
          return true;
        }
        return false;
      });
  return (
    <div>
      <div className="basic-container w-5/12">
        <strong className="title-strong">Lista de Servicios</strong>
      </div>
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id_service}
                  className="bg-white rounded-lg shadow-lg"
                >
                  <img
                    src={img[0]}
                    alt={`Imagen de ${service.description}`}
                    className="img-pos"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">
                      {service.description}
                    </h3>
                    <h5 className="text-gray-600">${service.price}</h5>
                    <button
                      className={`${
                        isAddButtonDisabled
                          ? "bg-gray-400"
                          : "bg-blue-500 hover:bg-blue-700"
                      } text-white font-bold py-2 px-4 rounded mt-2`}
                      onClick={() => addToCart(service.id_service, service)}
                      disabled={isAddButtonDisabled}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-body mt-5">
              <h3 className="text-center border-b-2 text-lg border-gray-500 pb-2">
                <p className="font-bold">Cliente seleccionado: {clientName}</p>
              </h3>
              <ul className="divide-y divide-gray-300">
                {cart.map((service) => (
                  <li
                    key={service.id_service}
                    className="py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={img[0]}
                        alt={`Imagen de ${service.description}`}
                        className="h-16 w-16 object-cover rounded-lg mr-4"
                      />
                      {service.description} x {service.quantity} - $
                      {service.price * service.quantity}
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                      onClick={() => removeFromCart(service.id_service)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <strong>Subtotal:</strong> ${calculateSubtotal()}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={showModal}
                >
                  Guardar Compra
                </button>

                <Modal
                  title={`Guardar Compra para ${clientName}`}
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={[
                    <button
                      key="submit"
                      className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSaveAndGenerateTicket}
                    >
                      Guardar
                    </button>,
                    <button
                      key="back"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>,
                  ]}
                >
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Le atiende:
                    </p>
                    <p style={{ fontSize: "16px" }}>{cookies.username}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Detalles del Servicio:
                    </p>
                    {cart.map((service) => (
                      <div key={service.id_service}>
                        <p style={{ fontSize: "16px" }}>
                          {service.description}
                        </p>
                        <p style={{ fontSize: "16px" }}>
                          Costo: ${service.price * service.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div>
                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Fecha de Recepcion:
                      </p>
                      <div style={{ fontSize: "16px" }}>
                        {purchaseDate.format("DD/MM/YYYY HH:mm:ss")}
                      </div>
                    </div>{" "}
                  </div>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Fecha de Entrega:
                    </p>
                    <DatePicker
                      selected={moment(deliveryDate).toDate()}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat={customDateFormat}
                      onChange={(date) => setDeliveryDate(moment(date))}
                      locale={es}
                      timeCaption="Hora"
                      className="form-control border-black"
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Subtotal:
                    </p>
                    <p style={{ fontSize: "16px" }}>${calculateSubtotal()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Seleccionar Forma de Pago:
                    </p>
                    <Select
                      style={{ width: "100%", fontSize: "16px" }}
                      onChange={(value) => {
                        setSelectedPaymentOption(value);
                        if (value === "advance") {
                          setPaymentMethod("cash");
                        } else {
                          setPaymentMethod("");
                        }
                      }}
                      value={
                        serviceType === "autoservicio"
                          ? "advance"
                          : selectedPaymentOption
                      }
                      disabled={serviceType === "autoservicio"}
                    >
                      <Option
                        value="delivery"
                        disabled={serviceType === "autoservicio"}
                      >
                        A la Entrega
                      </Option>
                      <Option value="advance">Anticipado</Option>
                    </Select>
                    {(selectedPaymentOption === "advance" ||
                      serviceType === "autoservicio") &&  (
                      <div>
                        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                          Método de Pago Anticipado:
                        </p>
                        <Select
                          style={{ width: "100%", fontSize: "16px" }}
                          onChange={(value) => setPaymentMethod(value)}
                          value={paymentMethod} 
                        >
                          <Option value="credit">Tarjeta</Option>
                          <Option value="cash">Efectivo</Option>
                        </Select>
                      </div>
                    )}
                  </div>
                </Modal>
              </div>
            </div>
            <Link
              to="/recepcionLavanderia"
              className="mt-4 flex text-center text-decoration-none"
            ></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
