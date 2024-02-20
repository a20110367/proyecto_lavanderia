import React, { useState, useEffect } from "react";
import locale from "antd/es/date-picker/locale/es_ES";
import { Modal, Button, DatePicker } from "antd";
import jsPDF from "jspdf";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../utils/format";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useSWR, { useSWRConfig } from "swr";
import api from "../../api/api";
import Swal from "sweetalert2";
import moment from "moment";

function Reportes() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [totalCajaFechasSeleccionadas, setTotalCajaFechasSeleccionadas] =
    useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [dateRange, setDateRange] = useState([null]);
  const [datesSelected, setDatesSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetchCashCuts = async () => {
    try {
      const response = await api.get("/cashCuts");
      return response.data;
    } catch (error) {
      console.error("Error fetching cash cuts:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cashCuts = await fetchCashCuts();
        setCortes(cashCuts);
        setFilteredCortes(cashCuts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const { data } = useSWR("cashCuts", fetchCashCuts);
  if (!data) return <h2>Loading...</h2>;

  const handleDetallesClick = (corte) => {
    setSelectedCorte(corte);
    setModalVisible(true);
  };

  const handleModalPrint = () => {
    const doc = new jsPDF();

    if (selectedCorte) {
      doc.text(`Detalles del Corte`, 10, 10);
      doc.text(`ID: ${selectedCorte.id_cashCut}`, 10, 20);
      doc.text(`Usuario: ${selectedCorte.user.name}`, 10, 30);
      doc.text(
        `Turno: ${ selectedCorte.workShift === "morning"
        ? "Matutino"
        : selectedCorte.workShift === "evening"
        ? "Vespertino"
        : "Nocturno"
        }`,
        10,
        40
      );
      doc.text(`Fecha: ${formatDate(selectedCorte.cashCutD)}`, 10, 50);
      doc.text(`Dinero en Fondo: $${selectedCorte.initialCash}`, 10, 60);

      // Separación
      doc.text(`Detalles de Ingresos por Servicio:`, 10, 80);

      selectedCorte.totalAutoservicio
        ? doc.text(`Autoservicio: $${selectedCorte.totalAutoservicio}`, 10, 90)
        : doc.text("Autoservicio: $0", 10, 90);

      selectedCorte.totalEncargo
        ? doc.text(
            `Lavado por Encargo: $${selectedCorte.totalEncargo}`,
            10,
            100
          )
        : doc.text("Lavado por Encargo: $0", 10, 100);

      selectedCorte.totalPlanchado
        ? doc.text(`Planchado: $${selectedCorte.totalPlanchado}`, 10, 110)
        : doc.text("Planchado: $0", 10, 110);

      selectedCorte.totalTintoreria
        ? doc.text(`Tintorería: $${selectedCorte.totalTintoreria}`, 10, 120)
        : doc.text("Tintorería: $0", 10, 120);

      selectedCorte.totalOtrosEncargo
        ? doc.text(
            `Encargo Varios: $${selectedCorte.totalOtrosEncargo}`,
            10,
            130
          )
        : doc.text("Encargo Varios: $0", 10, 130);

      doc.text(
        `Total (Suma de los Servicios): $${selectedCorte.totalIncome}`,
        10,
        140
      );
      selectedCorte.totalCash
        ? doc.text(`Ingreso en Efectivo: $${selectedCorte.totalCash}`, 10, 160)
        : doc.text("Ingreso en Efectivo: $0", 10, 160);

      // Separación
      selectedCorte.totalCredit
        ? doc.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 170)
        : doc.text("Ingreso en Tarjeta: $0", 10, 170);

      selectedCorte.totalCashWithdrawal
        ? doc.text(
            `Retiros Totales: $${selectedCorte.totalCashWithdrawal}`,
            10,
            180
          )
        : doc.text("Retiros Totales: $0", 10, 180);
      doc.text(`Final Total en Caja: $${selectedCorte.total}`, 10, 190);

      doc.save("detalle_corte.pdf");
    }
  };

  const handleFiltroPorFecha = () => {
    if (!dateRange || dateRange.length !== 2)  {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar una fecha de inicio y una fecha de término para buscar.",
        confirmButtonColor: "#034078",
      });
      return;
    }
    if (dateRange.length === 2) {

      const [startDate, endDate] = dateRange.map((date) => date.toDate());

      const filteredCortes = Cortes.filter((corte) => {
        return moment(corte.cashCutD).isBetween(startDate, endDate, null, "[]");
      });


      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const filtered = Cortes.filter((corte) => {
        const corteDateStr = new Date(corte.cashCutD)
          .toISOString()
          .split("T")[0];
        return corteDateStr >= startDateStr && corteDateStr <= endDateStr;
      });

      const startCorte = Cortes.find((corte) => {
        const corteDateStr = new Date(corte.cashCutD)
          .toISOString()
          .split("T")[0];
        return corteDateStr === startDateStr;
      });

      const endCorte = Cortes.find((corte) => {
        const corteDateStr = new Date(corte.cashCutD)
          .toISOString()
          .split("T")[0];
        return corteDateStr === endDateStr;
      });

      if (
        startCorte &&
        !filtered.some((c) => c.id_cashCut === startCorte.id_cashCut)
      ) {
        filtered.push(startCorte);
      }

      if (
        endCorte &&
        !filtered.some((c) => c.id_cashCut === endCorte.id_cashCut)
      ) {
        filtered.push(endCorte);
      }

      setFilteredCortes(filtered);
      setDatesSelected(true);
      setCurrentPage(0);
    } else {
      setDatesSelected(false);
      if (!datesSelected) {
        setFilteredCortes(Cortes);
      }
    }
  };

  const handleGenerarPDF = async () => {
    try{
    if (filteredCortes.length > 0 && dateRange.length === 2) {
      const doc = new jsPDF();

      const report = {
        sumAutoservicio: 0,
        sumEncargo: 0,
        sumPlanchado: 0,
        sumTintoreria: 0,
        sumOtrosEncargo: 0,
        sumTotalIncome: 0,
        sumTotalCash: 0,
        sumTotalCredit: 0,
        sumTotalCashWithdrawal: 0,
        sumTotal: 0,
      };

      filteredCortes.map((corte) => {
        report.sumAutoservicio += corte.totalAutoservicio || 0;
        report.sumEncargo += corte.totalEncargo || 0;
        report.sumPlanchado += corte.totalPlanchado || 0;
        report.sumTintoreria += corte.totalTintoreria || 0;
        report.sumOtrosEncargo += corte.totalOtrosEncargo || 0;
        report.sumTotalIncome += corte.totalIncome || 0;
        report.sumTotalCash += corte.totalCash || 0;
        report.sumTotalCredit += corte.totalCredit || 0;
        report.sumTotalCashWithdrawal += corte.totalCashWithdrawal || 0;
        report.sumTotal += corte.total || 0;
      });

      doc.text(`Total de Caja de las Fechas Seleccionadas`, 10, 10);

      // Obtener las fechas seleccionadas en formato legible
      const startDate = formatDate(dateRange[0].toDate());
      const endDate = formatDate(dateRange[1].toDate());

      doc.text(`Fechas seleccionadas: ${startDate} - ${endDate}`, 10, 20);


      doc.text(`Total de Ingresos en Efectivo: $${report.sumTotalCash}`, 10, 40);
      doc.text(`Total de Ingresos en Tarjeta: $${report.sumTotalCredit}`, 10, 50);
      // Mostrar detalles de ingresos por servicio
      doc.text(`Detalles de Ingresos por Servicio:`, 10, 70);
      doc.text(`Autoservicio: $${report.sumAutoservicio}`, 10, 80);
      doc.text(`Lavado por Encargo: $${report.sumEncargo}`, 10, 90);
      doc.text(`Planchado: $${report.sumPlanchado}`, 10, 100);
      doc.text(`Tintorería: $${report.sumTintoreria}`, 10, 110);
      doc.text(`Encargo Varios: $${report.sumOtrosEncargo}`, 10, 120);
      doc.text(`Total (Suma de los Servicios): $${report.sumTotalIncome}`, 10, 130);
      // Mostrar retiros y total de ingresos del intervalo de fechas
      doc.text(`Retiros Totales: $${report.sumTotalCashWithdrawal}`, 10, 150);
      doc.text(`Total de Ingresos de  ${startDate} - ${endDate}: $${report.sumTotal}`, 10, 170);

      const formattedStartDate = startDate.split("/").join("-");
      const formattedEndDate = endDate.split("/").join("-");
      doc.save(`Reporte ${formattedStartDate} - ${formattedEndDate}.pdf`);

      const out = doc.output('datauristring');
      await api.post('/sendReport', {
        startDate: moment(dateRange[0]).format('DD-MM-YYYY'),
        endDate: moment(dateRange[1]).format('DD-MM-YYYY'),
        pdf: out.split('base64,')[1],
      })
      }
    }catch(err){
      console.error(err)
    }
  };

  return (
    <div className="text-center mt-4">
      <div>
        <div className="mb-3">
          <div className="title-container">
            <strong className="title-strong">Reportes de Servicios</strong>
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
              <button className="btn-search" onClick={handleFiltroPorFecha}>
                Buscar
              </button>
              {datesSelected && (
                <button
                  key="print"
                  onClick={handleGenerarPDF}
                  className="btn-search text-white ml-2"
                >
                  Guardar Reporte
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ overflowX: "auto" }}>
          <table className="w-full text-sm text-left text-gray-500 ">
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
                  RETIROS <br />
                  TOTALES
                </th>
                <th>
                  FINAL <br />
                  TOTAL CAJA
                </th>
                <th>USUARIO</th>
                <th>TURNO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCortes
                .slice()
                .reverse()
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((corte) => (
                  <tr className="bg-white border-b" key={corte.id_cashCut}>
                    <td className="">{corte.id_cashCut}</td>
                    <td className="">{formatDate(corte.cashCutD)}</td>
                    <td className="">
                      ${corte.initialCash ? corte.initialCash : 0}
                    </td>
                    <td className="">
                      ${corte.totalCash ? corte.totalCash : 0}
                    </td>
                    <td className="">
                      ${corte.totalCredit ? corte.totalCredit : 0}
                    </td>
                    <td className="">
                      $
                      {corte.totalCashWithdrawal
                        ? corte.totalCashWithdrawal
                        : 0}
                    </td>
                    <td className="">${corte.total ? corte.total : 0}</td>
                    <td className="">{corte.user.name} {corte.user.firstLN} {corte.user.secondLN}</td>
                    <td className="">
                      {corte.workShift === "morning"
                        ? "Matutino"
                        : corte.workShift === "evening"
                        ? "Vespertino"
                        : "Nocturno"}
                    </td>

                    <td className="min-w-[60px]">
                      <button
                        className="btn-primary mt-1 mb-1"
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

        {/* Modal para mostrar detalles */}
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
              className="btn-print text-white"
            >
              Guardar
            </Button>,
            <Button
              key="close"
              onClick={() => setModalVisible(false)}
              className="btn-cancel-modal text-white"
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
                    <span className="font-bold">Usuario:</span>{" "}
                    {selectedCorte.user.name}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Turno:</span>{" "}
                    {selectedCorte.workShift === "morning"
                        ? "Matutino"
                        : selectedCorte.workShift === "evening"
                        ? "Vespertino"
                        : "Nocturno"}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Fecha:</span>{" "}
                    {formatDate(selectedCorte.cashCutD)}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Dinero en Fondo:</span> $
                    {selectedCorte.initialCash ? selectedCorte.initialCash : 0}
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

export default Reportes;
