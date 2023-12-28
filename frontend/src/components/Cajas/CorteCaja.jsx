import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import jsPDF from "jspdf";
import { useAuth } from "../../hooks/auth/auth";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { formatDate } from "../../utils/format";
import Swal from "sweetalert2";
import api from "../../api/api";

function CorteCaja() {
  const [Cortes, setCortes] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [workShift, setWorkShift] = useState(
    moment().hours() < 12 ? "moringn" : "evening"
  );
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] =
    useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [corteActivo, setCorteActivo] = useState(false);
  const navigate = useNavigate();

  const { cookies } = useAuth();

  const [initialCash, setInitialCash] = useState(
    localStorage.getItem("initialCash")
  );
  const [cashCutId, setCashCutId] = useState(0);
  const [lastCashCut, setLastCashCut] = useState(
    JSON.parse(localStorage.getItem("lastCashCut"))
  );

  useEffect(() => {
    setCashCutId(localStorage.getItem("cashCutId"));
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
    if (localStorage.getItem("lastCashCut")) {
      Swal.fire({
        icon: "error",
        title: "Ya has Cerrado Caja",
        text: "Intenta ir a Historial de Cortes para volver a imprimir el corte del dia que estabas buscando.",
        confirmButtonColor: "#034078",
      });
      setPartialCorteDialogVisible(false);
      return;
    } else if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No se ha Inicializado Caja",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      setPartialCorteDialogVisible(false);
      navigate("/inicioCaja");
      return;
    }

    try {
      const now = new Date();
      const horaActual = now.getHours();


      setWorkShift(moment().hours() < 12 ? "morning" : "evening");

      const response = await api.get(`/closeCashCut/${cashCutId}`);

      const corte = response.data;

      const nuevoCorte = {
        ...corte,
        id_cashCut: parseInt(localStorage.getItem("cashCutId")),
      };

      const pdf = new jsPDF();

      pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
      pdf.text(`ID: ${nuevoCorte.id_cashCut}`, 10, 20);
      pdf.text(`Usuario: ${cookies.username}`, 10, 30);
      pdf.text(
        `Turno: ${
          nuevoCorte.workShift === "morning"
            ? "Matutino"
            : nuevoCorte.workShift === "evening"
            ? "Vespertino"
            : "Nocturno"
        }`,
        10,
        40
      );
      pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
      pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60);
      //Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      nuevoCorte.totalAutoservicio
        ? pdf.text(`Autoservicio: $${nuevoCorte.totalAutoservicio}`, 10, 90)
        : pdf.text("Autoservicio: $0", 10, 90);
      nuevoCorte.totalEncargo
        ? pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100)
        : pdf.text("Lavado por Encargo: $0", 10, 100);
      nuevoCorte.totalPlanchado
        ? pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110)
        : pdf.text("Planchado: $0", 10, 110);
      pdf.text(
        `Total (Suma de los Servicios): $${nuevoCorte.totalIncome}`,
        10,
        120
      );
      nuevoCorte.totalCash
        ? pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 130)
        : pdf.text("Ingreso en Efectivo: $0", 10, 130);
      nuevoCorte.totalCredit
        ? pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 150)
        : pdf.text("Ingreso en Tarjeta: $0", 10, 150);
      //Separación
      pdf.text(`Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`, 10, 160);
      pdf.text(`Final Total en Caja: $${nuevoCorte.total}`, 10, 170);
      pdf.save(`corte_de_caja_Turno_${cookies.username}.pdf`);

      setLastCashCut(nuevoCorte);
      setCortes([nuevoCorte]);

      localStorage.setItem("lastCashCut", JSON.stringify(nuevoCorte));
      localStorage.removeItem("initialCash");
      localStorage.removeItem("cashCutId");
      setMostrarTabla(true); // Muestra la tabla después de hacer el corte

      setDialogVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDetallesClick = (corte) => {
    setSelectedCorte(corte);
    setModalVisible(true);
    console.log(corte);
  };

  const handlePartialCorteCaja = () => {
    setPartialCorteDialogVisible(true);
  };

  /* ------------------------------ PARTIAL CASHCUT ------------------------------------*/

  const handlePartialCorteConfirm = async () => {
    if (localStorage.getItem("lastCashCut")) {
      Swal.fire({
        icon: "error",
        title: "Ya has Cerrado Caja",
        text: "Intenta ir a Historial de Cortes para volver a imprimir el corte del dia que estabas buscando.",
        confirmButtonColor: "#034078",
      });
      setPartialCorteDialogVisible(false);
      return;
    } else if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No se ha Inicializado Caja",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      setPartialCorteDialogVisible(false);
      navigate("/inicioCaja");
      return;
    }

    try {
      const now = new Date();
      const horaActual = now.getHours();

      setWorkShift(moment().hours() < 12 ? "morning" : "evening");

      const response = await api.get(`/calculateCashCut/${cashCutId}`);

      const corte = response.data;

      const nuevoCorte = {
        ...corte,
        id_cashCut: parseInt(localStorage.getItem("cashCutId")),
      };

      const pdf = new jsPDF();
      pdf.text(`CORTE DE CAJA PARCIAL  `, 10, 10);
      pdf.text(`ID: ${nuevoCorte.id_cashCut}`, 10, 20);
      pdf.text(`Usuario: ${cookies.username}`, 10, 30);
      pdf.text(
        `Turno: ${
          nuevoCorte.workShift === "morning"
            ? "Matutino"
            : nuevoCorte.workShift === "evening"
            ? "Vespertino"
            : "Nocturno"
        }`,
        10,
        40
      );
      pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
      initialCash
        ? pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60)
        : pdf.text("Dinero en Fondo: $0", 10, 90);

      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      nuevoCorte.totalAutoservicio
        ? pdf.text(`Autoservicio: $${nuevoCorte.totalAutoservicio}`, 10, 90)
        : pdf.text("Autoservicio: $0", 10, 90);
      nuevoCorte.totalEncargo
        ? pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 100)
        : pdf.text("Lavado por Encargo: $0", 10, 100);
      nuevoCorte.totalPlanchado
        ? pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 110)
        : pdf.text("Planchado: $0", 10, 110);
      nuevoCorte.totalIncome
        ? pdf.text(
            `Total (Suma de los Servicios): $${nuevoCorte.totalIncome}`,
            10,
            120
          )
        : pdf.text("Total (Suma de los Servicios): $0", 10, 120);
      // Separación
      nuevoCorte.totalCash
        ? pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 140)
        : pdf.text("Ingreso en Efectivo: $0", 10, 140);
      nuevoCorte.totalCredit
        ? pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 150)
        : pdf.text("Ingreso en Tarjeta: $0", 10, 150);
      nuevoCorte.totalCashWithdrawal
        ? pdf.text(
            `Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`,
            10,
            160
          )
        : pdf.text("Retiros Totales: $0", 10, 160);
      nuevoCorte.total
        ? pdf.text(`Final Total en Caja: $${nuevoCorte.total}`, 10, 170)
        : pdf.text("Final Total en Caja: $0", 10, 170);
      pdf.save(`corte_de_caja_Turno_${cookies.username}.pdf`);

      setCortes([nuevoCorte]);
      setPartialCorteDialogVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalPrint = () => {
    const pdf = new jsPDF();

    if (selectedCorte) {
      pdf.text(`Detalles del Corte`, 10, 10);
      pdf.text(`ID: ${selectedCorte.id_cashCut}`, 10, 20);
      pdf.text(`Usuario: ${cookies.username}`, 10, 30);
      pdf.text(
        `Turno: ${
          selectedCorte.workShift === "morning"
            ? "Matutino"
            : selectedCorte.workShift === "evening"
            ? "Vespertino"
            : "Nocturno"
        }`,
        10,
        40
      );
      pdf.text(`Fecha: ${formatDate(selectedCorte.cashCutD)}`, 10, 50);
      initialCash
        ? pdf.text(`Dinero en Fondo: $${initialCash}`, 10, 60)
        : pdf.text("Dinero en Fondo: $0", 10, 60);

      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      selectedCorte.totalAutoservicio
        ? pdf.text(`Autoservicio: $${selectedCorte.totalAutoservicio}`, 10, 90)
        : pdf.text("Autoservicio: $0", 10, 90);
      selectedCorte.totalEncargo
        ? pdf.text(
            `Lavado por Encargo: $${selectedCorte.totalEncargo}`,
            10,
            100
          )
        : pdf.text("Lavado por Encargo: $0", 10, 100);
      selectedCorte.totalPlanchado
        ? pdf.text(`Planchado: $${selectedCorte.totalPlanchado}`, 10, 110)
        : pdf.text("Planchado: $0", 10, 110);

      selectedCorte.totalTintoreria
        ? pdf.text(`Tintorería: $${selectedCorte.totalTintoreria}`, 10, 120)
        : pdf.text("Tintorería: $0", 10, 120);

      selectedCorte.totalOtrosEncargo
        ? pdf.text(
            `Encargo Varios: $${selectedCorte.totalOtrosEncargo}`,
            10,
            130
          )
        : pdf.text("Encargo Varios: $0", 10, 130);

      selectedCorte.totalIncome
        ? pdf.text(
            `Total (Suma de los Servicios): $${selectedCorte.totalIncome}`,
            10,
            140
          )
        : pdf.text("Total (Suma de los Servicios): $0", 10, 140);
      // Separación
      selectedCorte.totalCash
        ? pdf.text(`Ingreso en Efectivo: $${selectedCorte.totalCash}`, 10, 160)
        : pdf.text("Ingreso en Efectivo: $0", 10, 160);
      selectedCorte.totalCredit
        ? pdf.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 170)
        : pdf.text("Ingreso en Tarjeta: $0", 10, 170);
      selectedCorte.totalCashWithdrawal
        ? pdf.text(
            `Retiros Totales: $${selectedCorte.totalCashWithdrawal}`,
            10,
            180
          )
        : pdf.text("Retiros Totales: $0", 10, 180);
      selectedCorte.total
        ? pdf.text(`Final Total en Caja: $${selectedCorte.total}`, 10, 190)
        : pdf.text("Final Total en Caja: $0", 10, 190);
      pdf.save("detalle_corte.pdf");
    }
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
                <th>
                  DINERO <br />
                  EN FONDO
                </th>
                <th>
                  INGRESO <br />
                  EN EFECTIVO
                </th>
                <th>
                  INGRESO <br />
                  EN TARJETA
                </th>
                <th>
                  INGRESOS <br />
                  TOTALES
                </th>
                <th>
                  RETIROS <br />
                  TOTALES
                </th>
                <th>
                  FINAL <br />
                  TOTAL CAJA
                </th>
                <th></th>
              </tr>
            </thead>
            {/* TOTAL INCOME = (totalCash + totalCredit) - totalCashWithdrawal*/}
            <tbody>
              {Cortes.map((corte) => (
                <tr className="bg-white border-b" key={corte.id_cashCut}>
                  <td className="py-3 px-1 text-center">{corte.id_cashCut}</td>
                  <td className="py-3 px-6">{formatDate(corte.cashCutD)}</td>
                  <td className="py-3 px-6">
                    ${initialCash ? initialCash : 0}
                  </td>
                  <td className="py-3 px-6">
                    ${corte.totalCash ? corte.totalCash : 0}
                  </td>
                  <td className="py-3 px-6">
                    ${corte.totalCredit ? corte.totalCredit : 0}
                  </td>
                  <td className="py-3 px-6">
                    ${corte.totalIncome ? corte.totalIncome : 0}
                  </td>
                  <td className="py-3 px-6">
                    ${corte.totalCashWithdrawal ? corte.totalCashWithdrawal : 0}
                  </td>
                  <td className="py-3 px-6">
                    ${corte.total ? corte.total : 0}
                  </td>
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
          <Button key="print" onClick={handleModalPrint} className="btn-print">
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
                  <span className="font-bold">ID:</span>{" "}
                  {selectedCorte.id_cashCut}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Usuario:</span> {cookies.username}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Turno:</span>{" "}
                  {selectedCorte.workShift === "morning"
                    ? "Matutino"
                    : selectedCorte.workShift === "evening"
                    ? "Vespertino"
                    : ""} {console.log(selectedCorte.workShift)}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Fecha:</span>{" "}
                  {formatDate(selectedCorte.cashCutD)}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Dinero en Fondo:</span> $
                  {initialCash}
                </p>
              </div>
              <div className="w-1/2">
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Efectivo:</span> $
                  {selectedCorte.totalCash ? selectedCorte.totalCash : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Ingreso en Tarjeta:</span> $
                  {selectedCorte.totalCredit ? selectedCorte.totalCredit : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Retiros Totales:</span> $
                  {selectedCorte.totalCashWithdrawal
                    ? selectedCorte.totalCashWithdrawal
                    : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Final Total en Caja:</span> $
                  {selectedCorte.total ? selectedCorte.total : 0}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mt-4">
                Detalles de Ingresos por Servicio:
              </h3>
              <p className="text-lg">
                <span className="font-bold">Autoservicio:</span> $
                {selectedCorte.totalAutoservicio
                  ? selectedCorte.totalAutoservicio
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Lavado por Encargo:</span> $
                {selectedCorte.totalEncargo ? selectedCorte.totalEncargo : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Planchado:</span> $
                {selectedCorte.totalPlanchado
                  ? selectedCorte.totalPlanchado
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Tintorería:</span> $
                {selectedCorte.totalTintoreria
                  ? selectedCorte.totalTintoreria
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Encargo Varios:</span> $
                {selectedCorte.totalOtrosEncargo
                  ? selectedCorte.totalOtrosEncargo
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">
                  Total (Suma de los Servicios):
                </span>{" "}
                ${selectedCorte.totalIncome ? selectedCorte.totalIncome : 0}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CorteCaja;