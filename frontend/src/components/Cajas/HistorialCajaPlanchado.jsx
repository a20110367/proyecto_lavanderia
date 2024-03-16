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
import { BsFillLightningFill } from "react-icons/bs";

function HistorialCajaPlanchado() {
 
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
      const response = await api.get("/ironCuts");
      return response.data;
    } catch (error) {
      console.error("Error fetching cash cuts pieces  :", error);
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
    const pdf = new jsPDF();

    if (selectedCorte) {
      pdf.text(`Detalles del Corte`, 10, 10);
      pdf.text(`ID: ${selectedCorte.id_ironCut}`, 10, 20);
      pdf.text(
        `FECHA DE INICIO: ${formatDate(selectedCorte.startingDay)}`,
        10,
        30
      );
      pdf.text(`FECHA DE CIERRE: ${formatDate(selectedCorte.endDay)}`, 10, 40);

      pdf.text(`SERVICIOS POR ESTACION:`, 10, 60);
      pdf.text(
        `Estacion 1 Regular: ${
          selectedCorte.station1R ? `${selectedCorte.station1R}` : "0"
        }`,
        10,
        80
      );
      pdf.text(
        `Estacion 1 Express: ${
          selectedCorte.totalSuavitel ? `${selectedCorte.totalSuavitel}` : "0"
        }`,
        10,
        90
      );
      pdf.text(
        `Estacion 2 Regular: ${
          selectedCorte.station2R ? `${selectedCorte.station2R}` : "0"
        }`,
        10,
        100
      );
      pdf.text(
        `Estacion 2 Express: ${
          selectedCorte.station2E ? `${selectedCorte.station2E}` : "0"
        }`,
        10,
        120
      );
      pdf.text(
        `Estacion 3 Regular: ${
          selectedCorte.station3R ? `${selectedCorte.station3R}` : "0"
        }`,
        10,
        130
      );
      pdf.text(
        `Estacion 3 Express: ${
          selectedCorte.station3E ? `${selectedCorte.station3E}` : "0"
        }`,
        10,
        140
      );
      pdf.text(
        `Estacion 4 Regular: ${
          selectedCorte.station4R ? `${selectedCorte.station4R}` : "0"
        }`,
        10,
        150
      );
      pdf.text(
        `Estacion 4 Express: ${
          selectedCorte.station4E ? `${selectedCorte.station4E}` : "0"
        }`,
        10,
        160
      );

      pdf.save("detalle_corte_piezas.pdf");
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

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const filtered = Cortes.filter((corte) => {
        const corteDateStr = new Date(corte.startingDay)
          .toISOString()
          .split("T")[0];
        return corteDateStr >= startDateStr && corteDateStr <= endDateStr;
      });

      const startCorte = Cortes.find((corte) => {
        const corteDateStr = new Date(corte.startingDay)
          .toISOString()
          .split("T")[0];
        return corteDateStr === startDateStr;
      });

      const endCorte = Cortes.find((corte) => {
        const corteDateStr = new Date(corte.startingDay)
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
            <strong className="title-strong">
              Historial de Cortes <br /> de Planchado
            </strong>
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
                <th>
                  FECHA <br />
                  DE INICIO
                </th>
                <th>
                  FECHA <br />
                  DE CIERRE
                </th>
                <th>
                  ESTACION 1 <br />
                  REGULAR
                </th>
                <th>
                  ESTACION 1 <br />
                  EXPRESS
                  <BsFillLightningFill
                    className="text-yellow-300 inline-block ml-1.5"
                    size={15}
                  />
                </th>
                <th>
                  ESTACION 2 <br />
                  REGULAR
                </th>
                <th className="text-center">
                  ESTACION 2 <br />
                  EXPRESS
                  <BsFillLightningFill
                    className="text-yellow-300 inline-block ml-1.5"
                    size={15}
                  />
                </th>

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
                    key={corte.id_ironCut}
                  >
                    <td className="">{corte.id_ironCut}</td>
                    <td className="">{formatDate(corte.startingDay)}</td>
                    <td className="">{formatDate(corte.endDay)}</td>

                    <td className="">
                      {corte.station1R ? corte.station1R : 0}pz
                    </td>
                    <td className="">
                      {corte.station1E ? corte.station1E : 0}pz
                    </td>
                    <td className="">
                      {corte.station2R ? corte.station2R : 0}pz
                    </td>
                    <td className="">
                      {corte.station2E ? corte.station2E : 0}pz
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
              Guardar PDF
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
                  {selectedCorte.id_ironCut}
                </p>

                <p className="text-lg">
                  <span className="font-bold">Fecha de inicio:</span>{" "}
                  {formatDate(selectedCorte.startingDay)}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Fecha de cierre:</span>{" "}
                  {formatDate(selectedCorte.startingDay)}
                </p>
                <br />
              </div>
              {/* Tercera Columna */}
              <div className="w-1/3">
                <p className="text-lg">
                  <span className="font-bold">
                    Prendas Regulares por Plancha:
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-bold">Estacion 1 Regular: </span>
                  {selectedCorte.station1R ? selectedCorte.station1R : 0}
                </p>

                <p className="text-lg">
                  <span className="font-bold">Estacion 2 Regular: </span>
                  {selectedCorte.station2R ? selectedCorte.station2R : 0}
                </p>

                <p className="text-lg">
                  <span className="font-bold">Estacion 3 Regular: </span>
                  {selectedCorte.station3R ? selectedCorte.station3R : 0}
                </p>

                <p className="text-lg">
                  <span className="font-bold">Estacion 4 Regular: </span>
                  {selectedCorte.station4R ? selectedCorte.station4R : 0}
                </p>
              </div>
              {/* Segunda Columna */}
              <div className="w-1/3">
                <p className="text-lg">
                  <span className="font-bold">
                    Prendas Express por Plancha: <BsFillLightningFill
                    className="text-yellow-300 inline-block"
                    size={20}
                  />
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-bold">Estacion 1 Express: </span>
                  {selectedCorte.station1E ? selectedCorte.station1E : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Estacion 2 Express: </span>
                  {selectedCorte.station2E ? selectedCorte.station2E : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Estacion 3 Express: </span>
                  {selectedCorte.station3E ? selectedCorte.station3E : 0}
                </p>
                <p className="text-lg">
                  <span className="font-bold">Estacion 4 Express: </span>
                  {selectedCorte.station4E ? selectedCorte.station4E : 0}
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

export default HistorialCajaPlanchado;
