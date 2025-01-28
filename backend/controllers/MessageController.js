import { transporter } from "./utils/mailer.js";
import { restAPI } from "./utils/greenapi.js";
import { jsPDF } from "jspdf";
import { formatDate } from './utils/format.js';
import * as fs from 'fs';
import moment from 'moment'
moment.locale('es-mx');

export const sendMessage = async (req, res) => {
    const { id_order, name, email, tel, message, subject, text, warning } = req.body
    let output = ''
    warning ?
        output = `
        <h2>${message}</h2>
    ` :
        output = `
        <h3>Detalles del Pedido:</h3>
        <ul>  
            <li>Folio: ${id_order}</li> 
            <li>Nombre: ${name}</li>
            <li>Correo Electronico: ${email}</li>            
        </ul>
        <h3>Cuerpo</h3>
        <p>${message}</p>
    `

    try {
        const info = await transporter.sendMail({
            from: `"${subject}👻" <pyrop59@gmail.com>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            // html: "<b>Tamal</b>", // html body
            html: output,
        });

        console.log("Mail Message sent:  %s", info.messageId);

        restAPI.message.sendMessage(tel + "@c.us", null, message).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const notifyAll = async (req, res) => {
    const { filteredOrder } = req.body
    for (const order of filteredOrder) {
        console.log(order.id_order)
        const message = `Tu pedido con el folio: ${order.id_order} está listo, Ya puedes pasar a recogerlo.`
        const subject = `Tu Ropa esta Lista ${order.client.name}`
        const text = `Tu ropa esta lista, esperamos que la recojas a su brevedad`

        const output = `
        <h3>Detalles del Pedido:</h3>
        <ul>  
            <li>Folio: ${order.id_order}</li> 
            <li>Nombre: ${order.client.name}</li>
            <li>Correo Electronico: ${order.client.email}</li>            
        </ul>
        <h3>Cuerpo</h3>
        <p>${message}</p>
    `

        try {
            const info = await transporter.sendMail({
                from: `"${subject}👻" <pyrop59@gmail.com>`, // sender address
                to: order.client.email, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                // html: "<b>Tamal</b>", // html body
                html: output,
            });

            console.log("Mail Message sent:  %s", info.messageId);

            // restAPI.message.sendMessage(tel+"@c.us", null , message).then((data) => {
            //     console.log("Whatsapp Message sent:  %s", data);
            // });    
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: 'Algo salio mal!' })
        }
    }
}

export const sendReport = async (req, res) => {

    const { reportType, serviceReportResponse, categoryId, serviceResponseId, productReportResponse, productId, productReportResponseId, incomeReport, startDate, endDate } = req.body

    // const doc = generateDoc(reportType, serviceReportResponse, categoryId, serviceResponseId, productReportResponse, productId, productReportResponseId);

    const doc = new jsPDF("p", "mm", "letter");
    const path_url = './controllers/utils/img/caprelogoThermalPrinter.png';
    const img = fs.readFileSync(path_url).toString('base64');

    if (reportType === 1) {

        doc.addImage(img, 'PNG', 150, 10, 48, 30)

        doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

        doc.text(`Fechas seleccionadas:`, 10, 30);
        doc.text(`(${formatDate(serviceReportResponse.startDate)}) - (${formatDate(serviceReportResponse.endDate)})`, 10, 40);

        doc.text(`No. Total de Servicios: ${serviceReportResponse.totalServiceNumberVerification}`, 10, 60);
        doc.text(`Total de Venta: $${serviceReportResponse.totalServiceSalesVerification}`, 10, 70);

        doc.setLineWidth(3)
        doc.line(10, 80, 205, 80, 'S');

        // Mostrar detalles de ingresos por servicio AUTOSERVICIO
        doc.text(`Detalles de Ingreso de Autoservicio:`, 10, 90);
        doc.setLineWidth(1)
        doc.line(10, 100, 205, 100, 'S');
        let count = 110;

        serviceReportResponse.selfServiceSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.serviceDescription}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio ENCARGO
        doc.text(`Detalles de Ingreso de Encargo:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.laundryServiceSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.serviceDescription}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio PLANCHADO
        doc.text(`Detalles de Ingreso de Planchado:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.ironServiceSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.serviceDescription}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio TINTORERIA
        doc.text(`Detalles de Ingreso de Tintoreria:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.drycleanServiceSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.serviceDescription}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio OTROS
        doc.text(`Detalles de Ingreso de Otros:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.otherServiceSumary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.serviceDescription}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio RESUMEN DE ORDENES
        doc.text(`Resumen de Estatus de la Ordenes:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.deliveryStatusOrderSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`${item.orderStatus === "delivered" ? "No. de Ordenes Entregas:" : item.orderStatus === "pending" ? "No. de Ordenes Pendientes:" : item.orderStatus === "inProgress" ? "No. de Ordenes en Progreso:" : "No. de Ordenes Terminadas:"} ${item._count.id_order}`, 10, count);
            count += 10;
            doc.text(`No. de Servicios: ${item._sum.numberOfItems}`, 10, count);
            count += 10;
            doc.text(`Total: $${item._sum.totalPrice}`, 10, count);
            count += 10;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio RESUMEN DE ESTATUS DE PAGO
        doc.text(`Resumen de Estatus de Pago:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        serviceReportResponse.payStatusOrderSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                count = 40;
            }
            doc.text(`${item.payStatus === "paid" ? "No. de Ordenes Pagadas:" : "No. de Ordenes NO Pagadas:"} ${item._count.id_order}`, 10, count);
            count += 10;
            doc.text(`No. de Servicios: ${item._sum.numberOfItems}`, 10, count);
            count += 10;
            doc.text(`Total: $${item._sum.totalPrice}`, 10, count);
            count += 10;
        })

        doc.addPage();
        doc.addImage(img, 'PNG', 150, 10, 48, 30)
        // Mostrar detalles de ingresos por servicio TINTORERIA
        doc.text(`Ordenes Canceladas:`, 10, 10);
        doc.setLineWidth(1)
        doc.line(10, 25, 205, 25, 'S');
        count = 40;

        doc.text(`"No. de Ordenes Canceladas: ${serviceReportResponse.cancelledOrderSummary._count.id_order}`, 10, count);
        count += 10;
        doc.text(`No. de Servicios: ${serviceReportResponse.cancelledOrderSummary._sum.numberOfItems ? serviceReportResponse.cancelledOrderSummary._sum.numberOfItems : 0}`, 10, count);
        count += 10;
        doc.text(`Total: $${serviceReportResponse.cancelledOrderSummary._sum.totalPrice ? serviceReportResponse.cancelledOrderSummary._sum.totalPrice : 0}`, 10, count);
        count += 10;

    } else if (reportType === 2) {

        doc.addImage(img, 'PNG', 125, 10, 48, 30)

        doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

        doc.text(`Fechas seleccionadas:`, 10, 30);
        doc.text(`(${formatDate(serviceResponseId.startDate)}) - (${formatDate(serviceResponseId.endDate)})`, 10, 40);

        doc.setLineWidth(3)
        doc.line(10, 80, 205, 80, 'S');

        // Mostrar detalles de ingresos por servicio
        doc.text(`Detalles de Ingresos del Servicio:`, 10, 90);
        doc.setLineWidth(1)
        doc.line(10, 100, 205, 100, 'S');
        let count = 110;

        doc.text(`Descripción: ${serviceResponseId.summary[0].description}`, 10, count);
        count += 10;
        doc.text(`Subtotal: $${serviceResponseId.summary[0]._sum.subtotal}`, 10, count);
        count += 10;
        doc.text(`Unidades: ${serviceResponseId.summary[0]._sum.units}`, 10, count);
        count += 20;
    } else if (reportType === 3) {

        doc.addImage(img, 'PNG', 150, 10, 48, 30)

        doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

        doc.text(`Fechas seleccionadas:`, 10, 30);
        doc.text(`(${formatDate(productReportResponse.startDate)}) - (${formatDate(productReportResponse.endDate)})`, 10, 40);

        doc.text(`No. Total de Productos: ${productReportResponse.totalSuppliesNumberVerification}`, 10, 60);
        doc.text(`Total de Venta: $${productReportResponse.totalSuppliesSalesVerification}`, 10, 70);

        doc.setLineWidth(3)
        doc.line(10, 80, 205, 80, 'S');

        // Mostrar detalles de ingresos por servicio
        doc.text(`Detalles de Ingresos por Producto:`, 10, 90);
        doc.setLineWidth(1)
        doc.line(10, 100, 205, 100, 'S');
        let count = 110;

        productReportResponse.suppliesSummary.forEach(item => {
            if (count >= 250) {
                doc.addPage();
                doc.addImage(img, 'PNG', 150, 10, 48, 30)
                count = 40;
            }
            doc.text(`Descripción: ${item.description}`, 10, count);
            count += 10;
            doc.text(`Subtotal: $${item._sum.subtotal}`, 10, count);
            count += 10;
            doc.text(`Unidades: ${item._sum.units}`, 10, count);
            count += 20;
        })

    } else if (reportType === 4) {

        doc.addImage(img, 'PNG', 150, 10, 48, 30)

        doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

        doc.text(`Fechas seleccionadas:`, 10, 30);
        doc.text(`(${formatDate(productReportResponseId.startDate)}) - (${formatDate(productReportResponseId.endDate)})`, 10, 40);

        doc.setLineWidth(3)
        doc.line(10, 80, 205, 80, 'S');

        // Mostrar detalles de ingresos por servicio
        doc.text(`Detalles de Ingresos por Producto:`, 10, 90);
        let count = 110;

        doc.text(`Descripción: ${productReportResponseId.suppliesSummary.description}`, 10, count);
        count += 10;
        doc.text(`Subtotal: $${productReportResponseId.suppliesSummary._sum.subtotal}`, 10, count);
        count += 10;
        doc.text(`Unidades: ${productReportResponseId.suppliesSummary._sum.units}`, 10, count);
        count += 20;

    } else if (reportType === 5) {

        doc.addImage(img, 'PNG', 150, 10, 48, 30)

        doc.text(`REPORTE DEL DÍA (${moment().format("DD/MM/YYYY")})`, 10, 10);

        doc.text(`Fechas seleccionadas:`, 10, 30);
        doc.text(`(${formatDate(incomeReport.startDate)}) - (${formatDate(incomeReport.endDate)})`, 10, 40);

        doc.setLineWidth(3)
        doc.line(10, 80, 205, 80, 'S');

        doc.text(`Detalles de Ingresos:`, 10, 90);
        let count = 110;

        doc.text(`Ingresos por Efectivo: + $${incomeReport.incomeSummary._sum.cashIncome ? incomeReport.incomeSummary._sum.cashIncome : 0}`, 10, count);
        count += 10;
        doc.text(`Ingresos por Tarjeta: + $${incomeReport.incomeSummary._sum.creditIncome ? incomeReport.incomeSummary._sum.creditIncome : 0}`, 10, count);
        count += 10;
        doc.text(`Retiros: - $${incomeReport.incomeSummary._sum.withdrawal ? incomeReport.incomeSummary._sum.withdrawal : 0}`, 10, count);
        count += 10;
        doc.text(`Cancelaciones: - $${incomeReport.incomeSummary._sum.cancellations ? incomeReport.incomeSummary._sum.cancellations : 0}`, 10, count);
        count += 20;
        doc.text(`Ingresos Totales: $${incomeReport.incomeSummary._sum.totalIncome ? incomeReport.incomeSummary._sum.totalIncome : 0}`, 10, count);
        count += 20;

    } else console.error("Tipo de reporte no encontrado", "", "error");

    try {
        const info = await transporter.sendMail({
            from: `"Reporte del ${startDate} al ${endDate}." <pyrop59@gmail.com>`, // sender address
            to: 'proveedores.tyc@gmail.com', // list of receivers
            subject: `Reporte del ${startDate} al ${endDate}.`, // Subject line
            text: 'Revisa este reporte en formato pdf adjunto.', // plain text body
            attachments: [{
                filename: `reporte_${startDate}_${endDate}.pdf`,
                content: Buffer.from(doc.output('arraybuffer')),
                contentType: 'application/pdf',
                encoding: 'base64'
            }],
        });
        console.log("Report Mail Message sent:  %s", info.messageId);
        res.status(200).json('Report Sent!')
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendCashCut = async (req, res) => {

    const { pdf, date, hour } = req.body

    try {
        const info = await transporter.sendMail({
            from: `"Corte de caja realizado el dia de ${date} a las ${hour}" <pyrop59@gmail.com>`, // sender address
            to: 'proveedores.tyc@gmail.com', // list of receivers
            subject: `Corte de caja realizado el dia de ${date} a las ${hour}`, // Subject line
            text: 'Revisa este reporte en formato pdf adjunto.', // plain text body
            attachments: [{
                filename: `corteCaja_${date}_${hour}.pdf`,
                content: pdf,
                contentType: 'application/pdf',
                encoding: 'base64'
            }],
        });
        console.log("Cash Cut Mail Message sent:  %s", info.messageId);
        res.status(200).json('Report Sent!')
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendWarningCanceledOrder = async (req, res) => {

    const { canceledOrder, casher, date, cause } = req.body;
    const message = `// ${date} //
    La orden No. ${canceledOrder.id_order} | ${canceledOrder.payStatus === "paid" ? "PAGADA" : "NO PAGADA"} | 
    Pertenenciente al cliente:  ${canceledOrder.client.name} ${canceledOrder.client.firstLN} ${canceledOrder.client.secondLN}
    Fue cancelada por un monto de:  $${canceledOrder.totalPrice} Pesos
    Cancelada por el cajero:  ${casher}
    Por el motivo de:  ${cause}`;

    try {

        //OWNER
        restAPI.message.sendMessage(process.env.OWNER_PHONE + "@c.us", null, message).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
        res.status(200).json('Warning Sent!')

        //CLIENTe
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendWarningReceiptReprinted = async (req, res) => {

    const { casher } = req.body;
    const message = `// ${moment().format("DD-MM-YYYY")} //
    El usuario ${casher} ha reimpreso un recibo en corte de caja.`

    try {

        //OWNER
        restAPI.message.sendMessage(process.env.OWNER_PHONE + "@c.us", null, message).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
        res.status(200).json('Warning Sent!')

        //CLIENTe
    } catch (err) {
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendRecoveredPwd = async (res) => {

    const date = moment().format("DD-MM-YYYY");
    const messageUser = `// ${date} //
    Caprel: *${res.pass}*`

    const messageOwner = `// ${date} //
    El usuario *${res.username}* ha recuperado su contraseña`

    try {
        restAPI.message.sendMessage('521' + res.phone + "@c.us", null, messageUser).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });

        restAPI.message.sendMessage(process.env.OWNER_PHONE + "@c.us", null, messageOwner).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
        res.status(200).json('Warning Sent!')
    } catch (err) {
        console.error(err)
    }
}