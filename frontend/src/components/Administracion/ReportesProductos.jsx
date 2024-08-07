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
  const [totalCajaFechasSeleccionadas, setTotalCajaFechasSeleccionadas] = useState(0);
  const [reportResponse, setReportResponse] =  useState({
      startDate:"2024-09-12T00:10:10.000Z",
      endDate:"2024-09-12T00:10:10.000Z",
      totalSuppliesNumberVerification: 0,
      totalSuppliesSalesVerification: 0,
      suppliesSummary:[
      {
        fk_supplyId: 0,
        description: "Hardcoded Value 4 map 1",
        _sum: {
          subtotal:0,
          units: 0,
        }
      },
      {
        fk_supplyId: 1,
        description: "Hardcoded Value 4 map 2",
        _sum: {
          subtotal:0,
          units: 0,
        }
  }]})



  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);
  const [dateRange, setDateRange] = useState([null]);
  const [datesSelected, setDatesSelected] = useState(false);
  const [document, setDocument] = useState();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // function generateRandomColor(){
  //   const n = (Math.random() * 0xfffff * 1000000).toString(16);
  //   const des = document.getElementById("description-supply"); 
  //   des.style.backgroundColor = `#${n.slice(0,6)}`
  // }

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
    const pdf = new jsPDF();

    if (selectedCorte) {
      pdf.text(`Detalles del Corte`, 10, 10);
      pdf.text(`ID: ${selectedCorte.id_supplyCashCut}`, 10, 20);
      pdf.text(`Usuario: ${selectedCorte.user.name}`, 10, 30);
      pdf.text(
        `Turno: ${selectedCorte.workShift === "morning"
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
        `Ordenes Pagadas: ${selectedCorte.ordersPayed ? `${selectedCorte.ordersPayed}` : "0"
        }`,
        10,
        70
      );
      pdf.text(
        `Total Jabon: ${selectedCorte.totalJabon ? `$${selectedCorte.totalJabon}` : "$0"
        }`,
        10,
        90
      );
      pdf.text(
        `Total Suavitel: ${selectedCorte.totalSuavitel ? `$${selectedCorte.totalSuavitel}` : "$0"
        }`,
        10,
        100
      );
      pdf.text(
        `Total Pinol: ${selectedCorte.totalPinol ? `$${selectedCorte.totalPinol}` : "$0"
        }`,
        10,
        110
      );
      pdf.text(
        `Total Desengrasante: ${selectedCorte.totalDesengrasante
          ? `$${selectedCorte.totalDesengrasante}`
          : "$0"
        }`,
        10,
        120
      );
      pdf.text(
        `Total Cloro: ${selectedCorte.totalCloro ? `$${selectedCorte.totalCloro}` : "$0"
        }`,
        10,
        130
      );
      pdf.text(
        `Total Sanitizante: ${selectedCorte.totalSanitizante
          ? `$${selectedCorte.totalSanitizante}`
          : "$0"
        }`,
        10,
        140
      );
      pdf.text(
        `Total Bolsa: ${selectedCorte.totalBolsa ? `$${selectedCorte.totalBolsa}` : "$0"
        }`,
        10,
        150
      );
      pdf.text(
        `Total Reforzado: ${selectedCorte.totalReforzado
          ? `$${selectedCorte.totalReforzado}`
          : "$0"
        }`,
        10,
        160
      );
      pdf.text(
        `Total Ganchos: ${selectedCorte.totalGanchos ? `$${selectedCorte.totalGanchos}` : "$0"
        }`,
        10,
        170
      );
      pdf.text(
        `Total WC: ${selectedCorte.totalWC ? `$${selectedCorte.totalWC}` : "$0"
        }`,
        10,
        180
      );
      pdf.text(
        `Total Otros: ${selectedCorte.totalOtros ? `$${selectedCorte.totalOtros}` : "$0"
        }`,
        10,
        190
      );
      pdf.text(
        `Total Tarjeta: ${selectedCorte.totalCredit ? `$${selectedCorte.totalCredit}` : "$0"
        }`,
        10,
        210
      );
      pdf.text(
        `Total Efectivo: ${selectedCorte.totalCash ? `$${selectedCorte.totalCash}` : "$0"
        }`,
        10,
        220
      );
      pdf.text(
        `Total Ingresos: ${selectedCorte.totalIncome ? `$${selectedCorte.totalIncome}` : "$0"
        }`,
        10,
        230
      );
    }
    pdf.save("detalle_corte_productos.pdf");
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

  const handleGenerarReporte = async () => {
    try {
      if (filteredCortes.length > 0 && dateRange.length === 2) {
        const res = await api.get(`/suppliesReport/${moment(dateRange[0].toDate()).format()}/${moment(dateRange[1].toDate()).format()}`)
        console.log(res)
        if (res.data.suppliesSummary.length == 0) {
          Swal.fire('No hay reportes en esas fechas', "", "error")
        } else {
          setReportResponse(res.data)
          showModal()
        }
      }
    } catch (err) {
      Swal.fire("Hubo un error", "", "error");
      console.error(err);
    }
  };

  const handleGuardarPDF = async () => {
      await handleGenerarDocumento()
      const formattedStartDate = reportResponse.startDate.split("/").join("-");
      const formattedEndDate = reportResponse.endDate.split("/").join("-");
      document.save(`Reporte de productos ${formattedStartDate} - ${formattedEndDate}.pdf`);
      Swal.fire("Reporte Guardado", "", "success");
  }

  const handleEnviarPDF = async () => {
    await handleGenerarDocumento()
    const out = document.output("datauristring");
    await api.post("/sendReport", {
      startDate: formatDate(dateRange[0].toDate()),
      endDate: formatDate(dateRange[1].toDate())
      ,
      pdf: out.split("base64,")[1],
    });
    Swal.fire("Reporte Enviado", "", "success");
  }

  const handlePrint = async () => {
    try{
      await api.post("/generateReportProduct", {
        report: reportResponse,
      })
    }catch(err){
      Swal.fire("Error al imprimir", "", "error");
      console.error(err);
    }
  }

  const handleGenerarDocumento = async () => {
    const doc = new jsPDF("p", "mm", "letter");

    doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

    doc.text(`Fechas seleccionadas:`, 10, 30);
    doc.text(`(${formatDate(reportResponse.startDate)}) - (${formatDate(reportResponse.endDate)})`, 10, 40);

    doc.text(`No. Total para Verificación: $${reportResponse.totalSuppliesNumberVerification}`,10,60);
    doc.text(`Total de Venta para Verificación: $${reportResponse.totalSuppliesSalesVerification}`,10,70);

    doc.setLineWidth(3)
    doc.line(10,80, 205,80, 'S');

    // Mostrar detalles de ingresos por servicio
    doc.text(`Detalles de Ingresos por Producto:`, 10, 90);
    let count = 110;
    
    reportResponse.suppliesSummary.forEach( item => {
      if(count >= 250){
        doc.addPage();
        count = 40;
      }
      doc.text(`Descripción: ${item.description}`, 10, count);
      count += 10;
      doc.text(`ID: ${item.fk_supplyId}`, 10, count);
      count += 10;
      doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
      count += 10;
      doc.text(`Unidades: ${item._sum.units}`, 10, count);
      count += 20;
    })

    // doc.text(`Suavitel 100ml: $${report.sumTotalSuavitel}`, 10, 80);
    // doc.text(`ID: ${reportResponse.suppliesSummary[0].fk_supplyId}`, 10, 90)
    // doc.text(`Subtotal: ${reportResponse.suppliesSummary[0].subtotal}`, 10, 100)
    // doc.text(`Unidades: ${reportResponse.suppliesSummary[0].units}`, 10, 110)

    setDocument(doc);
  }

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
                onMouseEnter={(dates) => {
                  setDatesSelected(false);
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
                  onClick={handleGenerarReporte}
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
              Guardar
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
              <div className="w-1/2">
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

        <Modal title={`Reporte del día (${moment().format('DD/MM/YYYY')})`} open={isModalOpen} width={1000} onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button
              onClick={() => (handlePrint())}
              className="btn-generate text-white ml-4 text-center font-bold align-middle"
              key="print"
            >
              Imprimir
            </Button>,
            <Button
              onClick={() => (handleGuardarPDF())}
              className="btn-generate text-white ml-4 text-center font-bold align-middle"
              key="save"
            >
              Guardar
            </Button>,
            <Button
              onClick={() => (handleEnviarPDF())}
              className="btn-generate text-white ml-4 text-center font-bold align-middle"
              key="generate"
            >
              Enviar al Correo
            </Button>,
            <Button
              onClick={() => setIsModalOpen(false)}
              className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
              key="close"
            >
              Cerrar
            </Button>,
          ]}>
          {(
            <div className="flex overflow-scroll" style={{height: "700px"}}>
              {/* Primera Columna */}
              <div className="w-1/4 text-lg sticky top-10">
                <p className="text-lg font-bold">Fecha Inicial:</p>
                <p>{formatDate(reportResponse.startDate)}</p>

                <p className="text-lg font-bold">Fecha de Termino:</p>
                <p>{formatDate(reportResponse.endDate)}</p>
              </div>
              {/* Segunda Columna */}
              <div className="w-1/2 text-lg">
                <p className="font-bold text-xl">Detalles de Ingresos por Producto:</p>
                <br/>
                { reportResponse ? 
                  reportResponse.suppliesSummary.map( item => (
                  <div key={item.fk_supplyId}>
                    <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center"} >Descripción del Producto:</p>
                    <br/>
                    <p className="text-xl font-bold text-center">{item.description}</p>
                    <br/>
                    <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_supplyId}</span></p>
                    <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                    <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                    <br/>
                  </div>
                )) : <p className="text-lg" > Cargando Información...</p>}
              </div>
             {/* Tercera Columna */}
              <div className="w-1/3 text-lg sticky top-3/4 ml-5">
                <p className="font-bold text-xl">Resumen para Verificar:</p>
                <br/>

                <p className="font-bold"> No. Total para Verificación:</p>
                <p className="text-2xl">{reportResponse.totalSuppliesNumberVerification}</p>

                <p className="font-bold"> Total de Venta para Verificación:</p>
                <p className="text-2xl">${reportResponse.totalSuppliesSalesVerification}</p>
                
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
