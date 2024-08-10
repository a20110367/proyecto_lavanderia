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
    totalServiceSalesVerification: 0,
    totalServiceNumberVerification: 0,
    totalDeliveryStatusSalesVerification: 0,
    totalDeliveryStatusOrdersVerification: 0,
    totalDeliveryStatusItemsVerification: 0,
    totalPayStatusSalesVerification: 0,
    totalPayStatusNumberVerification: 0,
    totalPayStatusItemsVerification: 0,

    selfServiceSummary: [
      {
        _sum: {
          units: 46,
          subtotal: 2300
        },
        fk_selfService: 1,
        description: "Autoservicio Secado"
      },],
    laundryServiceSummary: [
      {
        _sum: {
          units: 4,
          subtotal: 200
        },
        fk_laundryService: 1,
        description: "Autoservicio Lavado 10K"
      },],
    ironServiceSummary: [
      {
        _sum: {
          units: 29,
          subtotal: 1800
        },
        fk_ironService: 1,
        description: "Planchado 12pzs"
      },],
    drycleanServiceSummary: [
      {
        _sum: {
          units: 36,
          subtotal: 3600
        },
        fk_drycleanService: 1,
        description: "Tintoreria 5pz"
      },],
    otherServiceSumary: [
      {
        _sum: {
          units: 14,
          subtotal: 560
        },
        fk_otherService: 1,
        description: "Lavado de tenis"
      },
    ],
    payStatusOrderSummary: [
      {
        _count: {
          id_order: 211
        },
        _sum: {
          totalPrice: 35396.75,
          numberOfItems: 416
        },
        payStatus: "paid"
      },],
    deliveryStatusOrderSummary: [
      {
        _count: {
          id_order: 186
        },
        _sum: {
          totalPrice: 28372.75,
          numberOfItems: 345
        },
        orderStatus: "delivered"
      },],
  })

  const [serviceResponseId, setServiceReportResponseId] = useState({
    startDate: "2024-09-12T00:10:10.000Z",
    endDate: "2024-09-12T00:10:10.000Z",
    fk_selfService: 0,
    fk_laundryService: 0,
    fk_ironService: 0,
    fk_drycleanService: 0,
    fk_otherService: 0,
    description: "Hardcoded Value 4 map 1",
    _sum: {
      subtotal: 0,
      units: 0,
    }
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
  const [categoryId, setCategoryId] = useState();
  const [serviceId, setServiceId] = useState();
  const [categories, setCategories] = useState([
    {
      description: "Autoservicio",
      category_id: 1,
    }, {
      description: "Encargo",
      category_id: 2,
    }, {
      description: "Planchado",
      category_id: 3,
    }, {
      description: "Tintoreria",
      category_id: 4,
    }, {
      description: "Varios",
      category_id: 5,
    }])
  const [services, setServices] = useState([]);

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
  const [isIdServiceResultModal, setIsIdServiceResultModal] = useState(false);

  //-------------------------- REQUESTS --------------------------
  const fetcherProducts = async () => {
    const res = await api.get("/supplies");
    return res.data;
  };
  const { data: dataProducts } = useSWR("allSupplies", fetcherProducts);

  const fetchData = async (category) => {
    if (isIdServiceOpen) {
      if (category === 1) {
        const res = await api.get("/servicesSelfService");
        return res.data;
      } else if (category === 2) {
        const res = await api.get("/servicesLaundry");
        return res.data;
      } else if (category === 3) {
        const res = await api.get("/servicesIron");
        return res.data;
      } else if (category === 4) {
        const res = await api.get("/servicesDryclean");
        return res.data;
      } else if (category === 5) {
        const res = await api.get("/servicesOtherService");
        return res.data;
      }
    }
  }

  // const fetcherSelfService = async () => {
  //   const res = await api.get("/servicesSelfService");
  //   return res.data;
  // }

  // const { data: dataSelfService } = useSWR("selfService", fetcherSelfService);

  // const fetcherLaundryService = async () => {
  //   const res = await api.get("/servicesLaundry");
  //   return res.data;
  // }

  // const { data: dataLaundryService } = useSWR("laundryService", fetcherLaundryService);

  // const fetcherIronService = async () => {
  //   const res = await api.get("/servicesIron");
  //   return res.data;
  // }

  // const { data: dataIronService } = useSWR("ironService", fetcherIronService);

  // const fetcherDryService = async () => {
  //   const res = await api.get("/servicesDryclean");
  //   return res.data;
  // }

  // const { data: dataDryService } = useSWR("dryService", fetcherDryService);

  // const fetcherOtherService = async () => {
  //   const res = await api.get("/servicesOtherService");
  //   return res.data;
  // }

  // const { data: dataOtherService } = useSWR("otherService", fetcherOtherService);

  // $$$$$$$$$$$$$$$$$$$$$$$$ useEffect $$$$$$$$$$$$$$$$$$$$$$$$$$$ //
  useEffect(() => {
    if (!isFirstOpen) {
      showModal()
      setIsFirstOpen(true);
    }
    if (dataProducts) {
      setProducts(dataProducts);
    }
    // const fetchData = async () => {
    //   if (dataSelfService || dataLaundryService || dataIronService || dataDryService || dataOtherService) {
    //     categoryId === 1 ? setServices(await dataSelfService)
    //       : categoryId === 2 ? setServices(await dataLaundryService)
    //         : categoryId === 3 ? setServices(await dataIronService)
    //           : categoryId === 4 ? setServices(await dataDryService)
    //             : categoryId === 5 ? setServices(await dataOtherService)
    //               : console.log("Esperando Datos")
    //   }
    // }
  }, [dataProducts]);

  // const onChangeCategory = async () => {
  //   if (dataSelfService && dataLaundryService && dataIronService && dataDryService && dataOtherService && categoryId) {
  //     switch (categoryId) {
  //       case 1:
  //         await setServices(dataSelfService);
  //         break;
  //       case 2:
  //         await setServices(dataLaundryService);
  //         break;
  //       case 3:
  //         await setServices(dataIronService);
  //         break;
  //       case 4:
  //         await setServices(dataDryService);
  //         break;
  //       case 5:
  //         await setServices(dataOtherService);
  //         break;
  //       default:
  //         Swal.fire("Categoria fuera de Rango, llame a IT", "", "error");
  //         break;
  //     }

  //   }
  // }

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

  const handlePrint = async () => {
    try {
      await api.post("/generateReportProduct", {
        report: reportResponse,
        reportType: reportType,
      })
    } catch (err) {
      Swal.fire("Error al imprimir", "", "error");
      console.error(err);
    }
  }

  //%%%%%%%%%%%%%%%%%%%%% # SERVICE %%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%% GENERAL SERVICE
  //%%%%%%%%%%%%%%%%%%%%% ID SERVICE
  const handleGenerateServiceReport = async () => {
    try {
      if (dateRange.length === 2) {
        const res = reportType === 1 ?
          await api.get(`/servicesReport/${moment(dateRange[0].toDate()).format()}/${moment(dateRange[1].toDate()).format()}`)
          : await api.get(`/servicesReport/${moment(dateRange[0].toDate()).format()}/${moment(dateRange[1].toDate()).format()}/${categoryId}/${serviceId}`)

        // console.log(res)
        if (reportType === 1) {
          if (res.data.selfServiceSummary.length == 0
            || res.data.laundryServiceSummary.length == 0
            || res.data.ironServiceSummary.length == 0
            || res.data.drycleanServiceSummary.length == 0
            || res.data.otherServiceSumary.length == 0
          ) {
            Swal.fire('No hay reportes en esas fechas', "", "error")
          } else {
            setServiceReportResponse(res.data)
            showGeneralServicesModal()
            console.log(res.data)
          }
        } else {
          setServiceReportResponseId(res.data)
          console.log(res.data)
          showIdServicesModal()
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


  //%%%%%%%%%%%%%%%%%%%%% # PRODUCT %%%%%%%%%%%%%%%%%%%%%
  //%%%%%%%%%%%%%%%%%%%%% GENERAL PRODUCT
  //%%%%%%%%%%%%%%%%%%%%% ID PRODUCT
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
            showGeneralProductsModal();
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
      <Modal title={`Reporte General de Servicios`} open={isGServiceOpen} width={1300} onCancel={() => { setIsGServiceOpen(false) }} maskClosable={false}
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
            onClick={() => setIsGServiceOpen(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,
        ]}>
        <div className="flex" style={{ height: "700px" }}>
          {/* Primera Columna */}
          <div className="w-1/6 text-lg sticky top-10">
            <p className="text-lg font-bold">Fecha Inicial:</p>
            <p>{formatDate(serviceReportResponse.startDate)}</p>

            <p className="text-lg font-bold">Fecha de Termino:</p>
            <p>{formatDate(serviceReportResponse.endDate)}</p>
          </div>
          {/* Segunda Columna */}
          <div className="w-1/3 text-lg overflow-scroll">
            <p className="font-bold text-xl">Detalles:</p>
            <br />

            <p className={"text-white text-lx font-bold rounded-md bg-sky-500 text-center py-2"} ></p>
            <p className="text-xl font-bold text-center">AutoServicio</p>
            {serviceReportResponse ?
              serviceReportResponse.selfServiceSummary.map(item => (
                <div key={item.fk_selfService}>
                  <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_selfService}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}

            <p className={"text-white text-lx font-bold rounded-md bg-rose-500 text-center py-2"} ></p>
            <p className="text-xl font-bold text-center">Encargo</p>
            {serviceReportResponse ?
              serviceReportResponse.laundryServiceSummary.map(item => (
                <div key={item.fk_laundryService}>
                  <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_laundryService}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}

            <p className={"text-white text-lx font-bold rounded-md bg-yellow-500 text-center py-2"} ></p>
            <p className="text-xl font-bold text-center">Planchado</p>
            {serviceReportResponse ?
              serviceReportResponse.ironServiceSummary.map(item => (
                <div key={item.fk_ironService}>
                  <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_ironService}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}

            <p className={"text-white text-lx font-bold rounded-md bg-lime-500 text-center py-2"} ></p>
            <p className="text-xl font-bold text-center">Tintoreria</p>
            {serviceReportResponse ?
              serviceReportResponse.drycleanServiceSummary.map(item => (
                <div key={item.fk_drycleanService}>
                  <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_drycleanService}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}

            <p className={"text-white text-lx font-bold rounded-md bg-orange-500 text-center py-2"} ></p>
            <p className="text-xl font-bold text-center">Otros</p>
            {serviceReportResponse ?
              serviceReportResponse.otherServiceSumary.map(item => (
                <div key={item.fk_otherService}>
                  <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_otherService}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}
          </div>
          {/* Tercera Columna */}
          <div className="w-1/4 text-lg sticky overflow-scroll top-0 ml-20 ">
            <p className="font-bold text-xl">Resumen de Ordenes:</p>
            <p className="font-bold text-lg">Resumen de Estatus de la Ordenes:</p>
            <p className={"text-white text-lx font-bold rounded-md bg-red-900 text-center py-2"} ></p>
            {serviceReportResponse.deliveryStatusOrderSummary.map(item => (
              <div key={item.fk_otherService}>
                <p className="font-bold">{item.orderStatus === "delivered" ? "No. de Ordenes Entregas:" : item.orderStatus === "pending" ? "No. de Ordenes Pendientes:" : item.orderStatus === "cancelled" ? "No. de Ordenes Canceladas:" : "No. de Ordenes Terminadas:"}</p>
                <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                <p className="text-lg">{item._count.id_order}</p>
                <p className="font-bold">No. de Servicios:</p>
                <p className="text-lg">{item._sum.numberOfItems}</p>
                <p className="font-bold">Total:</p>
                <p className="text-lg">${item._sum.totalPrice}</p>
                <br />
              </div>
            ))}
            <p className="font-bold text-lg">Resumen de Estatus de Pago:</p>
            <p className={"text-white text-lx font-bold rounded-md bg-blue-900 text-center py-2"} ></p>
            {serviceReportResponse.payStatusOrderSummary.map(item => (
              <div key={item.fk_otherService}>
                <p className="font-bold">{item.payStatus === "paid" ? "No. de Ordenes Pagadas:" : "No. de Ordenes NO Pagadas:"}</p>
                <p className={"text-white text-lx font-bold rounded-md bg-slate-400 text-center py-2"} ></p>
                <p className="text-lg">{item._count.id_order}</p>
                <p className="font-bold">No. de Servicios:</p>
                <p className="text-lg">{item._sum.numberOfItems}</p>
                <p className="font-bold">Total:</p>
                <p className="text-lg">${item._sum.totalPrice}</p>
                <br />
              </div>
            ))}
          </div>
          {/* Cuarta Columna */}
          <div className="w-1/4 text-lg sticky top-0 ml-20">
            <p className="font-bold text-xl">Resumen de Ordenes:</p>
            <p className="font-bold text-xl">Resumen General:</p>
            <p className="font-bold">No. Total de Ordenes:</p>
            <p className="text-2xl">{serviceReportResponse.totalServiceNumberVerification}</p>

            <p className="font-bold">Venta Total:</p>
            <p className="text-2xl">${serviceReportResponse.totalServiceSalesVerification}</p>

          </div>
        </div>
      </Modal>

      {/* ID SERVICE*/}
      <Modal title={`Reporte por Servicio en Especifico`} open={isIdServiceOpen} width={1000} onCancel={() => { setIsIdServiceOpen(false) }} maskClosable={false}
        footer={[
          <Button
            onClick={() => setIsIdServiceOpen(false)}
            className="btn-cancel-modal text-white ml-4 text-center font-bold align-middle"
            key="close"
          >
            Cerrar
          </Button>,
        ]}>
        <div className="flex-auto justify-center" style={{ height: "500px" }}>
          <div className="w-full">
            <h1 className="text-center m-0 text-3xl font-bold">Selecciona un Servicio <br /> para  generar el reporte en especifico</h1>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
              {/*&&&&&&&&&&&&&&&&& CATEGORY SELECT*/}
              <Select
                id="categoryTypes"
                style={{ width: "100%", fontSize: "16px" }}
                onChange={async (value) => {
                  setCategoryId(value);
                  const services = await fetchData(value);
                  setServices(services);
                }}
                value={categoryId}
                defaultValue={"Selecciona una Categoria."}
              >
                {categories.map((item) =>
                  (<Select.Option key={item.category_id} value={item.category_id}>{item.description}</Select.Option>)
                )};
              </Select>
              {/*&&&&&&&&&&&&&&&&& SERVICE SELECT*/}
              <Select
                id="serviceTypes"
                style={{ width: "100%", fontSize: "16px", marginTop: "32px" }}
                onChange={(value) => setServiceId(value)}
                value={serviceId}
                defaultValue={"Selecciona un Servicio."}
                disabled={!categoryId}
              >
                {services.map((item) =>
                  (<Select.Option key={item.id_service} value={item.id_service}>{item.description}</Select.Option>)
                )};
              </Select>
              <button onClick={() => {
                if (serviceId) {
                  handleGenerateServiceReport();
                } else Swal.fire("Selecciona un Servicio", "", "info")
              }}
                className="btn-print w-3/4 h-1/3 font-semibold p-2 rounded-md px-4 ml-2 mt-16 text-xl mr-0">Buscar producto en especifico</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ID SERVICE RESULT*/}
      <Modal title={`Resultado del Reporte por Servicio en Especifico`} open={isIdServiceResultModal} width={1000} onCancel={() => { setIsIdServiceResultModal(false) }} maskClosable={false}
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
            onClick={() => setIsIdServiceResultModal(false)}
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
            <p>{formatDate(serviceResponseId.startDate)}</p>

            <p className="text-lg font-bold">Fecha de Termino:</p>
            <p>{formatDate(serviceResponseId.endDate)}</p>
          </div>
          {/* Segunda Columna */}
          <div className="w-1/2 text-lg">
            <p className="font-bold text-xl">Detalles del Producto:</p>
            <br />
            <div key={
              categoryId === 1 ? serviceResponseId.fk_selfService
                : categoryId === 2 ? serviceResponseId.fk_laundryService
                  : categoryId === 3 ? serviceResponseId.fk_ironService
                    : categoryId === 4 ? serviceResponseId.fk_drycleanService
                      : categoryId === 5 ? serviceResponseId.fk_otherService
                        : serviceResponseId.description}>
              <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center py-2"} ></p>
              <p className="text-xl font-bold text-center">{serviceResponseId.description}</p>
              <p className="text-lg font-bold">ID: <span className="font-normal" >{
                categoryId === 1 ? serviceResponseId.fk_selfService
                  : categoryId === 2 ? serviceResponseId.fk_laundryService
                    : categoryId === 3 ? serviceResponseId.fk_ironService
                      : categoryId === 4 ? serviceResponseId.fk_drycleanService
                        : categoryId === 5 ? serviceResponseId.fk_otherService
                          : serviceResponseId.description
              }</span></p>
              <p className="text-lg font-bold">Subtotal: <span className="font-normal">${serviceResponseId._sum.subtotal}</span></p>
              <p className="text-lg font-bold" >Unidades: <span className="font-normal">{serviceResponseId._sum.units}</span></p>
              <br />
            </div>
          </div>
        </div>
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
            <p className="font-bold text-xl">Detalles del Producto:</p>
            <br />
            {productReportResponse ?
              productReportResponse.suppliesSummary.map(item => (
                <div key={item.fk_supplyId}>
                  <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center py-2"} ></p>
                  <p className="text-xl font-bold text-center">{item.description}</p>
                  <p className="text-lg font-bold">ID: <span className="font-normal" >{item.fk_supplyId}</span></p>
                  <p className="text-lg font-bold">Subtotal: <span className="font-normal">$ {item._sum.subtotal}</span></p>
                  <p className="text-lg font-bold" >Unidades: <span className="font-normal">{item._sum.units}</span></p>
                  <br />
                </div>
              )) : <p className="text-lg" > Cargando Información...</p>}
          </div>
          {/* Tercera Columna */}
          <div className="w-1/3 text-lg sticky top-3/4 ml-5">
            <p className="font-bold text-xl">Resumen:</p>
            <br />

            <p className="font-bold">No. Total de Unidades:</p>
            <p className="text-2xl">{productReportResponse.totalSuppliesNumberVerification}</p>

            <p className="font-bold">Venta Total:</p>
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
            <p className="font-bold text-xl">Detalles del Producto:</p>
            <br />
            <div key={productReportResponseId.productId}>
              <p className={"text-white text-lx font-bold rounded-md bg-teal-900 text-center py-2"} ></p>
              <p className="text-xl font-bold text-center">{productReportResponseId.description}</p>
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
                handleGenerateServiceReport();
                break;
              case 2:
                showIdServicesModal();
                break;
              case 3:
                handleGenerateProductReport()
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