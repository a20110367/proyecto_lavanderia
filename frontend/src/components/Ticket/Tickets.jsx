const ticketPaid = `
<form class="form-container" id="container" style="font-size:small">
    <div class="PrintOnly">
        <div class="info" style="text-align: center;"> 
            <img src="${
              IMAGES.caprelogo
            }" width="150" height="100" alt="logo" class="logo">
            <p>**CAPREL**</p>
            <p>VISTA A LA CAMPIÑA #3215, COL. MIRADOR DEL TESORO</p>
            <p>TLAQUEPAQUE, JALISCO</p>
            <p>TEL. (33) 30001789</p>
            <p>RFC: RORS010912QZ6</p>
        </div>
        <hr class="hr-header">
        <div style=" padding-top: 0px">                    
            <h2>FOLIO No.: 87668</h2>
            <h2>TIPO PAGO: ANTICIPADO</h2>                     
            ${
              paid ? "<h2>PAGADO</h2>" : "<h2>NO PAGADO</h2>"
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
            <h4 style="text-align:center;">Total Pagado: $95.00</h4>
            <!--*<p style="text-align:center;">NOVENTA Y CINCO Pesos 00/100 M.N.)</p>-->
            <p style="text-align:center;">${word}</p>            
                <p>F. PAGO: EFECTIVO</p>
                <p>Pago recibido: $100.00</p>
                <p>Cambio devuelto: $5.00</p> 
                <p>Cajero: YADIRA</p> 
            <hr class="hr-header">   
                <p>Cliente: biagai</p>         
                <p>F. Recepción: 20/07/2023 JUEVES 09:35 PM</p>
                <h4>F. Entrega: 22/07/2023 SABADO 12:00 PM</h4>        
                <hr class="hr-header">
            <p>Observaciones Generales: </p>
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

export default ticketPaid;