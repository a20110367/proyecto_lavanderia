import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";

function CorteCajaParcial() {
  const [visible, setVisible] = useState(false);
  const [nombreAdmin, setNombreAdmin] = useState(" SOY ADMIN"); 
  const [fechaHora, setFechaHora] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dineroFondo, setDineroFondo] = useState(1500); 
  const [retirosTotales, setRetirosTotales] = useState(200); 
  const [ingresoEfectivo, setIngresoEfectivo] = useState(1200); 
  const [ingresoTarjeta, setIngresoTarjeta] = useState(600); 

  const ingresosTotales = ingresoEfectivo + ingresoTarjeta;
  const finalTotalCaja = dineroFondo + ingresosTotales - retirosTotales;
  const [tiposServicios, setTiposServicios] = useState("Lavados, Planchados, Autoservicios"); 


  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setFechaHora(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCorteCaja = () => {
    setDialogVisible(true);
  };

  const handleConfirmCorteCaja = () => {
    const nuevoCorte = {
      fecha: fechaHora,
      dineroFondo,
      retirosTotales,
      ingresosTotales,
      ingresoEfectivo,
      ingresoTarjeta,
      finalTotalCaja,
      tiposServicios,
      usuario: "Usuario1",
    };

    const pdf = new jsPDF();
    pdf.text(`Corte de Caja Parcial - ${nombreAdmin}`, 10, 10);
    pdf.text(`Fecha y Hora: ${nuevoCorte.fecha}`, 10, 20);
    pdf.text(`Dinero de Fondo: ${nuevoCorte.dineroFondo}`, 10, 30);
    pdf.text(`Retiros Totales: ${nuevoCorte.retirosTotales}`, 10, 40);
    pdf.text(`Ingresos Totales: ${nuevoCorte.ingresosTotales}`, 10, 50);
    pdf.text(`Ingreso Total en Efectivo: ${nuevoCorte.ingresoEfectivo}`, 10, 60);
    pdf.text(`Ingreso Total con Tarjeta: ${nuevoCorte.ingresoTarjeta}`, 10, 70);
    pdf.text(`Final Total de la Caja: ${nuevoCorte.finalTotalCaja}`, 10, 80);
    pdf.text(`Debería Haber: ${nuevoCorte.deberiaHaber}`, 10, 90);
    pdf.text(` Tipos de Servicios: ${nuevoCorte.tiposServicios}`, 10, 100);
    pdf.text(`Usuario: ${nuevoCorte.usuario}`, 10, 110);
    pdf.text(`Fecha y Hora: ${fechaHora}`, 10, 120);
    pdf.save("corte_de_caja_parcial.pdf");

    setDialogVisible(false);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div className="text-center mt-4">
      <h1 className="text-4xl">BIENVENIDO {nombreAdmin}</h1>
      <p className="text-2xl">{fechaHora}</p>
      <p className="text-xl mt-4">¿Desea realizar un corte de caja parcial?</p>
      <button
        onClick={handleCorteCaja}
        className="mt-4 bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
      >
        Corte de Caja Parcial
      </button>
      <Modal
        title="Confirmar Corte de Caja Parcial"
        visible={dialogVisible}
        onOk={handleConfirmCorteCaja}
        onCancel={handleCloseDialog}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCorteCaja}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={handleCloseDialog}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de caja parcial?</p>
      </Modal>
    </div>
  );
}

export default CorteCajaParcial;
