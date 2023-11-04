import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import { useAuth } from "../../hooks/auth/auth";
import Axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai"


function CorteCaja() {
  const [Cortes, setCortes] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [corteActivo, setCorteActivo] = useState(false);


  const { cookies } = useAuth();
  const [turno, setTurno] = useState("Matutino");
  const [initialCash, setInitialCash] = useState(localStorage.getItem('initialCash'))
  const [cashCutId, setCashCutId] = useState(0)
  const [lastCashCut, setLastCashCut] = useState(JSON.parse(localStorage.getItem('lastCashCut')));

  useEffect(() => {
    setCashCutId(localStorage.getItem('cashCutId'))
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setFechaHora(formattedDate);
  }, []);

  useEffect(() => {
    if (lastCashCut) {
      setCorteActivo(true);
      // const currentCorte = Cortes.find((corte) =>
      //   moment(corte.cashCutD).isSame(now, "day")
      // );

      // if (currentCorte) {
      //   setCortes([currentCorte]);
      //   setMostrarTabla(true);
      // }
      setCortes([lastCashCut]);
      setMostrarTabla(true);
    }
  }, [lastCashCut]);

  const handleCorteCaja = () => {
    if (corteActivo) {
      message.info("Ya hay un corte de caja activo.");
    } else {
      setDialogVisible(true);
    }
  };



  /* ------------------------------ FULL CASHCUT ------------------------------------*/

  const handleConfirmCorteCaja = async () => {
    const now = new Date();
    const horaActual = now.getHours();

    setTurno(horaActual < 12 ? "Matutino" : "Vespertino")

    const response = await Axios.get(`http://localhost:5000/closeCashCut/${cashCutId}`)

    const nuevoCorte = response.data

    const pdf = new jsPDF();

    pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
    pdf.text(`ID: ${cashCutId}`, 10, 20);
    pdf.text(`Usuario: ${cookies.username}`, 10, 30);
    pdf.text(`Turno: ${turno}`, 10, 40);
    pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
    pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60);
    //Separación
    pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
    nuevoCorte.toalAutoservicio ? pdf.text(`Autoservicio: $${nuevoCorte.toalAutoservicio}`, 10, 90) : pdf.text("Autoservicio: $0", 10, 90)
    nuevoCorte.totalEncargo ? pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100) : pdf.text("Lavado por Encargo: $0", 10, 100)
    nuevoCorte.totalPlanchado ? pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110) : pdf.text("Planchado: $0", 10, 110)
    pdf.text(`Total (Suma de los Servicios): $${nuevoCorte.totalIncome}`, 10, 120);
    nuevoCorte.totalCash ? pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 130) : pdf.text("Ingreso en Efectivo: $0", 10, 130)
    nuevoCorte.totalCredit ? pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 150) : pdf.text("Ingreso en Tarjeta: $0", 10, 150)
    //Separación
    pdf.text(`Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`, 10, 160);
    pdf.text(`Final Total en Caja: $${nuevoCorte.total}`, 10, 170);
    pdf.save(`corte_de_caja_Turno_${cookies.username}.pdf`);

    localStorage.setItem('lastCashCut', JSON.stringify(nuevoCorte))
    setLastCashCut(nuevoCorte)
    setCortes([nuevoCorte]);
    setMostrarTabla(true); // Muestra la tabla después de hacer el corte

    setDialogVisible(false);
  };

  const handleDetallesClick = (corte) => {
    setSelectedCorte(corte);
    setModalVisible(true);
  };

  const handlePartialCorteCaja = () => {
    setPartialCorteDialogVisible(true);
  };

  /* ------------------------------ PARTIAL CASHCUT ------------------------------------*/

  const handlePartialCorteConfirm = async () => {
    const now = new Date();
    const horaActual = now.getHours();

    setTurno(horaActual < 12 ? "Matutino" : "Vespertino")

    const response = await Axios.get(`http://localhost:5000/calculateCashCut/${cashCutId}`);

    const nuevoCorte = response.data

    const pdf = new jsPDF();
    pdf.text(`CORTE DE CAJA PARCIAL  `, 10, 10);
    pdf.text(`ID: ${cashCutId}`, 10, 20);
    pdf.text(`Usuario: ${cookies.username}`, 10, 30);
    pdf.text(`Turno: ${turno}`, 10, 40);
    pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
    initialCash ? pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60) : pdf.text("Dinero en Fondo: $0", 10, 90)
      
    // Separación
    pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
    nuevoCorte.toalAutoservicio ? pdf.text(`Autoservicio: $${nuevoCorte.toalAutoservicio}`, 10, 90) : pdf.text("Autoservicio: $0", 10, 90)
    nuevoCorte.totalEncargo ? pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100) : pdf.text("Lavado por Encargo: $0", 10, 100)
    nuevoCorte.totalPlanchado ? pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110) : pdf.text("Planchado: $0", 10, 110)
    nuevoCorte.totalIncome ? pdf.text(`Total (Suma de los Servicios): $${nuevoCorte.totalIncome}`,10,120) : pdf.text("Total (Suma de los Servicios): $0", 10, 120)
    // Separación
    nuevoCorte.totalCash ? pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 140) : pdf.text("Ingreso en Efectivo: $0", 10, 140)
    nuevoCorte.totalCredit ? pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 150) : pdf.text("Ingreso en Tarjeta: $0", 10, 150)
    nuevoCorte.totalCashWithdrawal ? pdf.text(`Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`, 10, 160) : pdf.text("Retiros Totales: $0", 10, 160)
    nuevoCorte.total ? pdf.text(`Final Total en Caja: $${nuevoCorte.total}`, 10, 170) : pdf.text("Final Total en Caja: $0", 10, 170)
    pdf.save(`corte_de_caja_Turno_${cookies.username}.pdf`);

    localStorage.setItem('lastCashCut', JSON.stringify(nuevoCorte))
    localStorage.removeItem('initialCash')
    setLastCashCut(nuevoCorte)
    console.log(lastCashCut)
    setCortes([nuevoCorte]);
    setPartialCorteDialogVisible(false);
  };

  const handleModalPrint = () => {
    const pdf = new jsPDF();

    if (selectedCorte) {
      pdf.text(`Detalles del Corte`, 10, 10);
      pdf.text(`ID: ${cashCutId}`, 10, 20);
      pdf.text(`Usuario: ${cookies.username}`, 10, 30);
      pdf.text(`Turno: ${turno}`, 10, 40);
      pdf.text(`Fecha: ${formatDateToGMTMinus6(selectedCorte.cashCutD)}`,10,50);
      initialCash ? pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60) : pdf.text("Dinero en Fondo: $0", 10, 90)
      
      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      selectedCorte.toalAutoservicio ? pdf.text(`Autoservicio: $${selectedCorte.toalAutoservicio}`, 10, 90) : pdf.text("Autoservicio: $0", 10, 90)
      selectedCorte.totalEncargo ? pdf.text(`Lavado por Encargo: $${selectedCorte.totalEncargo}`, 10, 100) : pdf.text("Lavado por Encargo: $0", 10, 100)
      selectedCorte.totalPlanchado ? pdf.text(`Planchado: $${selectedCorte.totalPlanchado}`, 10, 110) : pdf.text("Planchado: $0", 10, 110)
      selectedCorte.totalIncome ? pdf.text(`Total (Suma de los Servicios): $${selectedCorte.totalIncome}`,10,120) : pdf.text("Total (Suma de los Servicios): $0", 10, 120)
      // Separación
      selectedCorte.totalCash ? pdf.text(`Ingreso en Efectivo: $${selectedCorte.totalCash}`, 10, 140) : pdf.text("Ingreso en Efectivo: $0", 10, 140)
      selectedCorte.totalCredit ? pdf.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 150) : pdf.text("Ingreso en Tarjeta: $0", 10, 150)
      selectedCorte.totalCashWithdrawal ? pdf.text(`Retiros Totales: $${selectedCorte.totalCashWithdrawal}`, 10, 160) : pdf.text("Retiros Totales: $0", 10, 160)
      selectedCorte.total ? pdf.text(`Final Total en Caja: $${selectedCorte.total}`, 10, 170) : pdf.text("Final Total en Caja: $0", 10, 170)    
      pdf.save("detalle_corte.pdf");
    }
  };

  const formatDateToGMTMinus6 = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() - 6);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  return (
    <div className="text-center mt-4">
      <h1 className="text-4xl">
        Bienvenido a corte de caja{" "}
        {cookies.role === "admin" ? "Administrador:" : "Empleado:"}{" "}
        <span className="title-strong text-4xl">{cookies.username}</span>
      </h1>
      <p className="text-2xl">{fechaHora}</p>
      <p className="text-xl mt-4">¿Desea realizar un corte de caja?</p>
      <button
        onClick={handleCorteCaja}
        className="mt-4 mr-2 bg-IndigoDye font-bold text-white p-3 rounded-md shadow-lg hover:bg-PennBlue hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-base"
      >
        Corte de Caja Turno
      </button>
      <button
        onClick={handlePartialCorteCaja}
        className="mt-4 bg-NonPhotoblue font-bold hover:text-white p-3 rounded-md shadow-lg hover:bg-Cerulean hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-base"
      >
        Corte de Caja Parcial
      </button>
      {mostrarTabla && (
        <div className="mt-4" style={{ overflowX: "auto" }}>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th>No. Corte</th>
                <th>FECHA</th>
                <th>DINERO EN FONDO</th>
                <th>INGRESO EN EFECTIVO</th>
                <th>INGRESO EN TARJETA</th>
                <th>INGRESOS TOTALES</th>
                <th>RETIROS TOTALES</th>
                <th>FINAL TOTAL CAJA</th>
              </tr>
            </thead>
            {/* TOTAL INCOME = (totalCash + totalCredit) - totalCashWithdrawal*/}
            <tbody>
              {Cortes.map((corte) => (
                <tr className="bg-white border-b" key={corte.id_cashCut}>
                  <td className="py-3 px-1 text-center">{corte.id_cashCut}</td>
                  <td className="py-3 px-6">{formatDateToGMTMinus6(corte.cashCutD)}</td>
                  <td className="py-3 px-6">${initialCash ? initialCash : 0}</td>
                  <td className="py-3 px-6">${corte.totalCash ? corte.totalCash : 0}</td>
                  <td className="py-3 px-6">${corte.totalCredit ? corte.totalCredit : 0}</td>
                  <td className="py-3 px-6">${corte.totalIncome ? corte.totalIncome : 0}</td>
                  <td className="py-3 px-6">${corte.totalCashWithdrawal ? corte.totalCashWithdrawal : 0}</td>
                  <td className="py-3 px-6">${corte.total ? corte.total : 0}</td>
                  <td className="py-3 px-6">
                    <button
                      className="btn-primary"
                      onClick={() => handleDetallesClick(corte)}
                    >
                      <AiOutlinePlusCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        title="Confirmar Corte de Caja Turno"
        open={dialogVisible}
        onOk={handleConfirmCorteCaja}
        onCancel={() => setDialogVisible(false)}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCorteCaja}
            className="btn-print text-white"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setDialogVisible(false)}
            className="btn-cancel-modal text-white"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de caja de turno?</p>
      </Modal>
      <Modal
        title="Confirmar Corte de Caja Parcial"
        open={partialCorteDialogVisible}
        onOk={handlePartialCorteConfirm}
        onCancel={() => setPartialCorteDialogVisible(false)}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handlePartialCorteConfirm}
            className="btn-print text-white"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setPartialCorteDialogVisible(false)}
            className="btn-cancel-modal text-white"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de caja parcial?</p>
      </Modal>
      <Modal
        title="Detalles del Corte"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={[
          <Button
            key="print"
            onClick={handleModalPrint}
            className="btn-print"
          >
            Imprimir
          </Button>,
          <Button
            key="close"
            onClick={() => setModalVisible(false)}
            className="btn-cancel-modal"
          >
            Cerrar
          </Button>,
        ]}
      >
        {selectedCorte && (
          <div>
            <div className="flex">
              <div className="w-1/2">
                <p className="text-lg">
                  <span className="font-bold">ID:</span> {cashCutId}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Usuario:</span>{" "}{cookies.username}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Turno:</span>{" "}{turno}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Fecha:</span>{" "}{formatDateToGMTMinus6(selectedCorte.cashCutD)}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Dinero en Fondo:</span> ${initialCash}
                </p>
              </div>
              <div className="w-1/2">
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Efectivo:</span> ${ selectedCorte.totalCash ? selectedCorte.totalCash : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Tarjeta:</span> ${ selectedCorte.totalCredit ? selectedCorte.totalCredit : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Retiros Totales:</span> ${selectedCorte.totalCashWithdrawal ? selectedCorte.totalCashWithdrawal : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Final Total en Caja:</span> ${ selectedCorte.total ? selectedCorte.total: 0}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mt-4">
                Detalles de Ingresos por Servicio:
              </h3>
              <p className="text-lg">
                <span className="font-bold">Autoservicio:</span> ${ selectedCorte.toalAutoservicio ? selectedCorte.toalAutoservicio : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Lavado por Encargo:</span> ${selectedCorte.totalPlanchado ? selectedCorte.totalEncargo : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Planchado:</span> ${ selectedCorte.totalPlanchado ? selectedCorte.totalPlanchado : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">
                  Total (Suma de los Servicios):
                </span>{" "} ${ selectedCorte.totalIncome ? selectedCorte.totalIncome : 0}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CorteCaja;
