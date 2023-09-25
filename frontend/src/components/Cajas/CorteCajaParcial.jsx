import jsPDF from "jspdf";
import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";

function CorteCajaParcial() {
  const [visible, setVisible] = useState(false);
  const [nombreAdmin, setNombreAdmin] = useState(" SOY ADMIN"); 
  const [fechaHora, setFechaHora] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

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
      monto: 100, 
      usuario: "Usuario1", 
      motivo: "Motivo del corte", 
    };

    
    const pdf = new jsPDF();
    pdf.text(`Corte de Caja Parcial - ${nombreAdmin}`, 10, 10);
    pdf.text(`Fecha y Hora: ${fechaHora}`, 10, 20);
    pdf.text(`Monto: ${nuevoCorte.monto}`, 10, 30);
    pdf.text(`Usuario: ${nuevoCorte.usuario}`, 10, 40);
    pdf.text(`Motivo: ${nuevoCorte.motivo}`, 10, 50);
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
