import React, { useState } from "react";
import data from "../../lib/constants/data";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";

const TicketPDF = ({ cart, subtotal }) => {
  return (
    <Document>
      <Page>
        <Text>Ticket de Compra</Text>
        <Text>Productos:</Text>
        {cart.map((product) => (
          <Text key={product.id}>
            {product.name} x {product.quantity} - ${product.precio * product.quantity}
          </Text>
        ))}
        <Text>Subtotal: ${subtotal}</Text>
      </Page>
    </Document>
  );
};

export default function PuntoVenta() {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    const productToAdd = data.products.find((product) => product.id === productId);
    if (productToAdd) {
      const existingProduct = cart.find((item) => item.id === productId);
      if (existingProduct) {
        const updatedCart = cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  };

  return (
    <div>
      <div className="w-full bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
        <strong>Lista de servicios</strong>
      </div>
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg">
                  <img
                    src={product.image}
                    alt={`Imagen de ${product.name}`}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <h5 className="text-gray-600">${product.precio}</h5>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                      onClick={() => addToCart(product.id)}
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
                {cart.map((product) => (
                  <li key={product.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={`Imagen de ${product.name}`}
                        className="h-16 w-16 object-cover rounded-lg mr-4"
                      />
                      {product.name} x {product.quantity} - ${product.precio * product.quantity}
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeFromCart(product.id)}
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
