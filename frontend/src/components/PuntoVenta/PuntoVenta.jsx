import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { HiOutlineSearch } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal, Select } from "antd";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/es";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { useAuth } from "../../hooks/auth/auth";
// import { orderTicket } from "../Ticket/Tickets";
import api from "../../api/api";
import { FaBoltLightning } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
const { Option } = Select;
import encargoImg from "../images/encargo.jpg";
import autoservicioImg from "../images/autoservicio.jpg";
import planchadoImg from "../images/planchado.jpg";
import tintoreriaImg from "../images/tintoreria.jpg";
import variosImg from "../images/varios.jpeg";

export default function PuntoVenta() {
  const { cookies } = useAuth();

  const navigate = useNavigate();
  const lastIronControlId = parseInt(localStorage.getItem("lastIronControl"));
  const maxIronCapacity = parseInt(localStorage.getItem('maxCapacity'));
  const [cart, setCart] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [img, setImg] = useState([
    "https://www.asociacionaden.com/wp-content/uploads/2021/09/lavar-la-ropa-de-deporte.jpg",
    "https://www.ocu.org/-/media/ocu/images/home/electrodomesticos/secadora/secadora-eficiencia-tiempo-programa.jpg?rev=ceb8727f-ccca-46dc-a0d1-f4d3e83d8031&hash=D0C547A95C98B9C4704FA36A6B136090",
    "https://www.sincable.mx/wp-content/uploads/2020/02/centrodeplanchado-0-belchonock-105267335_l-scaled.jpg",
  ]);
  const categoryImages = {
    encargo: encargoImg,
    autoservicio: autoservicioImg,
    planchado: planchadoImg,
    tintoreria: tintoreriaImg,
    varios: variosImg,
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const clientName = queryParams.get("clientName");
  const getUrl = queryParams.get("geturl");
  const serviceType = queryParams.get("serviceType")?.toLowerCase();
  const shouldShowAllServices = !serviceType || serviceType === "";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [payForm, setPayForm] = useState("delivery");
  const [payStatus, setPayStatus] = useState("unpaid");
  const [payMethod, setPayMethod] = useState("cash");
  const [categoryId, setCategoryId] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpress, setIsExpress] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [fetch, setFetch] = useState("");
  const [notes, setNotes] = useState("");
  const [pieces, setPieces] = useState(0);
  const [numberOfPieces, setNumberOfPieces] = useState(
    localStorage.getItem("numberOfPieces")
      ? parseInt(localStorage.getItem("numberOfPieces"))
      : 0
  );

  ///////////////////////IGNORA ESTO SAUL, ES DE PRODUCTOS Y DE MOMENTO ESO SE VA A LA VRG//////////////////////////////
  // const dummyProducts = [
  //   { name: "Fabuloso", price: 15 },
  //   { name: "Pinol", price: 20 },
  //   { name: "Ace", price: 25 },
  //   { name: "Suavitel", price: 30 },
  //   { name: "Blancanieves", price: 40 },
  // ];
  // const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState(false);

  // // Función para agregar productos igual esto mandalo a la vrg
  // const addProduct = (productName, price) => {
  //   const existingProduct = selectedProducts.find(
  //     (product) => product.name === productName
  //   );

  //   if (existingProduct) {
  //     // Si el producto ya está en la lista, incrementa la cantidad
  //     const updatedProducts = selectedProducts.map((product) =>
  //       product.name === productName
  //         ? { ...product, quantity: product.quantity + 1 }
  //         : product
  //     );
  //     setSelectedProducts(updatedProducts);
  //   } else {
  //     // Si el producto no está en la lista, agrégalo con cantidad 1
  //     setSelectedProducts([
  //       ...selectedProducts,
  //       { name: productName, price: price, quantity: 1 },
  //     ]);
  //   }
  // };

  // // Función para eliminar productos
  // const removeProduct = (productName) => {
  //   const updatedProducts = selectedProducts
  //     .map((product) =>
  //       product.name === productName
  //         ? { ...product, quantity: product.quantity - 1 }
  //         : product
  //     )
  //     .filter((product) => product.quantity > 0);
  //   setSelectedProducts(updatedProducts);
  // };

  // // Función para calcular el precio total de los productos seleccionados
  // const calculateProductTotal = () => {
  //   return selectedProducts.reduce(
  //     (total, product) => total + product.price * product.quantity,
  //     0
  //   );
  // };

  useEffect(() => {
    // Definir el category_id
    if (serviceType === "autoservicio") {
      setFetch("selfService");
      setCategoryId(1);
      setPostUrl("/ordersSelfService");
      setPayStatus("paid");
      setPayForm("advance");
    } else if (serviceType === "encargo") {
      setFetch("laundryService");
      setCategoryId(2);
      setPostUrl("/ordersLaundryService");
    } else if (serviceType === "planchado") {
      setFetch("ironService");
      setCategoryId(3);
      setPostUrl("/ordersIronService");
    } else if (serviceType === "tintoreria") {
      setFetch("dryCleanService");
      setCategoryId(4);
      setPostUrl("/ordersDryclean");
      setPayStatus("paid");
      setPayForm("advance");
    } else if (serviceType === "varios") {
      setFetch("servicesOtherService");
      setCategoryId(5);
      setPostUrl("/ordersOtherService");
    }
  }, [serviceType]);

  const [purchaseDate, setPurchaseDate] = useState(moment());
  const [deliveryDate, setDeliveryDate] = useState(moment());
  const customDateFormat = "dd/MM/yyyy HH:mm:ss";
  const [errMsg, setErrMsg] = useState("");

  const fetcher = async () => {
    const response = await api.get(getUrl);
    return response.data;
  };

  const { data } = useSWR(fetch, fetcher);
  if (!data) return <h2>Loading...</h2>;
  // console.log(data)
  console.log(cart)

  const addToCart = (serviceId, service) => {
    // if (serviceType === "autoservicio") {
    const serviceToAdd = service;
    if (serviceToAdd) {
      const existingService = cart.find(
        (item) => item.id_service === serviceId
      );
      if (existingService) {
        const updatedCart = cart.map((item) =>
          item.id_service === serviceId
            ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
            : item
        );
        setCart(updatedCart);
      } else {
        setCart([
          ...cart,
          { ...serviceToAdd, quantity: 1, totalPrice: serviceToAdd.price },
        ]);
      }

      if (categoryId === 3 || categoryId === 4) {
        setPieces(pieces + serviceToAdd.pieces);
      } else if (categoryId === 3 && numberOfPieces + pieces > maxIronCapacity) {
        Swal.fire({
          icon: "error",
          title: "Se ha superado el No. de Piezas diarias",
          text: "Intenta generar el pedido para otra fecha, o utiliza planchado Express",
          confirmButtonColor: "#034078",
        });
      }
    }
    // } else {
    //   if (cart.length === 0) {
    //     const serviceToAdd = {
    //       ...service,
    //       quantity: 1,
    //       price: service.price,
    //       totalPrice: service.price,
    //     };
    //     if (serviceToAdd) {
    //       setCart([serviceToAdd]);
    //       setSelectedServiceId(serviceId);
    //       setIsAddButtonDisabled(true);
    //     }
    //   }
    // }
  };

  const removeFromCart = (serviceId) => {
    if (cart.length === 1) {
      setIsExpress(false);
    }
    const updatedCart = cart
      .map((item) => {
        if (item.id_service === serviceId) {
          if (item.quantity > 1) {
            categoryId === 3
              ? setPieces(pieces - item.pieces)
              : categoryId === 4
                ? setPieces(pieces - item.pieces)
                : "";
            return { ...item, quantity: item.quantity - 1 };
          } else {
            categoryId === 3
              ? setPieces(pieces - item.pieces)
              : categoryId === 4
                ? setPieces(pieces - item.pieces)
                : "";
            return null;
          }
        } else {
          return item;
        }
      })
      .filter(Boolean);
    // setSelectedProducts([]);
    setCart(updatedCart);

    if (serviceId === selectedServiceId) {
      setSelectedServiceId(null);
      setIsAddButtonDisabled(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateSubtotalCredit = () => {
    return cart.reduce((total, item) => total + item.priceCredit * item.quantity, 0);
  };

  const showModal = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "La lista de servicios esta vacia!",
        text: "Intenta añadir un servicio a la lista.",
        confirmButtonColor: "#034078",
      });
      return;
    } else if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelar = () => {
    window.history.back();
  };

  console.log(cart)

  const saveOrderAndGenerateTicket = async (ironDate) => {
    const arrayService = [];
    let noOfItems = 0;
    cart.forEach((detail) => (noOfItems = noOfItems + detail.quantity));

    const subTotal = payMethod === 'credit' ? calculateSubtotalCredit() : calculateSubtotal();
    // console.log(subTotal)

    cart.forEach((detail) =>
      arrayService.push({
        units: detail.quantity,
        subtotal: payMethod === 'credit' ? detail.quantity * detail.priceCredit : detail.quantity * detail.price,
        fk_Service: detail.id_service,
        serviceDescription: detail.description,
        priceCash: detail.price,
        priceCredit: detail.priceCredit,
        categoryDescription: detail.Category.categoryDescription,
      })
    );

    let ironPieces = null;
    let drycleanPieces = null;
    let date = null;

    if (categoryId === 3) {
      ironPieces = pieces;
    } else if (categoryId === 4) {
      drycleanPieces = pieces;
    }

    date = (ironDate ? deliveryDate.add(1, 'days') : deliveryDate)

    try {
      // GEN ORDER
      const res = await api.post(postUrl, {
        serviceOrder: {
          totalPrice: subTotal,
          fk_client: parseInt(clientId),
          numberOfItems: noOfItems,
          payForm: payForm,
          payStatus: payStatus,
          fk_user: cookies.token,
          receptionDate: purchaseDate,
          receptionTime: purchaseDate,
          scheduledDeliveryDate: date,
          scheduledDeliveryTime: date,
          express: isExpress,
          ironPieces: ironPieces,
          drycleanPieces: drycleanPieces,
          fk_categoryId: categoryId,
          notes: notes,
        },
        services: arrayService,
      });
      // orderTicket(order);

      // PAYMENT ADVANCE
      const idOrder = res.data.serviceOrder.id_order;
      console.log(idOrder);
      if (payForm === "advance") {
        await api.post("/paymentsAdvance", {
          payment: {
            fk_idOrder: idOrder,
            payMethod: payMethod,
            payDate: purchaseDate,
            payTime: purchaseDate,
            fk_cashCut: parseInt(localStorage.getItem("cashCutId")),
            payTotal: subTotal,
          },
        });
      }

      const order = {
        id_order: res.data.serviceOrder.id_order,
        payForm: payForm,
        payStatus: payStatus,
        payMethod: payMethod,
        subtotal: subTotal,
        casher: cookies.username,
        numberOfItems: noOfItems,
        client:
          res.data.serviceOrder.client.name +
          " " +
          res.data.serviceOrder.client.firstLN +
          " " +
          res.data.serviceOrder.client.secondLN,
        receptionDate: purchaseDate,
        receptionTime: purchaseDate,
        scheduledDeliveryDate: deliveryDate,
        scheduledDeliveryTime: deliveryDate,
        pieces: pieces,
        serviceType: serviceType,
        notes: notes,
        cart: cart,
        extraTickets: true,
      };

      localStorage.setItem("lastSelectedClient", clientName);
      localStorage.setItem("returningFromPuntoVenta", "true");
      if (!isExpress) {
        localStorage.setItem(
          "numberOfPieces",
          pieces +
          (localStorage.getItem("numberOfPieces")
            ? parseInt(localStorage.getItem("numberOfPieces"))
            : 0)
        );
      }

      // Regresar a la página anterior
      window.history.back();

      // GENERAR EL TICKET
      await api.post("/generateTicket", {
        order: order,
      });

    } catch (err) {
      console.error(err)
      if (!err?.response) {
        setErrMsg("Sin respuesta del Servidor");
      } else if (err.response.status === 400) {
        console.warn("Impresora desconectada o sin conexión.");
        Swal.fire({
          icon: "error",
          title: "Impresora desconectada o sin conexión.",
          text: "Revise la si la impresora se encuentra prendida y conectada.",
          confirmButtonColor: "#034078",
        });
      } else {
        setErrMsg(
          "Hubo un error al registrar la Orden, comuniquese con Soporte"
        );
      }
    }
  }

  const handleSave = async () => {
    setIsSaved(true);
    setIsModalVisible(false);

    try {
      if (categoryId === 3) {
        if (isExpress) {
          saveOrderAndGenerateTicket()
          await api.patch(`/expressNewOrderIronControl/${lastIronControlId}`, {
            pieces: pieces,
          });
        } else {
          if (numberOfPieces + pieces < maxIronCapacity) {
            saveOrderAndGenerateTicket()
            await api.patch(`/updateIronRegularOrderNew/${lastIronControlId}`, {
              pieces: pieces,
            });
          } else {
            Swal.fire({
              title: "Se ha superado el No. de Piezas diarias",
              text: "Como las piezas superaron el limite, el pedido se entregara un dia posterior",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#034078",
              cancelButtonColor: "#d33",
              confirmButtonText: "Si, generar el pedido!"
            }).then(async (result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Pedido Generado!",
                  text: "Tu pedido ha sido generado con exito.",
                  icon: "success"
                });
                saveOrderAndGenerateTicket(true)
                await api.patch(`/updateIronRegularOrderForTomorrow/${lastIronControlId}`, {
                  pieces: pieces,
                });
              }
            });
            setIsModalVisible(false);
          }
        }
      } else {
        saveOrderAndGenerateTicket()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredServices = shouldShowAllServices
    ? data
    : data.filter((service) => {
      // Aquí aplicamos las condiciones para filtrar los servicios
      if (
        serviceType === "encargo" &&
        !service.description.toLowerCase().includes("autoservicio") &&
        !service.description.toLowerCase().includes("planchado") &&
        !service.description.toLowerCase().includes("tintoreria") &&
        !service.description.toLowerCase().includes("varios")
      ) {
        return true;
      }
      if (
        serviceType === "planchado" &&
        !service.description.toLowerCase().includes("autoservicio") &&
        !service.description.toLowerCase().includes("encargo") &&
        !service.description.toLowerCase().includes("lavado")
      ) {
        return true;
      }
      if (
        serviceType === "tintoreria" &&
        !service.description.toLowerCase().includes("autoservicio") &&
        !service.description.toLowerCase().includes("encargo") &&
        !service.description.toLowerCase().includes("lavado") &&
        !service.description.toLowerCase().includes("planchado")
      ) {
        return true;
      }
      if (
        serviceType === "varios" &&
        !service.description.toLowerCase().includes("autoservicio") &&
        !service.description.toLowerCase().includes("encargo") &&
        !service.description.toLowerCase().includes("tintoreria") &&
        !service.description.toLowerCase().includes("planchado")
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

  const handleOnChange = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "La lista de servicios esta vacia!",
        text: "Intenta añadir un servicio a la lista.",
        confirmButtonColor: "#034078",
      });
      return console.log("carrito vacio weon");
    } else {
      if (!isExpress) {
        Swal.fire({
          title: "Esta seguro de poner el pedido como Servicio Express?",
          text: "El Precio sera uno mayor a lo habitual en caso de confirmar",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setIsExpress(!isExpress);
            changePrice();
          }
        });
      } else {
        setIsExpress(!isExpress);
        changePrice();
      }
    }
  };

  const changePrice = () => {
    const expressMultiplier = localStorage.getItem("expressMultiplier")
      ? localStorage.getItem("expressMultiplier")
      : 2;

    if (isExpress) {
      const updatedCart = cart.map((detail) => ({
        ...detail,
        price: detail.price / expressMultiplier,
        totalPrice: detail.price / expressMultiplier,
      }));
      setCart(updatedCart);
    } else {
      const updatedCart = cart.map((detail) => ({
        ...detail,
        price: detail.price * expressMultiplier,
        totalPrice: detail.price * expressMultiplier,
      }));
      setCart(updatedCart);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <div>
      <div className="title-container mb-3">
        <strong className="title-strong">
          {serviceType === "encargo"
            ? "Lista de Servicios de Lavandería"
            : serviceType === "autoservicio"
              ? "Lista de Servicios de Autoservicio"
              : serviceType === "planchado"
                ? "Lista de Servicios de Planchado"
                : serviceType === "tintoreria"
                  ? "Lista de Servicios de Tintorería"
                  : serviceType === "varios"
                    ? "Lista de Servicios Encargo Varios"
                    : "Lista de Servicios"}
        </strong>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Buscar..."
          className="input-search"
          value={filtro}
          onChange={handleFiltroChange}
        />
        <div className="absolute top-2.5 left-2.5 text-gray-400">
          <HiOutlineSearch fontSize={20} className="text-gray-400" />
        </div>
      </div>
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {filteredServices
                .filter((service) =>
                  service.description
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
                )
                .map((service) => (
                  <div
                    key={service.id_service}
                    className="bg-white rounded-lg shadow-lg"
                  >
                    <img
                      src={
                        categoryImages[
                        service.Category.categoryDescription.toLowerCase()
                        ]
                      }
                      alt={`Imagen de ${service.description}`}
                      className="img-pos"
                    />
                    <div className="p-3">
                      <h3 className="text-xl font-semibold">
                        {service.description}
                      </h3>
                      <h5 className="text-gray-600 text-lg lg:text-xl">
                        ${service.price}
                      </h5>
                      <button
                        className={`${isAddButtonDisabled
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
            {categoryId === 3 || categoryId === 4 ? ( //|| categoryId === 4 Solo para ver si jala
              <p className="text-3xl font-semibold text-center ">
                Piezas del Pedido:{" "}
                <span className="text-orange-600 inline-block">{pieces}</span>
              </p>
            ) : (
              ""
            )}
            <div className="card card-body mt-2">
              <h3 className="text-center border-b-2 text-lg border-gray-500 pb-2">
                <p className="font-bold">Cliente seleccionado:</p>{" "}
                <p className="text-xl font-bold text-IndigoDye">{clientName}</p>
              </h3>
              <ul className="divide-y divide-gray-300 mb-2">
                {cart.map((service) => (
                  <li
                    key={service.id_service}
                    className="py-2 flex items-center justify-between text-lg"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          categoryImages[
                          service.Category.categoryDescription.toLowerCase()
                          ]
                        }
                        alt={`Imagen de ${service.description}`}
                        className="h-16 w-16 object-cover rounded-lg mr-2"
                      />
                      {service.description} x {service.quantity} - $
                      {service.price * service.quantity}
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
                      onClick={() => removeFromCart(service.id_service)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex mt-4 justify-between text-lg">
                <div>
                  <strong>Subtotal:</strong> ${calculateSubtotal()}{" "}
                  {/*+ calculateProductTotal()*/}
                </div>
                {categoryId === 3 ? (
                  <div className="flex items-center ml-2 text-lg">
                    <BsFillLightningFill
                      className="text-yellow-500 mr-1"
                      fontSize={19}
                    />
                    <strong>Servicio Express</strong>
                    <input
                      type="checkbox"
                      className="ml-2 mt-1 h-4 w-4"
                      checked={isExpress}
                      onChange={handleOnChange}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={showModal}
                >
                  Guardar Compra
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>

                <Modal
                  title={`Guardar Compra para ${clientName}`}
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={[
                    <button
                      key="submit"
                      className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSave}
                      disabled={
                        serviceType === "autoservicio"
                          ? false
                          : !isDeliveryDateSelected || isSaved
                      }
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
                    <div>
                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Fecha de Recepcion:
                      </p>
                      <div style={{ fontSize: "16px" }}>
                        {purchaseDate.format("DD/MM/YYYY HH:mm:ss")}
                      </div>
                    </div>{" "}
                  </div>
                  {!shouldShowAllServices && serviceType !== "autoservicio" && (
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
                        onChange={(date) => {
                          setDeliveryDate(moment(date));
                          setIsDeliveryDateSelected(true);
                        }}
                        locale={es}
                        timeCaption="Hora"
                        minDate={moment().toDate()}
                        required
                        className="form-control border-black"
                      />
                      {!isDeliveryDateSelected && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          Seleccione una fecha por favor.
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Observaciones:
                    </p>
                    <textarea
                      className="notes"
                      placeholder="Añadir observaciones..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
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
                        {payMethod === 'credit' ?
                          (<p style={{ fontSize: "16px" }}>
                            Costo: ${service.priceCredit * service.quantity}
                          </p>)
                          : (<p style={{ fontSize: "16px" }}>
                            Costo: ${service.price * service.quantity}
                          </p>)}
                        <hr />
                      </div>
                    ))}
                  </div>

                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Subtotal:
                    </p>
                    <p style={{ fontSize: "16px" }}>
                      ${payMethod === 'credit' ? calculateSubtotalCredit() : calculateSubtotal()} {/**+ calculateProductTotal() */}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Seleccionar Forma de Pago:
                    </p>
                    <Select
                      style={{ width: "100%", fontSize: "16px" }}
                      onChange={(value) => {
                        setPayForm(value);
                        if (value === "advance") {
                          setPayMethod("cash");
                          setPayStatus("paid");
                        } else {
                          setPayMethod("");
                          setPayStatus("unpaid");
                        }
                      }}
                      value={
                        serviceType === "autoservicio" ||
                          serviceType === "tintoreria"
                          ? "advance"
                          : payForm
                      }
                      disabled={
                        serviceType === "autoservicio" ||
                        serviceType === "tintoreria"
                      }
                    >
                      <Option
                        value="delivery"
                        disabled={
                          serviceType === "autoservicio" ||
                          serviceType === "tintoreria"
                        }
                      >
                        A la Entrega
                      </Option>
                      <Option value="advance">Anticipado</Option>
                    </Select>
                    {(payForm === "advance" ||
                      serviceType === "autoservicio") && (
                        <div>
                          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                            Método de Pago Anticipado:
                          </p>
                          <Select
                            style={{ width: "100%", fontSize: "16px" }}
                            onChange={(value) => setPayMethod(value)}
                            value={payMethod}
                          >
                            <Option value="cash">Efectivo</Option>
                            <Option value="credit">Tarjeta</Option>
                          </Select>
                        </div>
                      )}
                  </div>
                </Modal>
              </div>
            </div>
            <Link
              to="/recepcionLavanderia"
              className="mt-2 flex text-center text-decoration-none"
            ></Link>
            {categoryId === 3 ? (
              <p className="text-2xl font-semibold text-center ">
                No. Maximo de Piezas:{" "}
                <span className="text-RedPantone">
                  {isExpress ? numberOfPieces : pieces + parseInt(numberOfPieces)} / {maxIronCapacity}
                </span>
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
