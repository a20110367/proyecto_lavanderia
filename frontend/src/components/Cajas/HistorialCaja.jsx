import React, { useState, useEffect } from "react";
import locale from "antd/es/date-picker/locale/es_ES";
import { Modal, Button, DatePicker } from "antd";
import jsPDF from "jspdf";
import ReactPaginate from "react-paginate";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useSWR, { useSWRConfig } from "swr";
import api from "../../api/api";

function HistorialCaja() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
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
      doc.text(`Turno: ${selectedCorte.turno}`, 10, 40);
      doc.text(
        `Fecha: ${formatDateToGMTMinus6(selectedCorte.cashCutD)}`,
        10,
        50
      );
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
      doc.text(
        `Total (Suma de los Servicios): $${selectedCorte.totalIncome}`,
        10,
        120
      );
      selectedCorte.totalCash
        ? doc.text(`Ingreso en Efectivo: $${selectedCorte.totalCash}`, 10, 130)
        : doc.text("Ingreso en Efectivo: $0", 10, 130);

      // Separación
      selectedCorte.totalCredit
        ? doc.text(`Ingreso en Tarjeta: $${selectedCorte.totalCredit}`, 10, 150)
        : doc.text("Ingreso en Tarjeta: $0", 10, 150);

      selectedCorte.totalCashWithdrawal
        ? doc.text(
            `Retiros Totales: $${selectedCorte.totalCashWithdrawal}`,
            10,
            160
          )
        : doc.text("Retiros Totales: $0", 10, 160);
      doc.text(`Final Total en Caja: $${selectedCorte.total}`, 10, 170);

      doc.save("detalle_corte.pdf");
    }
  };

  const handleFiltroPorFecha = () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange.map((date) => date.toDate());

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
    } else {
      if (!datesSelected) {
        setFilteredCortes(Cortes);
      }
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
              <button className="btn-search" onClick={handleFiltroPorFecha}>
                Buscar
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ overflowX: "auto" }}>
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th>No. Corte</th>
                <th>FECHA</th>
                <th>DINERO EN FONDO</th>
                <th>INGRESO EN EFECTIVO</th>
                <th>INGRESO EN TARJETA</th>
                <th>RETIROS TOTALES</th>
                <th>FINAL TOTAL CAJA</th>
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
                    <td className="">
                      {formatDateToGMTMinus6(corte.cashCutD)}
                    </td>
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
                    <td className="">{corte.user.name}</td>
                    <td className="">{corte.turno}</td>
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
              Imprimir
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
                    {selectedCorte.turno}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Fecha:</span>{" "}
                    {formatDateToGMTMinus6(selectedCorte.cashCutD)}
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

export default HistorialCaja;
