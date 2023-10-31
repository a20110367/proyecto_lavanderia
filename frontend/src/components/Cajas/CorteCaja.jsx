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
  const [partialCorteDialogVisible, setPartialCorteDialogVisible] =
    useState(false);
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
        fecha: "15/09/2023", // Mantén el formato dd/mm/yyyy aquí
        dineroFondo: 18000,
        retirosTotales: 600,
        ingresosTotales: 16000,
        ingresoEfectivo: 9000,
        ingresoTarjeta: 7000,
        finalTotalCaja: 0,
        usuario: "Usuario3",
        turno: "Matutino",
        tipoServicio: "Planchado",
        // Añade los campos de ingresos por servicio
        ingresoAutoservicio: 3000,
        ingresoLavadoEncargo: 4000,
        ingresoPlanchado: 16000,
      },
      {
        id: 2,
        fecha: "18/09/2023", // Mantén el formato dd/mm/yyyy aquí
        dineroFondo: 15000,
        retirosTotales: 300,
        ingresosTotales: 15000,
        ingresoEfectivo: 7000,
        ingresoTarjeta: 8000,
        finalTotalCaja: 0,
        usuario: "Usuario2",
        turno: "Vespertino",
        tipoServicio: "Lavado por encargo",
        // Añade los campos de ingresos por servicio
        ingresoAutoservicio: 5000,
        ingresoLavadoEncargo: 15000,
        ingresoPlanchado: 10000,
      },
      {
        id: 3,
        fecha: "20/09/2023", // Mantén el formato dd/mm/yyyy aquí
        dineroFondo: 20000,
        retirosTotales: 1200,
        ingresosTotales: 20000,
        ingresoEfectivo: 10000,
        ingresoTarjeta: 10000,
        finalTotalCaja: 0,
        usuario: "Usuario1",
        turno: "Matutino",
        tipoServicio: "Autoservicio",
        // Añade los campos de ingresos por servicio
        ingresoAutoservicio: 10000,
        ingresoLavadoEncargo: 16000,
        ingresoPlanchado: 15000,
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
      fecha: moment().format("DD/MM/YYYY"),
      dineroFondo: 20000,
      retirosTotales: 1200,
      ingresoEfectivo: 61000,
      ingresoTarjeta: 10000,
      ingresosTotales:20000, 
      finalTotalCaja: 0,
      ingresoAutoservicio: 10000,
      ingresoLavadoEncargo: 16000,
      ingresoPlanchado: 15000,
      usuario: nombreEmpleado,
      turno: turno,
    };
    
    nuevoCorte.finalTotalCaja =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado -
      nuevoCorte.ingresoTarjeta -
      nuevoCorte.retirosTotales;
    
    nuevoCorte.ingresoTotalServicios =
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado;
    
    nuevoCorte.ingresoEfectivo =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado;
    

      const pdf = new jsPDF();

      pdf.text(`CORTE DE CAJA TURNO`, 10, 10);
      pdf.text(`ID: ${nuevoCorte.id}`, 10, 20);
      pdf.text(`Usuario: ${nombreEmpleado}`, 10, 30);
      pdf.text(`Turno: ${nuevoCorte.turno}`, 10, 40);
      pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
      pdf.text(`Dinero en Fondo: $${nuevoCorte.dineroFondo}`, 10, 60);
      
      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      pdf.text(`Autoservicio: $${nuevoCorte.ingresoAutoservicio}`, 10, 90);
      pdf.text(`Lavado por Encargo: $${nuevoCorte.ingresoLavadoEncargo}`, 10, 100);
      pdf.text(`Planchado: $${nuevoCorte.ingresoPlanchado}`, 10, 110);
      pdf.text(
        `Total (Suma de los Servicios): $${nuevoCorte.ingresoTotalServicios}`,
        10,
       120
      );
      pdf.text(`Ingreso en Efectivo: $${nuevoCorte.ingresoEfectivo}`, 10, 130);
      
      // Separación
      pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.ingresoTarjeta}`, 10, 150);
      pdf.text(`Retiros Totales: $${nuevoCorte.retirosTotales}`, 10, 160);
      pdf.text(`Final Total en Caja: $${nuevoCorte.finalTotalCaja}`, 10, 170);
      
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
      fecha: moment().format("DD-MM-YYY"),
      dineroFondo: 20000,
      retirosTotales: 1200,
      ingresoEfectivo: 61000,
      ingresoTarjeta: 10000,
      ingresosTotales:20000, 
      finalTotalCaja: 0,
      ingresoAutoservicio: 10000,
      ingresoLavadoEncargo: 16000,
      ingresoPlanchado: 15000,
      usuario: nombreEmpleado,
      turno: turno,
    };

    nuevoCorte.finalTotalCaja =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado -
      nuevoCorte.ingresoTarjeta -
      nuevoCorte.retirosTotales;
    
    nuevoCorte.ingresoTotalServicios =
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado;
    
    nuevoCorte.ingresoEfectivo =
      nuevoCorte.dineroFondo +
      nuevoCorte.ingresoAutoservicio +
      nuevoCorte.ingresoLavadoEncargo +
      nuevoCorte.ingresoPlanchado;
      
    const pdf = new jsPDF();
    pdf.text(`CORTE DE CAJA PARCIAL  `, 10, 10);
    pdf.text(`ID: ${nuevoCorte.id}`, 10, 20);
      pdf.text(`Usuario: ${nombreEmpleado}`, 10, 30);
      pdf.text(`Turno: ${nuevoCorte.turno}`, 10, 40);
      pdf.text(`Fecha: ${moment().format("DD/MM/YYYY")}`, 10, 50);
      pdf.text(`Dinero en Fondo: $${nuevoCorte.dineroFondo}`, 10, 60);
      
      // Separación
      pdf.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      pdf.text(`Autoservicio: $${nuevoCorte.ingresoAutoservicio}`, 10, 90);
      pdf.text(`Lavado por Encargo: $${nuevoCorte.ingresoLavadoEncargo}`, 10, 100);
      pdf.text(`Planchado: $${nuevoCorte.ingresoPlanchado}`, 10, 110);
      pdf.text(
        `Total (Suma de los Servicios): $${nuevoCorte.ingresoTotalServicios}`,
        10,
       120
      );
      pdf.text(`Ingreso en Efectivo: $${nuevoCorte.ingresoEfectivo}`, 10, 130);
      
      // Separación
      pdf.text(`Ingreso en Tarjeta: $${nuevoCorte.ingresoTarjeta}`, 10, 150);
      pdf.text(`Retiros Totales: $${nuevoCorte.retirosTotales}`, 10, 160);
      pdf.text(`Final Total en Caja: $${nuevoCorte.finalTotalCaja}`, 10, 170);
      
      pdf.save(`corte_de_caja_Turno_${nombreEmpleado}.pdf`);
      

    setCortes([nuevoCorte]);
    setPartialCorteDialogVisible(false);
  };

  const handleModalPrint = () => {
    const doc = new jsPDF();

    if (selectedCorte) {
      doc.text(`Detalles del Corte`, 10, 10);
      doc.text(`ID: ${selectedCorte.id}`, 10, 20);
      doc.text(`Usuario: ${selectedCorte.usuario}`, 10, 30);
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 40);
      doc.text(
        `Fecha: ${selectedCorte.fecha}`,
        10,
        50
      );
      doc.text(`Dinero en Fondo: $${selectedCorte.dineroFondo}`, 10, 60);

      // Separación
      doc.text(`Detalles de Ingresos por Servicio:`, 10, 80);
      doc.text(`Autoservicio: $${selectedCorte.ingresoAutoservicio}`, 10, 90);
      doc.text(
        `Lavado por Encargo: $${selectedCorte.ingresoLavadoEncargo}`,
        10,
        100
      );
      doc.text(`Planchado: $${selectedCorte.ingresoPlanchado}`, 10, 110);
      doc.text(
        `Total (Suma de los Servicios): $${selectedCorte.ingresoTotalServicios}`,
        10,
        120
      );
      doc.text(
        `Ingreso en Efectivo: $${selectedCorte.ingresoEfectivo}`,
        10,
        130
      );

      // Separación
      doc.text(`Ingreso en Tarjeta: $${selectedCorte.ingresoTarjeta}`, 10, 150);
      doc.text(`Retiros Totales: $${selectedCorte.retirosTotales}`, 10, 160);
      doc.text(
        `Final Total en Caja: $${selectedCorte.finalTotalCaja}`,
        10,
        170
      );

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
                <th >FECHA</th>
                <th >DINERO EN FONDO</th>
                <th >INGRESO EN EFECTIVO</th>
                <th >INGRESO EN TARJETA</th>
                <th >INGRESOS TOTALES</th>
                <th >RETIROS TOTALES</th>
                <th >FINAL TOTAL CAJA</th>
                <th >USUARIO</th>
                <th >TURNO</th>
                <th ></th>{" "}
              </tr>
            </thead>
            <tbody>
              {Cortes.map((corte) => (
                <tr className="bg-white border-b" key={corte.id}>
                <td className="py-3 px-1 text-center">{corte.id}</td>
                <td className="py-3 px-6">{corte.fecha}</td>
                <td className="py-3 px-6">${corte.dineroFondo}</td>
                <td className="py-3 px-6">${corte.ingresoEfectivo}</td>
                <td className="py-3 px-6">${corte.ingresoTarjeta}</td>
                <td className="py-3 px-6">${corte.ingresosTotales}</td>
                <td className="py-3 px-6">${corte.retirosTotales}</td>
                <td className="py-3 px-6">${corte.finalTotalCaja}</td>
                  <td className="py-3 px-6">{corte.usuario}</td>
                  <td className="py-3 px-6">{corte.turno}</td>
                  <td className="py-3 px-6">
                    <button
                      className="btn-primary"
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
            className="btn-print text-white"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setDialogVisible(false)}
            className="btn-cancel-modal"
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
            className="btn-print text-white"
          >
            Confirmar
          </Button>,
          <Button
            key="cancelar"
            onClick={() => setPartialCorteDialogVisible(false)}
            className="btn-cancel-modal"
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
                    <span className="font-bold">ID:</span> {selectedCorte.id}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Usuario:</span>{" "}
                    {selectedCorte.usuario}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Turno:</span>{" "}
                    {selectedCorte.turno}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Fecha:</span>{" "}
                    {selectedCorte.fecha}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Dinero en Fondo:</span> $
                    {selectedCorte.dineroFondo}
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="text-lg">
                    <span className="font-bold">Ingreso en Efectivo:</span> $
                    {selectedCorte.ingresoEfectivo}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Ingreso en Tarjeta:</span> $
                    {selectedCorte.ingresoTarjeta}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Retiros Totales:</span> $
                    {selectedCorte.retirosTotales}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Final Total en Caja:</span> $
                    {selectedCorte.finalTotalCaja}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mt-4">
                  Detalles de Ingresos por Servicio:
                </h3>
                <p className="text-lg">
                  <span className="font-bold">Autoservicio:</span> $
                  {selectedCorte.ingresoAutoservicio}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Lavado por Encargo:</span> $
                  {selectedCorte.ingresoLavadoEncargo}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Planchado:</span> $
                  {selectedCorte.ingresoPlanchado}
                </p>
                <p className="text-lg">
                  <span className="font-bold">
                    Total (Suma de los Servicios):
                  </span>{" "}
                  ${selectedCorte.ingresoTotalServicios}
                </p>
              </div>
            </div>
          )}
        </Modal>
    </div>
  );
}

export default CorteCaja;
