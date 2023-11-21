import IMAGES from "../../images/images";
import printJS from "print-js";
import moment from "moment";
import jsPDF from "jspdf";
import api from '../../api/api'
import { formatDate, formatTime } from "../../utils/format";

export const orderTicket = async (order) => {
    const date = moment().format("DD / MM / YYYY")
    const hour = moment().format("LT");

    let word = 'w'
    try {
        const res = await api.post("/numberToWord", {
            number: order.subtotal,
        });
        word = res.data
    } catch (e) {
        console.log('Error al convertir de número a letra')
    }
    const html = `
    <form class="form-container" id="container" style="font-size:small">
        <div class="PrintOnly">
            <div class="info" style="text-align: center;"> 
                <img src="${IMAGES.caprelogo
        }" width="150" height="100" alt="logo" class="logo">
                <p>**CAPREL**</p>
                <p>VISTA A LA CAMPIÑA #3215, COL. MIRADOR DEL TESORO</p>
                <p>TLAQUEPAQUE, JALISCO</p>
                <p>TEL. (33) 30001789</p>
                <p>RFC: RORS010912QZ6</p>
            </div>
            <hr class="hr-header">
            <div style=" padding-top: 0px">                    
                <h2>FOLIO No.: ${order.id_order} </h2>
                <h2>TIPO PAGO: ${order.payForm === 'advance' ? "Anticipado" : "A la Entrega"}</h2>                     
                ${order.payStatus === 'paid' ? "<h2>PAGADO</h2>" : "<h2>NO PAGADO</h2>"
        }                    
                <hr class="hr-header">  
                <div class="grid" style="display: grid; grid-template-columns: auto auto auto; padding: 10px;">
                    <p>Cant.</p>
                    <p>Servicio</p>
                    <p>Precio</p>
                    ${order.cart.map(detail => `<p>${detail.quantity}</p><p>${detail.description}</p><p>$${detail.totalPrice}</p>`).join('')}  
                </div>
                <hr class="hr-header">       
                    <h4 style="text-align:center;">Total Pagado: $${order.subtotal}</h4>
                    <p style="text-align:center;">${word}</p> 
                    ${order.payStatus === 'paid' ? `<div> <p>F. PAGO: ${order.payMethod === 'cash' ? "EFECTIVO" : "TARJETA"}</p> <!--<p>Pago recibido: $100.00</p> <p>Cambio devuelto: $5.00</p>--> <p>Cajero: ${order.casher}</p></div>` : ''}
                <hr class="hr-header">   
                    <p>Cliente: ${order.client}</p>         
                    <p>F. Recepción: ${formatDate(order.receptionDate)} JUEVES ${formatTime(order.receptionTime)}</p>
                    <h4>F. Entrega: ${formatDate(order.scheduledDeliveryDate)} SABADO ${formatTime(order.scheduledDeliveryTime)}</h4>        
                    <hr class="hr-header">
                <p>Observaciones Generales: ${order.notes}</p>
                <hr class="hr-header">
                <div style="text-align:center;">
                    <p>PROFECO N. REGISTRO: 4390/2013</p>
                    <p>N. EXPEDIENTE: PFC.B.E. 7/005243/20013</p>
                    <p>FECHA: ${date}</p>
                    <p>HORA: ${hour}</p>                    
                    <p>GRACIAS POR SU VISITA</p>
                </div>
            </div>
        </div>
    </form>
    `;

    const doc = new jsPDF()
    doc.html(html, {
        callback: function(doc) {
            // Save the PDF
            doc.save('sample-document.pdf');
        },
        x: 15,
        y: 15,
        w: 170,
        windowWidth: 750,
    });
    // pdf.autoPrint()

    //----------------------IMPRIMIR--------------------------//
    printJS({
        printable: html,
        type: "raw-html",
        header: "PrintJS - Form Element Selection",
        showModal: true,
        modalMessage: "Imprimiendo...",
        onError: (err) => console.log(err),
        fallbackPrintable: () => console.log("FallbackPrintable"),      
        onPrintDialogClose: () => console.log('The print dialog was closed')
        
        // css: './ticket.css'
    })
}

export const orderTicketPDF = async (order) => {

    const doc = new jsPDF();
    doc.text(`Ticket de Compra de: ${order.client}`, 10, 10);
    doc.text(`Le atendió:  ${order.casher}`, 10, 20);
    doc.text("Productos:", 10, 30);
    let y = 40;
    order.cart.forEach((service) => {
        doc.text(
            `${service.description} x ${service.quantity} - $${service.price * service.quantity
            }`,
            10,
            y
        );
        y += 10;
    });
    doc.text(`Subtotal: $${order.subtotal}`, 10, y + 10);
    doc.text(
        `Fecha de Recepcion: ${moment().format("DD / MM / YYYY")}`,
        10,
        y + 20
    );
    // Agregar el campo "Fecha de Entrega" al ticket
    doc.text(
        `Fecha de Entrega: ${order.scheduledDeliveryDate}`,
        10,
        y + 30
    );
    doc.text(`Forma de Pago: ${order.payForm}`, 10, y + 40);
    if (order.payForm === "advance") {
        doc.text(`Método de Pago Anticipado: ${order.payMethod}`, 10, y + 50);
    }
    doc.save("ticket_compra.pdf");

    //----------------------IMPRIMIR--------------------------//
}