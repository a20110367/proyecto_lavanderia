import React, { useState, useEffect } from "react";
import { Modal, Button, DatePicker } from "antd";
import jsPDF from "jspdf";
import { format } from "date-fns";

function HistorialCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [dateRange, setDateRange] = useState([null]);
  const [datesSelected, setDatesSelected] = useState(false);

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
        tipoServicio: "Autoservicio",
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
        tipoServicio: "Lavado por encargo",
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
        tipoServicio: "Planchado",
      },
    ];

    const cortesConFinalTotalCaja = dummyCortes.map((corte) => ({
      ...corte,
      finalTotalCaja:
        corte.dineroFondo + corte.ingresosTotales - corte.retirosTotales,
    }));

    setCortes(cortesConFinalTotalCaja);
    setFilteredCortes(cortesConFinalTotalCaja);
  }, []);

  const handleDetallesClick = (corte) => {
    setSelectedCorte(corte);
    setModalVisible(true);
  };

  const handleModalPrint = () => {
    const doc = new jsPDF();

    if (selectedCorte) {
      doc.text(`Detalles del Corte`, 10, 10);
      doc.text(`ID: ${selectedCorte.id}`, 10, 20);
      doc.text(`Fecha: ${selectedCorte.fecha}`, 10, 30);
      doc.text(`Usuario: ${selectedCorte.usuario}`, 10, 40);
      doc.text(`Tipo de Servicio: ${selectedCorte.tipoServicio}`, 10, 50);
      doc.text(
        `Ingreso en Efectivo: $ ${selectedCorte.ingresoEfectivo}`,
        10,
        60
      );
      doc.text(`Ingreso en Tarjeta: $ ${selectedCorte.ingresoTarjeta}`, 10, 70);
      doc.text(`Dinero en Fondo: $ ${selectedCorte.dineroFondo}`, 10, 80);
      doc.text(`Ingresos Totales: $ ${selectedCorte.ingresosTotales}`, 10, 90);
      doc.text(`Retiros Totales: $ ${selectedCorte.retirosTotales}`, 10, 100);
      doc.text(`Final Total Caja: $ ${selectedCorte.finalTotalCaja}`, 10, 110);
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 120);

      doc.save("detalle_corte.pdf");
    }
  };

  const handleFiltroPorFecha = () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange.map((date) => date.toDate());
      const filtered = Cortes.filter((corte) => {
        const corteDate = new Date(corte.fecha);
        return corteDate >= startDate && corteDate <= endDate;
      });

      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const startCorte = Cortes.find((corte) => corte.fecha === startDateStr);
      const endCorte = Cortes.find((corte) => corte.fecha === endDateStr);

      if (startCorte && !filtered.some((c) => c.id === startCorte.id)) {
        filtered.push(startCorte);
      }

      if (endCorte && !filtered.some((c) => c.id === endCorte.id)) {
        filtered.push(endCorte);
      }

      setFilteredCortes(filtered);
      setDatesSelected(true);
    } else {
      if (!datesSelected) {
        setFilteredCortes(Cortes);
      }
    }
  };

  return (
    <div className="text-center mt-4">
      <div>
        <div className="mb-3">
          <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1 mt-4">
            <strong>Historial de cortes</strong>
          </div>
        </div>
        <div className="bg-neutral-600 rounded-md min-h-screen p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-full">
              <div className="relative w-full flex items-center">
                <DatePicker.RangePicker
                  onChange={(dates) => {
                    setDateRange(dates);
                    if (!dates || dates.length === 0) {
                      setDatesSelected(false);
                      setFilteredCortes(Cortes);
                    }
                  }}
                  value={dateRange}
                  className="border-2 rounded-md py-2  pl-10  border-black mt-2"
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm ml-2"
                  onClick={handleFiltroPorFecha}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
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
                <th className="py-3 px-6">TIPO SERVICIO</th>
                <th className="py-3 px-6">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredCortes.map((corte) => (
                <tr className="bg-white border-b" key={corte.id}>
                  <td className="py-3 px-1 text-center">{corte.id}</td>
                  <td className="py-3 px-6">{corte.fecha}</td>
                  <td className="py-3 px-6">{corte.dineroFondo}</td>
                  <td className="py-3 px-6">{corte.ingresoEfectivo}</td>
                  <td className="py-3 px-6">{corte.ingresoTarjeta}</td>
                  <td className="py-3 px-6">{corte.ingresosTotales}</td>
                  <td className="py-3 px-6">{corte.retirosTotales}</td>
                  <td className="py-3 px-6">{corte.finalTotalCaja}</td>
                  <td className="py-3 px-6">{corte.usuario}</td>
                  <td className="py-3 px-6">{corte.turno}</td>
                  <td className="py-3 px-6">{corte.tipoServicio}</td>
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
      </div>

      {/* Modal para mostrar detalles */}
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
              <span className="font-bold">Tipo de Servicio:</span>{" "}
              {selectedCorte.tipoServicio}
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

export default HistorialCaja;
