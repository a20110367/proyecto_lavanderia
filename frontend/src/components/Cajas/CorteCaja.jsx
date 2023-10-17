import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import { useAuth } from "../../hooks/auth/auth";

function CorteCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [turno, setTurno] = useState("Matutino");
  const [usuario, setUsuario] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const { cookies } = useAuth();
  const [nombreEmpleado, setNombreEmpleado] = useState(cookies.username || "");
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] = useState(
    false
  );
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setFechaHora(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const dummyCortes = [
      {
        id: 1,
        fecha: "2023-09-20",
        dineroFondo: 20000,
        retirosTotales: 0,
        ingresosTotales: 20000,
        ingresoEfectivo: 10000,
        ingresoTarjeta: 10000,
        finalTotalCaja: 0,
        usuario: "Usuario1",
        turno: "Matutino",
      },
      {
        id: 2,
        fecha: "2023-09-18",
        dineroFondo: 15000,
        retirosTotales: 300,
        ingresosTotales: 15000,
        ingresoEfectivo: 7000,
        ingresoTarjeta: 8000,
        finalTotalCaja: 0,
        usuario: "Usuario2",
        turno: "Vespertino",
      },
      {
        id: 3,
        fecha: "2023-09-15",
        dineroFondo: 18000,
        retirosTotales: 600,
        ingresosTotales: 16000,
        ingresoEfectivo: 9000,
        ingresoTarjeta: 7000,
        finalTotalCaja: 0,
        usuario: "Usuario3",
        turno: "Matutino",
      },
    ];

    const now = moment();
    const currentCorte = dummyCortes.find((corte) =>
      moment(corte.fecha).isSame(now, "day")
    );

    if (currentCorte) {
      setCortes([currentCorte]);
      setMostrarTabla(true);
    }
  }, []);

  const handleCorteCaja = () => {
    setDialogVisible(true);
  };

  
  const handleConfirmCorteCaja = () => {
    const now = new Date();
    const horaActual = now.getHours();

    const turno = horaActual < 12 ? "Matutino" : "Vespertino";

    const nuevoCorte = {
      id: Cortes.length + 1,
      fecha: moment().format("YYYY-MM-DD"),
      dineroFondo: 15000,
      retirosTotales: 500,
      ingresosTotales: 16000,
      ingresoEfectivo: 10000,
      ingresoTarjeta: 6000,
      finalTotalCaja: 0,
      usuario: nombreEmpleado,
      turno: turno,
    };

    nuevoCorte.finalTotalCaja =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresosTotales -
      nuevoCorte.retirosTotales;

    const pdf = new jsPDF();
    pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
    pdf.text(`Usuario: ${nombreEmpleado}`, 10, 20);
    pdf.text(`Fecha y Hora: ${fechaHora}`, 10, 30);
    pdf.text(`Turno: ${nuevoCorte.turno}`, 10, 40);
    pdf.text(`Dinero en Fondo: ${nuevoCorte.dineroFondo}`, 10, 50);
    pdf.text(`Retiros Totales: ${nuevoCorte.retirosTotales}`, 10, 60);
    pdf.text(`Ingresos Totales: ${nuevoCorte.ingresosTotales}`, 10, 70);
    pdf.text(`Ingreso en Efectivo: ${nuevoCorte.ingresoEfectivo}`, 10, 80);
    pdf.text(`Ingreso en Tarjeta: ${nuevoCorte.ingresoTarjeta}`, 10, 90);
    pdf.text(`Final Total Caja: ${nuevoCorte.finalTotalCaja}`, 10, 100);

    pdf.save(`corte_de_caja_Turno_${nombreEmpleado}.pdf`);

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

  const handlePartialCorteConfirm = () => {
    const now = new Date();
    const horaActual = now.getHours();

    const turno = horaActual < 12 ? "Matutino" : "Vespertino";

    const nuevoCorte = {
      id: Cortes.length + 1,
      fecha: moment().format("YYYY-MM-DD"),
      dineroFondo: 15000,
      retirosTotales: 500,
      ingresosTotales: 16000,
      ingresoEfectivo: 10000,
      ingresoTarjeta: 6000,
      finalTotalCaja: 0,
      usuario: nombreEmpleado,
      turno: turno,
    };

    nuevoCorte.finalTotalCaja =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresosTotales -
      nuevoCorte.retirosTotales;

    const pdf = new jsPDF();
    pdf.text(`CORTE DE CAJA PARCIAL  `, 10, 10);
    pdf.text(`Usuario: ${nombreEmpleado}`, 10, 20);
    pdf.text(`Fecha y Hora: ${fechaHora}`, 10, 30);
    pdf.text(`Turno: ${nuevoCorte.turno}`, 10, 40);
    pdf.text(`Dinero en Fondo: ${nuevoCorte.dineroFondo}`, 10, 50);
    pdf.text(`Retiros Totales: ${nuevoCorte.retirosTotales}`, 10, 60);
    pdf.text(`Ingresos Totales: ${nuevoCorte.ingresosTotales}`, 10, 70);
    pdf.text(`Ingreso en Efectivo: ${nuevoCorte.ingresoEfectivo}`, 10, 80);
    pdf.text(`Ingreso en Tarjeta: ${nuevoCorte.ingresoTarjeta}`, 10, 90);
    pdf.text(`Final Total Caja: ${nuevoCorte.finalTotalCaja}`, 10, 100);

    pdf.save(`corte_de_caja_Parcial_${nombreEmpleado}.pdf`);

    setCortes([nuevoCorte]);
    setPartialCorteDialogVisible(false);
  };

  const handleModalPrint = () => {
    const doc = new jsPDF();

    if (selectedCorte) {
      doc.text(`Detalles del Corte`, 10, 10);
      doc.text(`ID: ${selectedCorte.id}`, 10, 20);
      doc.text(`Fecha: ${selectedCorte.fecha}`, 10, 30);
      doc.text(`Usuario: ${selectedCorte.usuario}`, 10, 40);
      doc.text(
        `Ingreso en Efectivo: $ ${selectedCorte.ingresoEfectivo}`,
        10,
        50
      );
      doc.text(`Ingreso en Tarjeta: $ ${selectedCorte.ingresoTarjeta}`, 10, 60);
      doc.text(`Dinero en Fondo: $ ${selectedCorte.dineroFondo}`, 10, 70);
      doc.text(`Ingresos Totales: $ ${selectedCorte.ingresosTotales}`, 10, 80);
      doc.text(`Retiros Totales: $ ${selectedCorte.retirosTotales}`, 10, 90);
      doc.text(`Final Total Caja: $ ${selectedCorte.finalTotalCaja}`, 10, 100);
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 110);

      doc.save("detalle_corte.pdf");
    }
  };
  return (
    <div className="text-center mt-4">
      <h1 className="text-4xl">
        Bienvenido a corte de caja{" "}
        {cookies.role === "admin" ? "Administrador" : "Empleado"}{" "}
        {nombreEmpleado}
      </h1>
      <p className="text-2xl">{fechaHora}</p>
      <p className="text-xl mt-4">¿Desea realizar un corte de caja?</p>
      <button
        onClick={handleCorteCaja}
        className="mt-4 mr-2 bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
      >
        Corte de Caja Turno
      </button>
      <button
        onClick={handlePartialCorteCaja}
        className="mt-4 bg-yellow-500 text-white p-3 rounded-md shadow-lg hover:bg-yellow-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
      >
        Corte de Caja Parcial
      </button>
      {mostrarTabla && (
  <div className="mt-4" style={{ overflowX: 'auto' }}>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="py-3 px-1 text-center">ID</th>
                <th className="py-3 px-6">FECHA</th>
                <th className="py-3 px-6">DINERO EN FONDO</th>
                <th className="py-3 px-6">INGRESO EN EFECTIVO</th>
                <th className="py-3 px-6">INGRESO EN TARJETA</th>
                <th className="py-3 px-6">INGRESOS TOTALES</th>
                <th className="py-3 px-6">RETIROS TOTALES</th>
                <th className="py-3 px-6">FINAL TOTAL CAJA</th>
                <th className="py-3 px-6">USUARIO</th>
                <th className="py-3 px-6">TURNO</th>
                <th className="py-3 px-6">ACCIONES</th>{" "}
              </tr>
            </thead>
            <tbody>
              {Cortes.map((corte) => (
                <tr className="bg-white border-b" key={corte.id}>
                  <td className="py-3 px-1 text-center">{corte.id}</td>
                  <td className="py-3 px-6">{corte.fecha}</td>
                  <td className="py-3 px-6">{corte.dineroFondo}</td>
                  <td className="py-3 px-6">{corte.retirosTotales}</td>
                  <td className="py-3 px-6">{corte.ingresosTotales}</td>
                  <td className="py-3 px-6">{corte.ingresoEfectivo}</td>
                  <td className="py-3 px-6">{corte.ingresoTarjeta}</td>
                  <td className="py-3 px-6">{corte.finalTotalCaja}</td>
                  <td className="py-3 px-6">{corte.usuario}</td>
                  <td className="py-3 px-6">{corte.turno}</td>
                  <td className="py-3 px-6">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
                      onClick={() => handleDetallesClick(corte)}
                    >
                      Detalles
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
        visible={dialogVisible}
        onOk={handleConfirmCorteCaja}
        onCancel={() => setDialogVisible(false)}
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
            onClick={() => setDialogVisible(false)}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de caja de turno?</p>
      </Modal>
      <Modal
        title="Confirmar Corte de Caja Parcial"
        visible={partialCorteDialogVisible}
        onOk={handlePartialCorteConfirm}
        onCancel={() => setPartialCorteDialogVisible(false)}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handlePartialCorteConfirm}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setPartialCorteDialogVisible(false)}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>¿Estás seguro de realizar un corte de caja parcial?</p>
      </Modal>
      <Modal
        title="Detalles del Corte"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="print"
            onClick={handleModalPrint}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Imprimir
          </Button>,
          <Button
            key="close"
            onClick={() => setModalVisible(false)}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm mr-2"
          >
            Cerrar
          </Button>,
        ]}
      >
        {selectedCorte && (
          <div>
            <p className="text-lg">
              <span className="font-bold">ID:</span> {selectedCorte.id}
            </p>
            <p className="text-lg">
              <span className="font-bold">Fecha:</span> {selectedCorte.fecha}
            </p>
            <p className="text-lg">
              <span className="font-bold">Usuario:</span>{" "}
              {selectedCorte.usuario}
            </p>

            <p className="text-lg">
              <span className="font-bold">Ingreso en Efectivo:</span> $
              {selectedCorte.ingresoEfectivo}
            </p>
            <p className="text-lg">
              <span className="font-bold">Ingreso en Tarjeta:</span> $
              {selectedCorte.ingresoTarjeta}
            </p>
            <p className="text-lg">
              <span className="font-bold">Dinero en Fondo:</span> $
              {selectedCorte.dineroFondo}
            </p>
            <p className="text-lg">
              <span className="font-bold">Ingresos Totales:</span> $
              {selectedCorte.ingresosTotales}
            </p>
            <p className="text-lg">
              <span className="font-bold">Retiros Totales:</span> $
              {selectedCorte.retirosTotales}
            </p>
            <p className="text-lg">
              <span className="font-bold">Final Total Caja:</span> $
              {selectedCorte.finalTotalCaja}
            </p>
            <p className="text-lg">
              <span className="font-bold">Turno:</span> {selectedCorte.turno}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CorteCaja;