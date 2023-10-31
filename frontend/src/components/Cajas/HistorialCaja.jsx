import React, { useState, useEffect } from "react";
import locale from 'antd/es/date-picker/locale/es_ES';
import { Modal, Button, DatePicker } from "antd";
import jsPDF from "jspdf";
import ReactPaginate from "react-paginate";

function HistorialCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [dateRange, setDateRange] = useState([null]);
  const [datesSelected, setDatesSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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
    const cortesConFinalTotalCaja = dummyCortes.map((corte) => ({
      ...corte,
      finalTotalCaja:
        corte.dineroFondo +
        corte.ingresoAutoservicio +
        corte.ingresoLavadoEncargo +
        corte.ingresoPlanchado -
        corte.ingresoTarjeta -
        corte.retirosTotales,
      ingresoTotalServicios:
        corte.ingresoAutoservicio +
        corte.ingresoLavadoEncargo +
        corte.ingresoPlanchado,
      ingresoEfectivo:
        corte.dineroFondo +
        corte.ingresoAutoservicio +
        corte.ingresoLavadoEncargo +
        corte.ingresoPlanchado,
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
      doc.text(`Usuario: ${selectedCorte.usuario}`, 10, 30);
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 40);
      doc.text(`Fecha: ${selectedCorte.fecha}`, 10, 50);
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

  const handleFiltroPorFecha = () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange.map((date) => date.toDate());
      const filtered = Cortes.filter((corte) => {
        const corteDate = new Date(corte.fecha);
        return corteDate >= startDate && corteDate <= endDate;
      });

      const startDateStr = startDate.toLocaleDateString("en-GB");
      const endDateStr = endDate.toLocaleDateString("en-GB");

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
          <div className="title-container">
            <strong className="title-strong">Historial de Cortes</strong>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <div className="relative w-full">
            <div className="relative w-full flex items-center">
              <DatePicker.RangePicker
                locale={locale}
                onChange={(dates) => {
                  setDateRange(dates);
                  if (!dates || dates.length === 0) {
                    setDatesSelected(false);
                    setFilteredCortes(Cortes);
                  }
                }}
                value={dateRange}
                format="DD/MM/YYYY"
                className="border-2 rounded-md py-2  pl-10  border-Cerulean mt-2"
              />
              <button
                className="btn-search"
                onClick={handleFiltroPorFecha}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ overflowX: "auto" }}>
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th>ID</th>
                <th>FECHA</th>
                <th>DINERO EN FONDO</th>
                <th>INGRESO EN EFECTIVO</th>
                <th>INGRESO EN TARJETA</th>
                <th>INGRESOS TOTALES</th>
                <th>RETIROS TOTALES</th>
                <th>FINAL TOTAL CAJA</th>
                <th>USUARIO</th>
                <th>TURNO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCortes
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((corte) => (
                  <tr className="bg-white border-b" key={corte.id}>
                    <td className="">{corte.id}</td>
                    <td className="">{corte.fecha}</td>
                    <td className="">${corte.dineroFondo}</td>
                    <td className="">${corte.ingresoEfectivo}</td>
                    <td className="">${corte.ingresoTarjeta}</td>
                    <td className="">${corte.ingresosTotales}</td>
                    <td className="">${corte.retirosTotales}</td>
                    <td className="">${corte.finalTotalCaja}</td>
                    <td className="">{corte.usuario}</td>
                    <td className="">{corte.turno}</td>
                    <td className="min-w-[60px]">
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

        {/* Modal para mostrar detalles */}
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
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredCortes.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex"}
          pageLinkClassName="pageLinkClassName"
          previousLinkClassName="prevOrNextLinkClassName"
          nextLinkClassName="prevOrNextLinkClassName"
          breakLinkClassName="breakLinkClassName"
          activeLinkClassName="activeLinkClassName"
        />
      </div>
    </div>
  );
}

export default HistorialCaja;
