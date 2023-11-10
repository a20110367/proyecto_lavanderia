import IMAGES from "../../images/images";
import printJS from "print-js";
import moment from "moment";
import api from '../../api/api'

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime
}

async function ticket(order) {
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
                    <p>Color</p>
                    <p>Estampado</p>
                    <p>Fibra</p>
                    <p>Cant.</p>
                    <p>Producto</p>
                    <p>Precio</p>           
                    <p>1</p>
                    <p>EDREDON MATRIMONIAL</p>
                    <p>95.00</p>
                </div>
                <hr class="hr-header">       
                <h4 style="text-align:center;">Total Pagado: $${order.subtotal}</h4>
                <!--*<p style="text-align:center;">NOVENTA Y CINCO Pesos 00/100 M.N.)</p>-->
                <p style="text-align:center;">${word}</p>            
                    <p>F. PAGO: ${order.payMethod === 'cash' ? "EFECTIVO" : "TARJETA"}</p>
                    <p>Pago recibido: $100.00</p>
                    <p>Cambio devuelto: $5.00</p> 
                    <p>Cajero: ${order.casher}</p> 
                <hr class="hr-header">   
                    <p>Cliente: ${order.client}</p>         
                    <p>F. Recepción: 20/07/2023 JUEVES 09:35 PM</p>
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


    //----------------------IMPRIMIR--------------------------//
    printJS({
        printable: html,
        type: "raw-html",
        header: "PrintJS - Form Element Selection"
        // css: './ticket.css'
    })
}

export default ticket