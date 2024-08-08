import React, { useState, useEffect } from "react";
import locale from "antd/es/date-picker/locale/es_ES";
import { Modal, Button, DatePicker } from "antd";
import jsPDF from "jspdf";
import { Select } from "antd";
import { formatDate } from "../../utils/format";
import useSWR from "swr";
import api from "../../api/api";
import Swal from "sweetalert2";
import moment from "moment";

function Reportes() {

  const [serviceReportResponse, setServiceReportResponse] = useState({
    startDate: "2024-09-12T00:10:10.000Z",
    endDate: "2024-09-12T00:10:10.000Z",
    totalSuppliesNumberVerification: 0,
    totalSuppliesSalesVerification: 0,
    suppliesSummary: [
      {
        fk_supplyId: 0,
        description: "Hardcoded Value 4 map 1",
        _sum: {
          subtotal: 0,
          units: 0,
        }
      },
      {
        fk_supplyId: 1,
        description: "Hardcoded Value 4 map 2",
        _sum: {
          subtotal: 0,
          units: 0,
        }
      }]
  })

  // %%%%%%%%%%%%%%%%%%%%%%%%%% PRODUCTS 
  const [productReportResponse, setProductReportResponse] = useState({
    startDate: "2024-09-12T00:10:10.000Z",
    endDate: "2024-09-12T00:10:10.000Z",
    totalSuppliesNumberVerification: 0,
    totalSuppliesSalesVerification: 0,
    suppliesSummary: [
      {
        fk_supplyId: 0,
        description: "Hardcoded Value 4 map 1",
        _sum: {
          subtotal: 0,
          units: 0,
        }
      },
      {
        fk_supplyId: 1,
        description: "Hardcoded Value 4 map 2",
        _sum: {
          subtotal: 0,
          units: 0,
        }
      }]
  })

  const [productReportResponseId, setProductReportResponseId] = useState({
    startDate: "2024-09-12T00:10:10.000Z",
    endDate: "2024-09-12T00:10:10.000Z",
    fk_supplyId: 0,
    description: "Hardcoded Value 4 map 1",
    _sum: {
      subtotal: 0,
      units: 0,
    }
  })

  // %%%%%%%%%%%%%%%%%%%%%%%%%% VARS %%%%%%%%%%%%%%%%%%%%%%%%%% //
  const [dateRange, setDateRange] = useState([null]);
  const [datesSelected, setDatesSelected] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [reportType, setReportType] = useState(0);
  const [document, setDocument] = useState();

  // ========================== SERVICES 
  const [categoryId, setCategoryId] = useState(0);
  const [serviceId, setServiceId] = useState(0);

  // ========================== PRODUCTS
  const [productId, setProductId] = useState();
  const [products, setProducts] = useState([]);

  //-------------------------- MODALS STATES --------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGServiceOpen, setIsGServiceOpen] = useState(false);
  const [isIdServiceOpen, setIsIdServiceOpen] = useState(false);
  const [isGProductOpen, setIsGProductOpen] = useState(false);
  const [isIdProductOpen, setIsIdProductOpen] = useState(false);
  const [isDatePickerModal, setIsDatePickerModal] = useState(false);
  const [isIdProductResultModal, setIsIdProductResultModal] = useState(false);

  //-------------------------- REQUESTS --------------------------
  const fetcherProducts = async () => {
    const res = await api.get("/supplies");
    return res.data;
  };
  const { data: dataProducts } = useSWR("allSupplies", fetcherProducts);

  // const fetcherServices = async () => {
  //   const res = await api.get("/services");
  //   return res.data;
  // };
  // const { data: dataServices } = useSWR("allServices", fetcherServices);

  // $$$$$$$$$$$$$$$$$$$$$$$$ useEffect $$$$$$$$$$$$$$$$$$$$$$$$$$$ //
  useEffect(() => {
    if (!isFirstOpen) {
      showModal()
      setIsFirstOpen(true);
    }
    if (dataProducts) {
      setProducts(dataProducts);
    }
  }, [dataProducts]);

  //-------------------------- MODALS FUN --------------------------
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showGeneralServicesModal = () => {
    setIsGServiceOpen(true);
  };

  const showIdServicesModal = () => {
    setIsIdServiceOpen(true);
  };

  const showGeneralProductsModal = () => {
    setIsGProductOpen(true);
  };

  const showIdProductsModal = () => {
    setIsIdProductOpen(true);
  };

  const showIdProductResultModal = () => {
    setIsIdProductResultModal(true);
  };

  const datePickerModal = (number) => {
    setReportType(number);
    setIsDatePickerModal(true);
  }

  //-------------------------- FUNS --------------------------

  const handleGenerarDocumento = async () => {
    if (reportType === 1) {

    } else if (reportType === 2) {

    } else if (reportType === 3) {
      const doc = new jsPDF("p", "mm", "letter");

      doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

      doc.text(`Fechas seleccionadas:`, 10, 30);
      doc.text(`(${formatDate(productReportResponse.startDate)}) - (${formatDate(productReportResponse.endDate)})`, 10, 40);

      doc.text(`No. Total para Verificación: ${productReportResponse.totalSuppliesNumberVerification}`, 10, 60);
      doc.text(`Total de Venta para Verificación: $${productReportResponse.totalSuppliesSalesVerification}`, 10, 70);

      doc.setLineWidth(3)
      doc.line(10, 80, 205, 80, 'S');

      // Mostrar detalles de ingresos por servicio
      doc.text(`Detalles de Ingresos por Producto:`, 10, 90);
      let count = 110;

      productReportResponse.suppliesSummary.forEach(item => {
        if (count >= 250) {
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
      setDocument(doc);
    } else if (reportType === 4) {
      const doc = new jsPDF("p", "mm", "letter");
      doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

      doc.text(`Fechas seleccionadas:`, 10, 30);
      doc.text(`(${formatDate(productReportResponseId.startDate)}) - (${formatDate(productReportResponseId.endDate)})`, 10, 40);

      doc.setLineWidth(3)
      doc.line(10, 80, 205, 80, 'S');

      // Mostrar detalles de ingresos por servicio
      doc.text(`Detalles de Ingresos por Producto:`, 10, 90);
      let count = 110;

      doc.text(`Descripción: ${productReportResponseId.description}`, 10, count);
      count += 10;
      doc.text(`Subtotal: $${productReportResponseId._sum.subtotal}`, 10, count);
      count += 10;
      doc.text(`Unidades: ${productReportResponseId._sum.units}`, 10, count);
      count += 20;
      setDocument(doc);
    } else Swal.fire("Tipo de reporte no encontrado", "", "error");
  }

  const handleGuardarPDF = async () => {
    await handleGenerarDocumento()
    const formattedStartDate = productReportResponse.startDate.split("/").join("-");
    const formattedEndDate = productReportResponse.endDate.split("/").join("-");
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

  //%%%%%%%%%%%%%%%%%%%%% # SERVICE %%%%%%%%%%%%%%%%%%%%%

  //%%%%%%%%%%%%%%%%%%%%% GENERAL SERVICE
  //%%%%%%%%%%%%%%%%%%%%% ID SERVICE


  //%%%%%%%%%%%%%%%%%%%%% # PRODUCT %%%%%%%%%%%%%%%%%%%%%

  const handleGenerateProductReport = async () => {
    try {
      if (dateRange.length === 2) {
        const res = reportType === 3 ?
          await api.get(`/suppliesReport/${moment(dateRange[0].toDate()).format()}/${moment(dateRange[1].toDate()).format()}`)
          : await api.get(`/suppliesReport/${moment(dateRange[0].toDate()).format()}/${moment(dateRange[1].toDate()).format()}/${productId}`)

        // console.log(res)
        if (reportType === 3) {
          if (res.data.suppliesSummary.length == 0) {
            Swal.fire('No hay reportes en esas fechas', "", "error")
          } else {
            setProductReportResponse(res.data)
            showModal()
          }
        } else {
          setProductReportResponseId(res.data)
          showIdProductResultModal();
        }
      } else if (!dateRange || dateRange.length !== 2) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes seleccionar una fecha de inicio y una fecha de término para buscar.",
          confirmButtonColor: "#034078",
        });
        return;
      }
    } catch (err) {
      Swal.fire("Hubo un error", "", "error");
      console.error(err);
    }
  };

  //%%%%%%%%%%%%%%%%%%%%% GENERAL PRODUCT
  const handlePrint = async () => {
    try {
      await api.post("/generateReportProduct", {
        report: reportResponse,
      })
    } catch (err) {
      Swal.fire("Error al imprimir", "", "error");
      console.error(err);
    }
  }

  //%%%%%%%%%%%%%%%%%%%%% ID PRODUCT
  const handlePrintId = async () => {
    try {
      await api.post("/generateReportProduct", {
        report: reportResponse,
      })
    } catch (err) {
      Swal.fire("Error al imprimir", "", "error");
      console.error(err);
    }
  }

  return (
    <div>
      {/* MENU*/}
      <Modal title={`Generando un Reporte del día (${moment().format('DD/MM/YYYY')})`} open={isModalOpen} width={1000} onCancel={() => window.history.back()}
        footer={[
          <Button
            onClick={() => window.history.back()}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,]}>
        <div className="flex-auto justify-center" style={{ height: "500px" }}>
          <div className="w-full">
            <h1 className="text-center m-0 text-3xl font-bold">Reportes</h1>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
              <button onClick={() => datePickerModal(1)} className="btn-print w-3/4 h-1/3 font-semibold p-2 rounded-md px-4 ml-2 mt-2 text-xl mr-0">Reportes Generales de Servicios</button>
              <button onClick={() => datePickerModal(2)} className="btn-print w-3/4 h-1/3 font-semibold p-2 rounded-md px-4 ml-2 mt-2 text-xl mr-0">Reportes por Servicio en Especifico</button>
            </div>
            <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
              <button onClick={() => datePickerModal(3)} className="btn-back w-3/4 h-1/3 text-xl">Reportes Generales de Productos</button>
              <button onClick={() => datePickerModal(4)} className="btn-back w-3/4 h-1/3 text-xl">Reportes por Producto en Especifico</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* GENERAL SERVICE*/}
      <Modal title={`Reporte General de Servicios`} open={isGServiceOpen} width={1000} onCancel={() => { setIsGServiceOpen(false) }} maskClosable={false}
        footer={[null]}>
      </Modal>

      {/* ID SERVICE*/}
      <Modal title={`Reporte por Servicio en Especifico`} open={isIdServiceOpen} width={1000} onCancel={() => { setIsIdServiceOpen(false) }} maskClosable={false}
        footer={[null]}>
      </Modal>

      {/* GENERAL PRODUCT*/}
      <Modal title={`Resultado del Reporte General de Productos`} open={isGProductOpen} width={1000} onCancel={() => { setIsGProductOpen(false) }} maskClosable={false}
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
            onClick={() => setIsGProductOpen(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,
        ]}>
        <div className="flex overflow-scroll" style={{ height: "700px" }}>
          {/* Primera Columna */}
          <div className="w-1/4 text-lg sticky top-10">
            <p className="text-lg font-bold">Fecha Inicial:</p>
            <p>{formatDate(productReportResponse.startDate)}</p>

            <p className="text-lg font-bold">Fecha de Termino:</p>
            <p>{formatDate(productReportResponse.endDate)}</p>
          </div>
          {/* Segunda Columna */}
          <div className="w-1/2 text-lg">
            <p className="font-bold text-xl">Detalles de Ingresos por Producto:</p>
            <br />
            {productReportResponse ?
              productReportResponse.suppliesSummary.map(item => (
                <div key={item.fk_supplyId}>
                  <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center"} >Descripción del Producto:</p>
                  <br />
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <br />
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_supplyId}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}
          </div>
          {/* Tercera Columna */}
          <div className="w-1/3 text-lg sticky top-3/4 ml-5">
            <p className="font-bold text-xl">Resumen para Verificar:</p>
            <br />

            <p className="font-bold"> No. Total para Verificación:</p>
            <p className="text-2xl">{productReportResponse.totalSuppliesNumberVerification}</p>

            <p className="font-bold"> Total de Venta para Verificación:</p>
            <p className="text-2xl">${productReportResponse.totalSuppliesSalesVerification}</p>

          </div>
        </div>
      </Modal>

      {/* ID PRODUCT */}
      <Modal title={`Reporte por Producto en Especifico`} open={isIdProductOpen} width={1000} onCancel={() => { setIsIdProductOpen(false) }} maskClosable={false}
        footer={[
          <Button
            onClick={() => setIsIdProductOpen(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,
        ]}>
        <div className="flex-auto justify-center" style={{ height: "500px" }}>
          <div className="w-full">
            <h1 className="text-center m-0 text-3xl font-bold">Selecciona un Producto <br /> para  generar el reporte en especifico</h1>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
              <Select
                id="productTypes"
                style={{ width: "100%", fontSize: "16px" }}
                onChange={(value) => setProductId(value)}
                value={productId}
                defaultValue={"Selecciona un Producto."}
              >
                {products.map((item) =>
                  (<Select.Option key={item.id_supply} value={item.id_supply}>{item.description}</Select.Option>)
                )};
              </Select>
              <button onClick={() => {
                if (productId) {
                  handleGenerateProductReport();
                } else Swal.fire("Selecciona un producto", "", "info")
              }}
                className="btn-print w-3/4 h-1/3 font-semibold p-2 rounded-md px-4 ml-2 mt-16 text-xl mr-0">Buscar producto en especifico</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ID PRODUCT RESULT*/}
      <Modal title={`Resultado del Reporte por Producto en Especifico`} open={isIdProductResultModal} width={1000} onCancel={() => { setIsIdProductResultModal(false) }} maskClosable={false}
        footer={[
          <Button
            onClick={() => (handlePrintId())}
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
            onClick={() => setIsIdProductResultModal(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,
        ]}>
        <div className="flex overflow-scroll" style={{ height: "700px" }}>
          {/* Primera Columna */}
          <div className="w-1/4 text-lg sticky top-10">
            <p className="text-lg font-bold">Fecha Inicial:</p>
            <p>{formatDate(productReportResponseId.startDate)}</p>

            <p className="text-lg font-bold">Fecha de Termino:</p>
            <p>{formatDate(productReportResponseId.endDate)}</p>
          </div>
          {/* Segunda Columna */}
          <div className="w-1/2 text-lg">
            <p className="font-bold text-xl">Detalles de Ingresos por Producto:</p>
            <br />
            <div key={productReportResponseId.productId}>
              <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center"} >Descripción del Producto:</p>
              <br />
              <p className="text-xl font-bold text-center">{productReportResponseId.description}</p>
              <br />
              <p className="text-lg font-bold">ID: <span className="font-normal" >{productId}</span></p>
              <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {productReportResponseId._sum.subtotal}</span></p>
              <p className="text-lg font-bold" >Unidades: <span className="font-normal">{productReportResponseId._sum.units}</span></p>
              <br />
            </div>
          </div>
        </div>
      </Modal>

      {/*DATE PICKER*/}
      <Modal title={`Seleccionando Fecha`} open={isDatePickerModal} width={1000} onCancel={() => { setIsDatePickerModal(false) }} maskClosable={false}
        footer={[
          <Button
            onClick={() => setIsDatePickerModal(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,]}>
        <div className="flex-auto justify-center" style={{ height: "500px" }}>
          <DatePicker.RangePicker
            locale={locale}
            onChange={(dates) => {
              setDateRange(dates);
              if (!dates || dates.length === 0) {
                setDatesSelected(false);
              }
            }}
            onMouseEnter={() => {
              setDatesSelected(false);
            }}
            value={dateRange}
            format="DD/MM/YYYY"
            className="border-2 rounded-md py-2  pl-10  border-Cerulean mt-2"
          />
          <button className="btn-search" onClick={() => {
            switch (reportType) {
              case 1:
                showGeneralServicesModal();
                break;
              case 2:
                showIdServicesModal();
                break;
              case 3:
                handleGenerateProductReport()
                showGeneralProductsModal();
                break;
              case 4:
                showIdProductsModal();
                break;
              default:
                Swal.fire("Error de selección de Reportes", "", "error");
                break;
            }
          }
          }>
            Buscar
          </button>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl font-semibold mt-10">{`Fecha seleccionada:`}</p>
            <p className="text-3xl font-semibold mt-16">{dateRange[0] ? `${formatDate(dateRange[0].toDate())}` : "Esperando que seleccione una Fecha de Inicio"}</p>
            <p className="text-3xl font-semibold mt-8">-</p>
            <p className="text-3xl font-semibold mt-16">{dateRange[1] ? `${formatDate(dateRange[1].toDate())}` : "Esperando que seleccione una Fecha de Termino"}</p>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default Reportes;