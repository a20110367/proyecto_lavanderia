import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import useSWR from "swr";
import moment from "moment";
import jsPDF from "jspdf";
import { useAuth } from "../../hooks/auth/auth";
import Axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai"


function CorteCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);

  const { cookies } = useAuth();
  const [turno, setTurno] = useState("Matutino");
  const [totalServices, setTotalServices] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [cashCutId, setCashCutId] = useState(localStorage.getItem(0))
  const [cashCut, setCashCut] = useState(localStorage.getItem('lastCashCut'));

  useEffect(() => {
    setCashCutId(localStorage.getItem('cashCutId'))
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setFechaHora(formattedDate);
  }, []);

  useEffect(() => {
    if (cashCut) {
      const now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      const currentCorte = cashCut.find((corte) =>
        moment(corte.cashCutD).isSame(now, "day")
      );

      if (currentCorte) {
        setCortes([currentCorte]);
        setMostrarTabla(true);
      }
    }
  }, [cashCut]);

  const handleCorteCaja = () => {
    setDialogVisible(true);
  };

  /* ------------------------------ FULL CASHCUT ------------------------------------*/

  const handleConfirmCorteCaja = () => {
    const now = new Date();
    const horaActual = now.getHours();

    setTurno(horaActual < 12 ? "Matutino" : "Vespertino")

    const nuevoCorte = Axios.get(`http://localhost:5000/closeCashCut/${cashCutId}`)
    
    console.log(nuevoCorte)

    const pdf = new jsPDF();

    pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
    pdf.text(`ID: ${cashCutId}`, 10, 20);
    pdf.text(`Usuario: ${turno}`, 10, 30);
    pdf.text(`Turno: ${turno}`, 10, 40);
    pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
    pdf.text(`Dinero en Fondo: $${nuevoCorte.total}`, 10, 60);
    //Separación
    pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
    pdf.text(`Autoservicio: $${nuevoCorte.toalAutoservicio}`, 10, 90);
    pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100);
    pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110);
    setTotalServices(nuevoCorte.toalAutoservicio + nuevoCorte.totalEncargo + nuevoCorte.totalPlanchado)
    pdf.text(`Total (Suma de los Servicios): $${totalServices}}`,10,120);
    pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 130);
    //Separación
    pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 150);
    pdf.text(`Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`, 10, 160);
    setTotalIncome(nuevoCorte.inicialCash + totalServices + nuevoCorte.totalCredit + nuevoCorte.totalCash - nuevoCorte.totalCashWithdrawal)
    pdf.text(`Final Total en Caja: $${totalIncome}`, 10, 170);
    pdf.save(`corte_de_caja_Turno_${turno}.pdf`);


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

  const handlePartialCorteConfirm = () => {
    const now = new Date();
    const horaActual = now.getHours();

    setTurno(horaActual < 12 ? "Matutino" : "Vespertino")

    const nuevoCorte = Axios.get(`http://localhost:5000/calculateCashCut/${cashCutId}`);

    const pdf = new jsPDF();
    pdf.text(`CORTE DE CAJA PARCIAL  `, 10, 10);
    pdf.text(`ID: ${cashCutId}`, 10, 20);
    pdf.text(`Usuario: ${turno}`, 10, 30);
    pdf.text(`Turno: ${turno}`, 10, 40);
    pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
    pdf.text(`Dinero en Fondo: $${nuevoCorte.inicialCash}`, 10, 60);
    // Separación
    pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
    pdf.text(`Autoservicio: $${nuevoCorte.toalAutoservicio}`, 10, 90);
    pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100);
    pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110);
    setTotalServices(nuevoCorte.toalAutoservicio + nuevoCorte.totalEncargo + nuevoCorte.totalPlanchado)
    pdf.text(`Total (Suma de los Servicios): $${totalServices}`,10,120);
    pdf.text(`Ingreso en Efectivo: $${nuevoCorte.ingresoEfectivo}`, 10, 130);
    // Separación
    pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.ingresoTarjeta}`, 10, 150);
    pdf.text(`Retiros Totales: $${nuevoCorte.retirosTotales}`, 10, 160);
    setTotalIncome(nuevoCorte.inicialCash + totalServices + nuevoCorte.totalCredit + nuevoCorte.totalCash - nuevoCorte.totalCashWithdrawal)
    pdf.text(`Final Total en Caja: $${totalIncome}`, 10, 170);
    pdf.save(`corte_de_caja_Turno_${turno}.pdf`);


    setCortes([nuevoCorte]);
    setPartialCorteDialogVisible(false);
  };

  const handleModalPrint = () => {
    const doc = new jsPDF();

    if (selectedCorte) {
      doc.text(`Detalles del Corte`, 10, 10);
      doc.text(`ID: ${selectedCorte.id_cashCut}`, 10, 20);
      doc.text(`Usuario: ${selectedCorte.user.name}`, 10, 30);
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 40);
      doc.text(
        `Fecha: ${formatDate(selectedCorte.cashCutD)}`,
        10,
        50
      );
      doc.text(`Dinero en Fondo: $${selectedCorte.inicialCash}`, 10, 60);

      // Separación
      doc.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      doc.text(`Autoservicio: $${selectedCorte.toalAutoservicio}`, 10, 90);
      doc.text(
        `Lavado por Encargo: $${selectedCorte.totalEncargo}`,
        10,
        100
      );
      doc.text(`Planchado: $${selectedCorte.totalPlanchado}`, 10, 110);
      doc.text(
        `Total (Suma de los Servicios): $${selectedCorte.totalEncargo + selectedCorte.toalAutoservicio + selectedCorte.totalPlanchado}`,
        10,
        120
      );
      doc.text(
        `Ingreso en Efectivo: $${selectedCorte.totalCash}`,
        10,
        130
      );

      // Separación
      doc.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 150);
      doc.text(`Retiros Totales: $${selectedCorte.totalCashWithdrawal}`, 10, 160);
      doc.text(
        `Final Total en Caja: $${totalIncome}`,
        10,
        170
      );

      doc.save("detalle_corte.pdf");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
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
                  <td className="py-3 px-6">{formatDate(corte.cashCutD)}</td>
                  <td className="py-3 px-6">${corte.inicialCash}</td>
                  <td className="py-3 px-6">${corte.totalCash}</td>
                  <td className="py-3 px-6">${corte.totalCredit}</td>
                  <td className="py-3 px-6">${totalServices}</td>
                  <td className="py-3 px-6">${corte.totalCashWithdrawal}</td>
                  <td className="py-3 px-6">${totalIncome}</td>
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
                  <span className="font-bold">ID:</span> {selectedCorte.id_cashCut}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Usuario:</span>{" "}
                  {selectedCorte.user.name}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Turno:</span>{" "}
                  {selectedCorte.turno}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Fecha:</span>{" "}
                  {formatDate(selectedCorte.cashCutD)}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Dinero en Fondo:</span> $
                  {selectedCorte.inicialCash}
                </p>
              </div>
              <div className="w-1/2">
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Efectivo:</span> $
                  {selectedCorte.totalCash}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Tarjeta:</span> $
                  {selectedCorte.totalCredit}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Retiros Totales:</span> $
                  {selectedCorte.totalCashWithdrawal}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Final Total en Caja:</span> $
                  {totalIncome}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mt-4">
                Detalles de Ingresos por Servicio:
              </h3>
              <p className="text-lg">
                <span className="font-bold">Autoservicio:</span> $
                {selectedCorte.toalAutoservicio}
              </p>
              <p className="text-lg">
                <span className="font-bold">Lavado por Encargo:</span> $
                {selectedCorte.totalEncargo}
              </p>
              <p className="text-lg">
                <span className="font-bold">Planchado:</span> $
                {selectedCorte.totalPlanchado}
              </p>
              <p className="text-lg">
                <span className="font-bold">
                  Total (Suma de los Servicios):
                </span>{" "}
                ${selectedCorte.totalEncargo + selectedCorte.toalAutoservicio + selectedCorte.totalPlanchado}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CorteCaja;
