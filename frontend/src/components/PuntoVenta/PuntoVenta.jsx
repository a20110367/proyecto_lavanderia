import { useState } from "react";
// import data from "../../lib/constants/data";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import Axios from "axios";
import useSWR from "swr";
import { Link } from "react-router-dom";


const TicketPDF = ({ cart, subtotal }) => {

  return (
    <Document>
      <Page>
        <Text>Ticket de Compra</Text>
        <Text>Productos:</Text>
        {cart.map((service) => (
          <Text key={service.id_service}>
            {service.description} x {service.quantity} - ${service.price * service.quantity}
          </Text>
        ))}
        <Text>Subtotal: ${subtotal}</Text>
      </Page>
    </Document>
  );
};

export default function PuntoVenta() {

  const [cart, setCart] = useState([]);

  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/services");
    return response.data;
  };

  const { data } = useSWR("services", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const addToCart = (serviceId, service) => {
    // const serviceToAdd = data.products.find((service) => service.id === serviceId);
    const serviceToAdd = service
    console.log(serviceId)
    console.log(service.id_service)
    if (serviceToAdd) {
      const existingService = cart.find((item) => item.id_service === serviceId);
      console.log(cart)
      if (existingService) {
        const updatedCart = cart.map((item) =>
          item.id_service === serviceId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...serviceToAdd, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (serviceId) => {
    const updatedCart = cart.map((item) => {
        if (item.quantity > 0) {
          return item.id_service === serviceId ? { ...item, quantity: item.quantity - 1 } : item
        }else{
          return item
        }
      }
    )
    // item.id_service === serviceId ? { ...item, quantity: item.quantity - 1 } : item
    // const updatedCart = cart.filter((item) => item.id_service !== serviceId);
    // const updatedCart = cart.map((item) =>
    //   item.id_service === serviceId ? { ...item, quantity: item.quantity - 1 } : item
    // );
    setCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <div className="w-full bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
        <strong>Lista de Servicios</strong>
      </div>
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((service) => (
                <div key={service.id_service} className="bg-white rounded-lg shadow-lg">
                  <img
                    // src={service.image}
                    alt={`Imagen de ${service.description}`}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{service.description}</h3>
                    <h5 className="text-gray-600">${service.price}</h5>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                      onClick={() => addToCart(service.id_service, service)}
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
              <h3 className="text-center border-b-2 border-gray-500 pb-2">Orden de compra</h3>
              <ul className="divide-y divide-gray-300">
                {cart.map((service) => (
                  <li key={service.id_service} className="py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        // src={product.image}
                        alt={`Imagen de ${service.description}`}
                        className="h-16 w-16 object-cover rounded-lg mr-4"
                      />
                      {service.description} x {service.quantity} - ${service.price * service.quantity}
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
                  onClick={() => {

                    console.log("Compra guardada");
                  }}
                >
                  Guardar Compra
                </button>
                <PDFDownloadLink
                  document={<TicketPDF cart={cart} subtotal={calculateSubtotal()} />}
                  fileName="ticket_compra.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Cargando..." : (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Generar Ticket
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
