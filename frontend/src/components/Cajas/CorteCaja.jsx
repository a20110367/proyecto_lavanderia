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
  const [dialogVisiblePlancha, setDialogVisiblePlancha] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [workShift, setWorkShift] = useState(
    moment().hours() < 12 ? "morning" : "evening"
  );
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] =
    useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [corteActivo, setCorteActivo] = useState(false);
  const navigate = useNavigate();
  const [blockButton, setBlockButton] = useState(false);

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

  const handleCortePiezas = () => {
    if (corteActivo) {
      message.info("Ya hay un corte de caja activo.");
    } else {
      setDialogVisiblePlancha(true);
    }
  };

  /* ------------------------------ REPRINT ------------------------------------*/

  const handleReprintTicket = async () => {
    try{
      await api.post('/log/write', {
        logEntry: `INFO CorteCaja.jsx : ${cookies.username} has reprinted a receipt`
      });
      await api.post('/warning/reprint', {
        casher: cookies.username,
      });
      await api.post('/generate/ticket/reprint');
    }catch(err){
      Swal.fire("No existe ticket en la cola", "Recuerda que solo puedes reimprimir una sola vez", "warning", "#034078");
      console.error(err);
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
      setBlockButton(true);

      setWorkShift(moment().hours() < 12 ? "morning" : "evening");

      const response = await api.get(`/closeCashCut/${cashCutId}`);
      const supplyResponse = await api.get(
        `/closeSupplyCashCut/${localStorage.getItem("id_supplyCashCut")}`
      );

      console.log(response)

      const corte = response.data;
      const corteSupply = supplyResponse.data;

      const nuevoCorte = {
        ...corte,
        id_cashCut: parseInt(localStorage.getItem("cashCutId")),
        id_supplyCashCut: parseInt(localStorage.getItem("id_supplyCashCut")),
        ...corteSupply,
      };

      const cashCut = {
        casher: cookies.username,
        cashCutId: nuevoCorte.id_cashCut,
        workShift: nuevoCorte.workShift,
        initialCash: nuevoCorte.initialCash,
        totalCashWithdrawal: nuevoCorte.totalCashWithdrawal,
        total: nuevoCorte.total,
        cashCutD: nuevoCorte.cashCutD,
        cashCutT: nuevoCorte.cashCutT,
        ordersCancelled: nuevoCorte.ordersCancelled,
        totalCancelations: nuevoCorte.totalCancelations,
      };

      const services = {
        numberOfItems: nuevoCorte.ordersPayed,
        selfService: nuevoCorte.totalAutoservicio,
        laundry: nuevoCorte.totalEncargo,
        iron: nuevoCorte.totalPlanchado,
        dryCleaning: nuevoCorte.totalTintoreria,
        others: nuevoCorte.totalOtrosEncargo,
        totalIncome: nuevoCorte.totalIncome,
        totalCash: nuevoCorte.totalCash,
        totalCredit: nuevoCorte.totalCredit,
      };

      const products = {
        numberOfItems: corteSupply.ordersPayedSupply,
        soap: corteSupply.totalJabon,
        suavitel: corteSupply.totalSuavitel,
        pinol: corteSupply.totalPinol,
        degreaser: corteSupply.totalDesengrasante,
        chlorine: corteSupply.totalCloro,
        sanitizer: corteSupply.totalSanitizante,
        bag: corteSupply.totalBolsa,
        reinforced: corteSupply.totalReforzado,
        hook: corteSupply.totalGanchos,
        wc: corteSupply.totalWC,
        others: corteSupply.totalOtros,
        totalIncome: corteSupply.totalIncomeSupply,
        totalCash: corteSupply.totalCashSupply,
        totalCredit: corteSupply.totalCreditSupply,
      };

      const pdf = new jsPDF();
      pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
      pdf.text(`ID: ${nuevoCorte.id_cashCut}`, 10, 20);
      pdf.text(`FECHA: ${formatDate(nuevoCorte.cashCutD)}`, 10, 30);
      pdf.text(`HORA: ${formatDate(nuevoCorte.cashCutT)}`, 10, 40);
      pdf.text(`Usuario: ${cookies.username}`, 10, 50);
      pdf.text(
        `Turno: ${
          nuevoCorte.workShift === "morning"
            ? "Matutino"
            : nuevoCorte.workShift === "evening"
            ? "Vespertino"
            : "Nocturno"
        }`,
        10,
        60
      );

      nuevoCorte.initialCash
        ? pdf.text(`Dinero en Fondo: $${nuevoCorte.initialCash}`, 10, 80)
        : pdf.text("Dinero en Fondo: $0", 10, 80);

      nuevoCorte.ordersPayed
        ? pdf.text(`Total Servicios Pagados: ${nuevoCorte.ordersPayed}`, 10, 90)
        : pdf.text(`Total Servicios Pagados: 0`, 10, 90);

      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 110);
      nuevoCorte.totalAutoservicio
        ? pdf.text(`Autoservicio: $${nuevoCorte.totalAutoservicio}`, 10, 120)
        : pdf.text("Autoservicio: $0", 10, 120);
      nuevoCorte.totalEncargo
        ? pdf.text(`Lavado por Encargo: $${nuevoCorte.totalEncargo}`, 10, 130)
        : pdf.text("Lavado por Encargo: $0", 10, 130);
      nuevoCorte.totalPlanchado
        ? pdf.text(`Planchado: $${nuevoCorte.totalPlanchado}`, 10, 140)
        : pdf.text("Planchado: $0", 10, 140);

      nuevoCorte.totalTintoreria
        ? pdf.text(`Tintorería: $${nuevoCorte.totalTintoreria}`, 10, 150)
        : pdf.text("Tintorería: $0", 10, 150);

      nuevoCorte.totalOtrosEncargo
        ? pdf.text(`Encargo Varios: $${nuevoCorte.totalOtrosEncargo}`, 10, 160)
        : pdf.text("Encargo Varios: $0", 10, 160);

      nuevoCorte.totalIncome
        ? pdf.text(
            `Total (Suma de los Servicios): $${nuevoCorte.totalIncome}`,
            10,
            170
          )
        : pdf.text("Total (Suma de los Servicios): $0", 10, 170);
      // Separación
      nuevoCorte.totalCash
        ? pdf.text(`Ingreso en Efectivo: $${nuevoCorte.totalCash}`, 10, 190)
        : pdf.text("Ingreso en Efectivo: $0", 10, 190);
      nuevoCorte.totalCredit
        ? pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.totalCredit}`, 10, 200)
        : pdf.text("Ingreso en Tarjeta: $0", 10, 200);
      nuevoCorte.totalCashWithdrawal
        ? pdf.text(
            `Retiros Totales: $${nuevoCorte.totalCashWithdrawal}`,
            10,
            210
          )
        : pdf.text("Retiros Totales: $0", 10, 210);
      nuevoCorte.total
        ? pdf.text(`Final Total en Caja: $${nuevoCorte.total}`, 10, 220)
        : pdf.text("Final Total en Caja: $0", 10, 220);

      if (
        pdf.internal.getNumberOfPages() > 0 &&
        pdf.internal.getCurrentPageInfo().pageNumber === 1
      ) {
        // Si estamos en la página 1 y cerca del final, agregamos una nueva página
        pdf.addPage();
        pdf.text(`Detalles de Suministros:`, 10, 10);
        pdf.text(
          `Total Pedidos Pagados: ${corteSupply.ordersPayedSupply}`,
          10,
          30
        );
        pdf.text(`Total Jabon $${corteSupply.totalJabon}`, 10, 40);
        pdf.text(`Total Suavitel $${corteSupply.totalSuavitel}`, 10, 50);
        pdf.text(`Total Pinol $${corteSupply.totalPinol}`, 10, 60);
        pdf.text(
          `Total Desengrasante $${corteSupply.totalDesengrasante}`,
          10,
          70
        );
        pdf.text(`Total Cloro $${corteSupply.totalCloro}`, 10, 80);
        pdf.text(`Total Sanitizante $${corteSupply.totalSanitizante}`, 10, 90);
        pdf.text(`Total Bolsa $${corteSupply.totalBolsa}`, 10, 100);
        pdf.text(`Total Reforzado $${corteSupply.totalReforzado}`, 10, 110);
        pdf.text(`Total Ganchos $${corteSupply.totalGanchos}`, 10, 120);
        pdf.text(`Total WC $${corteSupply.totalWC}`, 10, 130);
        pdf.text(`Total Otros $${corteSupply.totalOtros}`, 10, 140);
        pdf.text(`Total Tarjeta $${corteSupply.totalCreditSupply}`, 10, 160);
        pdf.text(`Total Efectivo $${corteSupply.totalCashSupply}`, 10, 170);
        pdf.text(`Total Ingresos $${corteSupply.totalIncomeSupply}`, 10, 180);
      }

      // pdf.save(`corte_de_caja_Turno_${cookies.username}.pdf`);

      setLastCashCut(nuevoCorte);
      setCortes([nuevoCorte]);

      localStorage.setItem("lastCashCut", JSON.stringify(nuevoCorte));
      localStorage.removeItem("initialCash");
      localStorage.removeItem("cashCutId");
      localStorage.removeItem("id_supplyCashCut");
      setMostrarTabla(true); // Muestra la tabla después de hacer el corte

      setDialogVisible(false);
    
      await api.post('/log/write', {
        logEntry: `INFO CorteCaja.jsx : ${cookies.username} has made a cash cut`
      });

      await api.post("/generateCashCutTicket", {
        cashCut: cashCut,
        services: services,
        products: products,
      });
      
      const out = pdf.output("datauristring");
      await api.post("/sendCashCut", {
        date: moment().format("DD-MM-YYYY"),
        hour: moment().format("LT"),
        pdf: out.split("base64,")[1],
      });

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

      setWorkShift(moment().hours() < 12 ? "morning" : "evening");

      const res = await api.get(`/calculateParcialCashCut/${cashCutId}`);
      console.log(res.data)
      // const response = await api.get(`/calculateCashCut/${cashCutId}`);
      // const supplyResponse = await api.get(
      //   `/calculateSupplyCashCut/${localStorage.getItem("id_supplyCashCut")}`
      // );

      const corteSupply = res.data.suppliesCashCut;
      const corte = res.data.serviceCashCut;
      const workshift = res.data.workshiftBalance;

      // const nuevoCorte = {
      //   ...corte,
      //   id_supplyCashCut: parseInt(localStorage.getItem("id_supplyCashCut")),
      //   id_cashCut: parseInt(localStorage.getItem("cashCutId")),
      //   ...corteSupply,
      // };

      // setCortes([nuevoCorte]);
      setPartialCorteDialogVisible(false);

      const cashCut = {
        casher: cookies.username,
        cashCutId: parseInt(localStorage.getItem("cashCutId")),
        workShift: corte.workShift,
        cashCutD: corte.cashCutD,
        cashCutT: corte.cashCutT,
        ironPiecesDone: corte.ironPiecesDone,
        pettyCashBalance: corte.pettyCashBalance,

        initialCash: workshift.initialCash,
        cashIncome: workshift.cashIncome,
        creditIncome: workShift.creditIncome,
        totalCashBalance: workshift.totalCashBalance,
        totalIncome: workshift.totalIncome,
        withdrawal: workshift.withdrawal,
        cancellations: workshift.cancellations,
      };

      const services = {
        numberOfItems: corte.ordersPayed,
        selfService: corte.totalAutoservicio,
        laundry: corte.totalEncargo,
        iron: corte.totalPlanchado,
        dryCleaning: corte.totalTintoreria,
        others: corte.totalOtrosEncargo,
        totalIncome: corte.totalServiceIncome,
        totalCash: corte.totalServiceCash,
        totalCredit: corte.totalServiceCredit,
        totalServiceBalance: corte.totalServiceBalance,
        totalCancelations: corte.totalCancelations,
        totalCashWithdrawal: corte.totalCashWithdrawal,
      };

      const products = {
        numberOfItems: corteSupply.ordersPayedSupply,
        soap: corteSupply.totalJabon,
        suavitel: corteSupply.totalSuavitel,
        pinol: corteSupply.totalPinol,
        degreaser: corteSupply.totalDesengrasante,
        chlorine: corteSupply.totalCloro,
        sanitizer: corteSupply.totalSanitizante,
        bag: corteSupply.totalBolsa,
        reinforced: corteSupply.totalReforzado,
        hook: corteSupply.totalGanchos,
        wc: corteSupply.totalWC,
        others: corteSupply.totalOtros,
        totalIncome: corteSupply.totalSuppliesIncome,
        totalCash: corteSupply.totalSuppliesCash,
        totalCredit: corteSupply.totalSuppliesCredit,
      };

      await api.post('/log/write', {
        logEntry: `INFO CorteCaja.jsx : ${cookies.username} has made an partial cash cut`
      });

      await api.post("/generatePartialCashCutTicket", {
        cashCut: cashCut,
        services: services,
        products: products,
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleModalPrint = async () => {
    // const pdf = new jsPDF();
    if (selectedCorte) {
      // pdf.text(`Detalles del Corte`, 10, 10);
      // pdf.text(`ID: ${selectedCorte.id_cashCut}`, 10, 20);
      // pdf.text(`Usuario: ${cookies.username}`, 10, 30);
      // pdf.text(
      //   `Turno: ${
      //     selectedCorte.workShift === "morning"
      //       ? "Matutino"
      //       : selectedCorte.workShift === "evening"
      //       ? "Vespertino"
      //       : "Nocturno"
      //   }`,
      //   10,
      //   40
      // );

      // selectedCorte.initialCash
      //   ? pdf.text(`Dinero en Fondo: $${selectedCorte.initialCash}`, 10, 60)
      //   : pdf.text("Dinero en Fondo: $0", 10, 60);
      //   selectedCorte.ordersPayed
      //   ? pdf.text(`Total Servicios Pagados: ${selectedCorte.ordersPayed}`, 10, 70)
      //   :  pdf.text(`Total Servicios Pagados: 0`, 10, 70);

      // // Separación
      // pdf.text(`Detalles de Ingresos por Servicio:`, 10, 90);
      // selectedCorte.totalAutoservicio
      //   ? pdf.text(`Autoservicio: $${selectedCorte.totalAutoservicio}`, 10, 100)
      //   : pdf.text("Autoservicio: $0", 10, 100);
      //   selectedCorte.totalEncargo
      //   ? pdf.text(`Lavado por Encargo: $${selectedCorte.totalEncargo}`, 10, 110)
      //   : pdf.text("Lavado por Encargo: $0", 10, 110);
      //   selectedCorte.totalPlanchado
      //   ? pdf.text(`Planchado: $${selectedCorte.totalPlanchado}`, 10, 120)
      //   : pdf.text("Planchado: $0", 10, 120);

      //   selectedCorte.totalTintoreria
      //   ? pdf.text(`Tintorería: $${selectedCorte.totalTintoreria}`, 10, 130)
      //   : pdf.text("Tintorería: $0", 10, 130);

      //   selectedCorte.totalOtrosEncargo
      //   ? pdf.text(`Encargo Varios: $${selectedCorte.totalOtrosEncargo}`, 10, 140)
      //   : pdf.text("Encargo Varios: $0", 10, 140);

      //   selectedCorte.totalIncome
      //   ? pdf.text(
      //       `Total (Suma de los Servicios): $${selectedCorte.totalIncome}`,
      //       10,
      //       150
      //     )
      //   : pdf.text("Total (Suma de los Servicios): $0", 10, 150);
      // // Separación
      // selectedCorte.totalCash
      //   ? pdf.text(`Ingreso en Efectivo: $${selectedCorte.totalCash}`, 10, 170)
      //   : pdf.text("Ingreso en Efectivo: $0", 10, 170);
      //   selectedCorte.totalCredit
      //   ? pdf.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 180)
      //   : pdf.text("Ingreso en Tarjeta: $0", 10, 180);
      //   selectedCorte.totalCashWithdrawal
      //   ? pdf.text(
      //       `Retiros Totales: $${selectedCorte.totalCashWithdrawal}`,
      //       10,
      //       190
      //     )
      //   : pdf.text("Retiros Totales: $0", 10, 190);
      //   selectedCorte.total
      //   ? pdf.text(`Final Total en Caja: $${selectedCorte.total}`, 10, 200)
      //   : pdf.text("Final Total en Caja: $0", 10, 200);

      // if (
      //   pdf.internal.getNumberOfPages() > 0 &&
      //   pdf.internal.getCurrentPageInfo().pageNumber === 1
      // ) {
      //   // Si estamos en la página 1 y cerca del final, agregamos una nueva página
      //   pdf.addPage();
      //   pdf.text(`Detalles de Suministros:`, 10, 10);
      //   pdf.text(`Total Pedidos Pagados: ${selectedCorte.ordersPayedSupply}`, 10, 30);
      //   pdf.text(`Total Jabon $${selectedCorte.totalJabon}`, 10, 40);
      //   pdf.text(`Total Suavitel $${selectedCorte.totalSuavitel}`, 10, 50);
      //   pdf.text(`Total Pinol $${selectedCorte.totalPinol}`, 10, 60);
      //   pdf.text(
      //     `Total Desengrasante $${selectedCorte.totalDesengrasante}`,
      //     10,
      //     70
      //   );
      //   pdf.text(`Total Cloro $${selectedCorte.totalCloro}`, 10, 80);
      //   pdf.text(`Total Sanitizante $${selectedCorte.totalSanitizante}`, 10, 90);
      //   pdf.text(`Total Bolsa $${selectedCorte.totalBolsa}`, 10, 100);
      //   pdf.text(`Total Reforzado $${selectedCorte.totalReforzado}`, 10, 110);
      //   pdf.text(`Total Ganchos $${selectedCorte.totalGanchos}`, 10, 120);
      //   pdf.text(`Total WC $${selectedCorte.totalWC}`, 10, 130);
      //   pdf.text(`Total Otros $${selectedCorte.totalOtros}`, 10, 140);
      //   pdf.text(`Total Tarjeta $${selectedCorte.totalCreditSupply}`, 10, 160);
      //   pdf.text(`Total Efectivo $${selectedCorte.totalCashSupply}`, 10, 170);
      //   pdf.text(`Total Ingresos $${selectedCorte.totalIncomeSupply}`, 10, 180);

      // }

      // pdf.save("detalle_corte.pdf");

      const cashCut = {
        casher: cookies.username,
        cashCutId: selectedCorte.id_cashCut,
        workShift: selectedCorte.workShift,
        initialCash: selectedCorte.initialCash,
        totalCashWithdrawal: selectedCorte.totalCashWithdrawal,
        total: selectedCorte.total,
        cashCutD: selectedCorte.cashCutD,
        cashCutT: selectedCorte.cashCutT,
      };

      const services = {
        numberOfItems: selectedCorte.ordersPayed,
        selfService: selectedCorte.totalAutoservicio,
        laundry: selectedCorte.totalEncargo,
        iron: selectedCorte.totalPlanchado,
        dryCleaning: selectedCorte.totalTintoreria,
        others: selectedCorte.totalOtrosEncargo,
        totalIncome: selectedCorte.totalIncome,
        totalCash: selectedCorte.totalCash,
        totalCredit: selectedCorte.totalCredit,
      };

      const products = {
        numberOfItems: selectedCorte.ordersPayedSupply,
        soap: selectedCorte.totalJabon,
        suavitel: selectedCorte.totalSuavitel,
        pinol: selectedCorte.totalPinol,
        degreaser: selectedCorte.totalDesengrasante,
        chlorine: selectedCorte.totalCloro,
        sanitizer: selectedCorte.totalSanitizante,
        bag: selectedCorte.totalBolsa,
        reinforced: selectedCorte.totalReforzado,
        hook: selectedCorte.totalGanchos,
        wc: selectedCorte.totalWC,
        others: selectedCorte.totalOtros,
        totalIncome: selectedCorte.totalIncomeSupply,
        totalCash: selectedCorte.totalCashSupply,
        totalCredit: selectedCorte.totalCreditSupply,
      };

      await api.post("/generateCashCutTicket", {
        cashCut: cashCut,
        services: services,
        products: products,
      });
    }
  };

  const handleConfirmCortePiezas = async () => {
    try{
      const res = await api.get('/calculateIronCut')
      if(res){
        await api.post('/log/write', {
          logEntry: `INFO CorteCaja.jsx : ${cookies.username} has made an iron cash cut`
        });
        const ironCut = { ...res.data, casher: cookies.username}
        await api.post('/generateIronCutTicket',{
          ironCut: ironCut
        })
      }else{
        Swal.fire({
          icon: "error",
          title: "Ya se hizo el Corte de Planchado",
          text: "Ya se hizo el Corte de Planchado o No hay piezas que contar.",
          confirmButtonColor: "#034078",
        });
      }
      setDialogVisiblePlancha(false);
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div className="text-center mt-4">
      <h1 className="text-4xl">
        Bienvenido a corte de caja{" "}
        {cookies.role === "admin" ? "Administrador:" : "Empleado:"}{" "}
        <span className="title-strong text-4xl">{cookies.username}</span>
      </h1>
      <p className="text-2xl">{fechaHora}</p>
      <div className="flex justify-between">
        <div className="w-1/2">
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
        </div>
        <div className="w-1/2">
          <p className="text-xl mt-4">
            ¿Desea realizar un corte de piezas de planchado?
          </p>
          <button
            onClick={handleCortePiezas}
            className="mt-4 mr-2 bg-IndigoDye font-bold text-white p-3 rounded-md shadow-lg hover:bg-PennBlue hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-base"
          >
            Corte de Planchado
          </button>

          <p className="text-xl mt-4">
            ¿Desea reimprimir el ultimo ticket?
          </p>
          <button
            onClick={handleReprintTicket}
            className="mt-4 mr-2 bg-IndigoDye font-bold text-white p-3 rounded-md shadow-lg hover:bg-PennBlue hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-base"
          >
            Reimprimir
          </button>
        </div>
      </div>
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
                    ${corte.initialCash ? corte.initialCash : 0}
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
        maskClosable={!blockButton}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCorteCaja}
            className="btn-print text-white"
            disabled={blockButton}
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setDialogVisible(false)}
            className="btn-cancel-modal text-white"
            disabled={blockButton}
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
        title="Confirmar Corte de Piezas de Planchado"
        open={dialogVisiblePlancha}
        onOk={handleConfirmCortePiezas}
        onCancel={() => setDialogVisiblePlancha(false)}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCortePiezas}
            className="btn-print text-white"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setDialogVisiblePlancha(false)}
            className="btn-cancel-modal text-white"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de piezas de planchado?</p>
      </Modal>
      <Modal
        title="Detalles del Corte"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={900} // Ajusta el ancho según necesidades
        footer={[
          <Button
            key="print"
            onClick={handleModalPrint}
            className="btn-print text-white"
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
          <div className="flex">
            {/* Primera Columna */}
            <div className="w-1/2">
              <p className="text-lg">
                <span className="font-bold">ID:</span>{" "}
                {selectedCorte.id_cashCut}
              </p>
              <p className="text-lg text-white">
                <span className="font-bold">Usuario:</span> {cookies.username}
              </p>
              <p className="text-lg">
                <span className="font-bold">Turno:</span>{" "}
                {selectedCorte.workShift === "morning"
                  ? "Matutino"
                  : selectedCorte.workShift === "evening"
                  ? "Vespertino"
                  : ""}
              </p>
              <p className="text-lg">
                <span className="font-bold">Fecha:</span>{" "}
                {formatDate(selectedCorte.cashCutD)}
              </p>
              <p className="text-lg">
                <span className="font-bold">Hora:</span>{" "}
                {moment(selectedCorte.cashCutT).format("HH:mm")}
              </p>

              <br />
              <p className="text-lg">
                <span className="font-bold">
                  Detalles de Ingresos por Servicio:
                </span>
              </p>
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
              <br />
              <p className="text-lg">
                <span className="font-bold">
                  Ingresos totales de servicios:
                </span>
              </p>
              <p className="text-lg">
                <span className="font-bold">Servicios Pagados: </span>
                {selectedCorte.ordersPayed}
              </p>
              <p className="text-lg">
                <span className="font-bold">Dinero en Fondo:</span> $
                {selectedCorte.initialCash ? selectedCorte.initialCash : 0}
              </p>
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
            {/* Tercera Columna */}
            <div className="w-1/2">
              <p className="text-lg">
                <span className="font-bold">Ingreso de Productos:</span>
              </p>
              <p className="text-lg">
                <span className="font-bold">Jabón:</span> $
                {selectedCorte.totalJabon ? selectedCorte.totalJabon : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Suavitel:</span> $
                {selectedCorte.totalSuavitel ? selectedCorte.totalSuavitel : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Pinol:</span> $
                {selectedCorte.totalPinol ? selectedCorte.totalPinol : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Desengrasante:</span> $
                {selectedCorte.totalDesengrasante
                  ? selectedCorte.totalDesengrasante
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Cloro:</span> $
                {selectedCorte.totalCloro ? selectedCorte.totalCloro : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Sanitizante:</span> $
                {selectedCorte.totalSanitizante
                  ? selectedCorte.totalSanitizante
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Bolsa:</span> $
                {selectedCorte.totalBolsa ? selectedCorte.totalBolsa : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Reforzado:</span> $
                {selectedCorte.totalReforzado
                  ? selectedCorte.totalReforzado
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Ganchos:</span> $
                {selectedCorte.totalGanchos ? selectedCorte.totalGanchos : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">WC:</span> $
                {selectedCorte.totalWC ? selectedCorte.totalWC : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Otros:</span> $
                {selectedCorte.totalOtros ? selectedCorte.totalOtros : 0}
              </p>
              <br />

              <p className="text-lg">
                <span className="font-bold">
                  Ingresos totales de productos:
                </span>
              </p>
              <p className="text-lg">
                <span className="font-bold">Ordenes Pagadas: </span>
                {selectedCorte.ordersPayedSupply}
              </p>
              <p className="text-lg">
                <span className="font-bold">
                  Ingreso de productos con Efectivo:
                </span>{" "}
                $
                {selectedCorte.totalCashSupply
                  ? selectedCorte.totalCashSupply
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">
                  Ingreso de productos con Tarjeta:
                </span>{" "}
                $
                {selectedCorte.totalCreditSupply
                  ? selectedCorte.totalCreditSupply
                  : 0}
              </p>
              <p className="text-lg">
                <span className="font-bold">Ingreso total de productos:</span> $
                {selectedCorte.totalIncomeSupply
                  ? selectedCorte.totalIncomeSupply
                  : 0}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CorteCaja;
