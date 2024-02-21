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

function ReportesProductos() {
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
      const response = await api.get("/supplyCashCuts");
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
      pdf.text(`Detalles del Corte`, 10, 10);
      pdf.text(`ID: ${selectedCorte.id_supplyCashCut}`, 10, 20);
      pdf.text(`Usuario: ${selectedCorte.user.name}`, 10, 30);
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
      pdf.text(
        `Efectivo Inicial: ${
          selectedCorte.initialCash ? `$${selectedCorte.initialCash}` : "$0"
        }`,
        10,
        70
      );
      pdf.text(
        `Ordenes Pagadas: ${
          selectedCorte.ordersPayed ? `${selectedCorte.ordersPayed}` : "0"
        }`,
        10,
        80
      );
      pdf.text(
        `Total Jabon: ${
          selectedCorte.totalJabon ? `$${selectedCorte.totalJabon}` : "$0"
        }`,
        10,
        100
      );
      pdf.text(
        `Total Suavitel: ${
          selectedCorte.totalSuavitel ? `$${selectedCorte.totalSuavitel}` : "$0"
        }`,
        10,
        110
      );
      pdf.text(
        `Total Pinol: ${
          selectedCorte.totalPinol ? `$${selectedCorte.totalPinol}` : "$0"
        }`,
        10,
        120
      );
      pdf.text(
        `Total Desengrasante: ${
          selectedCorte.totalDesengrasante
            ? `$${selectedCorte.totalDesengrasante}`
            : "$0"
        }`,
        10,
        130
      );
      pdf.text(
        `Total Cloro: ${
          selectedCorte.totalCloro ? `$${selectedCorte.totalCloro}` : "$0"
        }`,
        10,
        140
      );
      pdf.text(
        `Total Sanitizante: ${
          selectedCorte.totalSanitizante
            ? `$${selectedCorte.totalSanitizante}`
            : "$0"
        }`,
        10,
        150
      );
      pdf.text(
        `Total Bolsa: ${
          selectedCorte.totalBolsa ? `$${selectedCorte.totalBolsa}` : "$0"
        }`,
        10,
        160
      );
      pdf.text(
        `Total Reforzado: ${
          selectedCorte.totalReforzado
            ? `$${selectedCorte.totalReforzado}`
            : "$0"
        }`,
        10,
        170
      );
      pdf.text(
        `Total Ganchos: ${
          selectedCorte.totalGanchos ? `$${selectedCorte.totalGanchos}` : "$0"
        }`,
        10,
        180
      );
      pdf.text(
        `Total WC: ${
          selectedCorte.totalWC ? `$${selectedCorte.totalWC}` : "$0"
        }`,
        10,
        190
      );
      pdf.text(
        `Total Otros: ${
          selectedCorte.totalOtros ? `$${selectedCorte.totalOtros}` : "$0"
        }`,
        10,
        200
      );
      pdf.text(
        `Total Tarjeta: ${
          selectedCorte.totalCredit ? `$${selectedCorte.totalCredit}` : "$0"
        }`,
        10,
        220
      );
      pdf.text(
        `Total Efectivo: ${
          selectedCorte.totalCash ? `$${selectedCorte.totalCash}` : "$0"
        }`,
        10,
        230
      );
      pdf.text(
        `Total Ingresos: ${
          selectedCorte.totalIncome ? `$${selectedCorte.totalIncome}` : "$0"
        }`,
        10,
        240
      );
    }
  };

  const handleFiltroPorFecha = () => {
    if (!dateRange || dateRange.length !== 2) {
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
    try {
      if (filteredCortes.length > 0 && dateRange.length === 2) {
        const doc = new jsPDF();

        const report = {
          sumOrdersPayed: 0,
          sumTotalJabon: 0,
          sumTotalSuavitel: 0,
          sumTotalPinol: 0,
          sumTotalDesengrasante: 0,
          sumTotalCloro: 0,
          sumTotalSanitizante: 0,
          sumTotalBolsa: 0,
          sumTotalReforzado: 0,
          sumTotalGanchos: 0,
          sumTotalWC: 0,
          sumTotalOtros: 0,
          sumTotalCredit: 0,
          sumTotalCash: 0,
          sumTotalIncome: 0,
        };

        filteredCortes.map((corte) => {
          report.sumOrdersPayed += corte.ordersPayed || 0;
          report.sumTotalJabon += corte.totalJabon || 0;
          report.sumTotalSuavitel += corte.totalSuavitel || 0;
          report.sumTotalPinol += corte.totalPinol || 0;
          report.sumTotalDesengrasante += corte.totalDesengrasante || 0;
          report.sumTotalCloro += corte.totalCloro || 0;
          report.sumTotalSanitizante += corte.totalSanitizante || 0;
          report.sumTotalBolsa += corte.totalBolsa || 0;
          report.sumTotalReforzado += corte.totalReforzado || 0;
          report.sumTotalGanchos += corte.totalGanchos || 0;
          report.sumTotalWC += corte.totalWC || 0;
          report.sumTotalOtros += corte.totalOtros || 0;
          report.sumTotalCredit += corte.totalCredit || 0;
          report.sumTotalCash += corte.totalCash || 0;
          report.sumTotalIncome += corte.totalIncome || 0;
        });

        doc.text(`Total de Caja de las Fechas Seleccionadas`, 10, 10);

        // Obtener las fechas seleccionadas en formato legible
        const startDate = formatDate(dateRange[0].toDate());
        const endDate = formatDate(dateRange[1].toDate());

        doc.text(`Fechas seleccionadas: ${startDate} - ${endDate}`, 10, 20);

        doc.text(
          `Total de Ingresos en Efectivo: $${report.sumTotalCash}`,
          10,
          40
        );
        doc.text(
          `Total de Ingresos en Tarjeta: $${report.sumTotalCredit}`,
          10,
          50
        );
        // Mostrar detalles de ingresos por servicio
        doc.text(`Detalles de Ingresos por Producto:`, 10, 70);
        doc.text(`Ordenes Pagadas: ${report.sumOrdersPayed}`, 10, 80);
        doc.text(`Total Jabón: $${report.sumTotalJabon}`, 10, 90);
        doc.text(`Total Suavitel: $${report.sumTotalSuavitel}`, 10, 100);
        doc.text(`Total Pinol: $${report.sumTotalPinol}`, 10, 110);
        doc.text(
          `Total Desengrasante: $${report.sumTotalDesengrasante}`,
          10,
          120
        );
        doc.text(`Total Cloro: $${report.sumTotalCloro}`, 10, 130);
        doc.text(`Total Sanitizante: $${report.sumTotalSanitizante}`, 10, 140);
        doc.text(`Total Bolsa: $${report.sumTotalBolsa}`, 10, 150);
        doc.text(`Total Reforzado: $${report.sumTotalReforzado}`, 10, 160);
        doc.text(`Total Ganchos: $${report.sumTotalGanchos}`, 10, 170);
        doc.text(`Total WC: $${report.sumTotalWC}`, 10, 180);
        doc.text(`Total Otros: $${report.sumTotalOtros}`, 10, 190);
        doc.text(
          `Total (Suma de los Productos): $${report.sumTotalIncome}`,
          10,
          210
        );

        const formattedStartDate = startDate.split("/").join("-");
        const formattedEndDate = endDate.split("/").join("-");
        doc.save(`Reporte ${formattedStartDate} - ${formattedEndDate}.pdf`);

        const out = doc.output("datauristring");
        await api.post("/sendReport", {
          startDate: moment(dateRange[0]).format("DD-MM-YYYY"),
          endDate: moment(dateRange[1]).format("DD-MM-YYYY"),
          pdf: out.split("base64,")[1],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-center mt-4">
      <div>
        <div className="mb-3">
          <div className="title-container">
            <strong className="title-strong">Reportes de Productos</strong>
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
                  ORDENES <br />
                  PAGADAS
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
                  <tr
                    className="bg-white border-b"
                    key={corte.id_supplyCashCut}
                  >
                    <td className="">{corte.id_supplyCashCut}</td>
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
                      {corte.ordersPayed ? corte.ordersPayed : 0}
                    </td>

                    <td className="">
                      {corte.user.name} {corte.user.firsLN}{" "}
                      {corte.user.secondLN}
                    </td>
                    <td className="">
                      {" "}
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
              <div className="w-1/3">
                <p className="text-lg">
                  <span className="font-bold">ID:</span>{" "}
                  {selectedCorte.id_supplyCashCut}
                </p>
                <p className="text-lg text-white">
                  <span className="font-bold">Usuario:</span>{" "}
                  {selectedCorte.user.name}
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
                  <span className="font-bold">Dinero en Fondo:</span> $
                  {selectedCorte.initialCash}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Ordenes Pagadas: </span>
                  {selectedCorte.ordersPayed}
                </p>
                <br />
              </div>
              {/* Tercera Columna */}
              <div className="w-1/3">
                <p className="text-lg">
                  <span className="font-bold">Ingreso de Productos:</span>
                </p>
                <p className="text-lg">
                  <span className="font-bold">Jabón:</span> $
                  {selectedCorte.totalJabon ? selectedCorte.totalJabon : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Suavitel:</span> $
                  {selectedCorte.totalSuavitel
                    ? selectedCorte.totalSuavitel
                    : 0}
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
              </div>
              {/* Segunda Columna */}
              <div className="w-1/1">
                <p className="text-lg">
                  <span className="font-bold">
                    Ingresos totales de productos:
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-bold">
                    Ingreso de productos con Efectivo:
                  </span>{" "}
                  ${selectedCorte.totalCash ? selectedCorte.totalCash : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">
                    Ingreso de productos con Tarjeta:
                  </span>{" "}
                  ${selectedCorte.totalCredit ? selectedCorte.totalCredit : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Ingreso total de productos:</span>{" "}
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

export default ReportesProductos;
