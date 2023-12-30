import { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } from 'node-thermal-printer';
import { NumerosALetras } from 'numero-a-letras'
import moment from 'moment'
moment.locale('es-mx');
// import 'moment/locale/es.js'         //IMPORTS PARA MAS IDIOMAS PARA MOMENT
// import 'moment/min/locales.min.js'   //IMPORTS PARA MAS IDIOMAS PARA MOMENT
// import 'moment/min/locales.js';      //IMPORTS PARA MAS IDIOMAS PARA MOMENT

console.log('PRINTER WORKING IN ' + process.env.INTERFACE)

let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: process.env.INTERFACE,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
});

export const generateTicket = async (req, res) => {

    const { order } = req.body

    let payMethod = ''
    let payStatus = ''
    let payForm = ''

    if (order.payMethod === 'cash') {
        payMethod = 'EFECTIVO'
    } else {
        payMethod = 'TARJETA'
    }
    if (order.payStatus === 'paid') {
        payStatus = 'PAGADO'
    } else {
        payStatus = 'NO PAGADO'
    }
    if (order.payForm === 'advance') {
        payForm = 'ANTICIPADO'
    } else {
        payForm = 'A LA ENTREGA'
    }

    try {
        // LOGO DEL NEGOCIO
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGrayINFO.png');

        printer.drawLine();
        printer.setTypeFontB();

        printer.setTextDoubleHeight();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "Folio: " + order.id_order, align: "LEFT", bold: true },
            { text: payStatus, align: "RIGHT" }
        ]);

        printer.setTextNormal();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "CATEGORIA: " + order.serviceType.toUpperCase(), align: "LEFT", bold: true },
            { text: "TIPO PAGO: " + payForm, align: "RIGHT" }
        ]);

        printer.setTextNormal();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "Cajero: " + order.casher, align: "LEFT", bold: true },
            { text: "FORMA PAGO: " + payMethod, align: "RIGHT" }
        ]);

        printer.drawLine();

        // printer.table(['Zero',"One", "Two", "Three", 'Four', 'Five']);  
        printer.tableCustom([
            { text: "Cant.", align: "LEFT" },
            { text: "Descripción", align: "CENTER", bold: true },
            { text: "Precio", align: "RIGHT" }
        ]);

        printer.newLine()

        order.cart.map(detail => {
            printer.tableCustom([
                { text: detail.quantity + '     X', align: "LEFT", bold: true },
                { text: detail.description, align: "CENTER" },
                { text: '$' + detail.totalPrice, align: "RIGHT" }
            ]);
        }).join('')

        printer.alignCenter()

        printer.drawLine();
        // printer.print("Hello World");                               // Append text
        // printer.println("Hello World");  

        printer.bold(true);                             // Append text with new line
        printer.println('Total Pagado: $' + order.subtotal)
        printer.bold(false);
        printer.println(n2word(order.subtotal))

        printer.alignLeft()

        printer.drawLine();

        printer.bold(true)
        if (order.pieces === 0) {
            printer.println('Cliente: ' + order.client)
        } else {
            printer.tableCustom([
                { text: 'Cliente: ' + order.client, align: "LEFT", bold: true },
                { text: 'PIEZAS: ' + order.pieces, align: "RIGHT" }
            ]);
        }
        printer.bold(false)

        printer.println('F.Recepción: ' + formatDate(order.receptionDate) + ' ' + formatTime(order.receptionTime))
        printer.bold(true);
        printer.println('F.Entrega: ' + formatDate(order.scheduledDeliveryDate) + ' ' + formatTime(order.scheduledDeliveryTime))
        printer.bold(false);

        printer.drawLine();

        printer.bold(true)
        printer.print('Observaciones Generales: ')
        printer.bold(false)
        printer.println(order.notes)

        printer.drawLine();

        printer.println('PROFECO NO. REGISTRO: 4390/2013')
        printer.println('NO. EXPEDIENTE PFC.B.E. 7/005243/20013')

        printer.tableCustom([
            { text: "FECHA: " + moment().format('l'), align: "LEFT", bold: true },
            { text: 'HORA: ' + moment().format('LT'), align: "RIGHT" },
        ]);

        printer.cut();
        let execute = await printer.execute()
        console.log(execute)
        console.log("Print done!");

        // printer.bold(true);                                         // Set text bold
        // printer.invert(true);                                       // Background/text color inversion
        // printer.underline(true);                                    // Underline text (1 dot thickness)
        // printer.underlineThick(true);                               // Underline text with thick line (2 dot thickness)                                        // Draws a line
        // printer.newLine();                                          // Inserts break line 

        // printer.alignCenter();                                      // Align text to center
        // printer.alignLeft();                                        // Align text to left
        // printer.alignRight();                                       // Align text to right

        // printer.setTypeFontA();                                     // Set font type to A (default)
        // printer.setTypeFontB();                                     // Set font type to B

        // printer.setTextNormal();                                    // Set text to normal
        // printer.setTextDoubleHeight();                              // Set text to double height
        // printer.setTextDoubleWidth();                               // Set text to double width
        // printer.setTextQuadArea();                                  // Set text to quad area
        // printer.setTextSize(7, 7);                                   // Set text height (0-7) and width (0-7)

        // printer.leftRight("Left", "Right");                         // Prints text left and right
        // printer.table(["One", "Two", "Three"]);                     // Prints table equally
        // printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
        //     { text: "Left", align: "LEFT", width: 0.5 },
        //     { text: "Center", align: "CENTER", width: 0.25, bold: true },
        //     { text: "Right", align: "RIGHT", cols: 8 }
        // ]);

        // printer.code128("Code128");                                 // Print code128 bar code
        // printer.printQR("QR CODE");                                 // Print QR code
        // await printer.printImage('./assets/olaii-logo-black.png');  // Print PNG image

        // printer.clear();                                              // Clears printText value
        // printer.getText();                                            // Returns printer buffer string value
        // printer.getBuffer();                                          // Returns printer buffer
        // printer.setBuffer(newBuffer);                                 // Set the printer buffer to a copy of newBuffer
        // printer.getWidth();

        // printer.printQR("Hola, Soy Homelo Pino", {
        //     cellSize: 6,             // 1 - 8
        //     correction: 'M',         // L(7%), M(15%), Q(25%), H(30%)
        //     model: 2                 // 1 - Model 1
        //                              // 2 - Model 2 (standard)
        //                              // 3 - Micro QR
        // });

        // for(let i = 0 ; i < 5 ; i++){
        //     printer.print("SACAME LA VERGA LUPE " + process.env.INTERFACE);
        // }                                       // Cuts the paper (if printer only supports one mode use this)
        res.status(200).json("Print done!");
    } catch (err) {
        console.error("Print failed:", err);
        res.status(400).json({ msg: err.message });
    }
}

const n2word = (number) => {
    try {
        const word = NumerosALetras(number);
        return word
    } catch (err) {
        console.error(err)
    }
}

const formatDate = (dateStr) => {
    const date = moment(dateStr).format("L")
    return date;
};

const formatTime = (dateStr) => {
    const date = moment(dateStr).format("dddd LT");
    return date
}

export const generatePartialCashCutTicket = async (req, res) => {
    try {

        const { cashCut } = req.body

        printer.setTypeFontB();

        // LOGO DEL NEGOCIO
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGrayINFO.png');

        printer.newLine()

        printer.setTextQuadArea()
        printer.println('CORTE DE CAJA PARCIAL')

        printer.setTextDoubleHeight();
        printer.println(`Folio No.: ${cashCut.cashCutId}`)

        printer.setTextNormal()
        printer.drawLine();

        printer.println(`Cajero: ${cashCut.casher}`)
        printer.println(`Cajero: ${cashCut.workShift === 'morning' ? 'Matutino' : 'Vespertino'}`)
        printer.println(`Fecha: ${cashCut.date}`)
        printer.println(`Dinero en Fondo: ${cashCut.initialCash}`)

        printer.drawLine()

        printer.setTextDoubleHeight();
        printer.println("Detalles de Ingresos por Servicio")
        printer.newLine()

        printer.setTextNormal()
        printer.println(`Total Autoservicio: ${cashCut.selfService}`)
        printer.println(`Total Lavado por Encargo: ${cashCut.laundry}`)
        printer.println(`Total Planchado: ${cashCut.iron}`)
        printer.println(`Total Tintoreria: ${cashCut.dryCleaning}`)
        printer.println(`Total Encargo Varios: ${cashCut.others}`)
        printer.setTextDoubleHeight();
        printer.newLine()
        printer.println(`Total (Suma de los Servicios): ${cashCut.total}`)
        printer.setTextNormal()

        printer.newLine()

        printer.println(`Ingreso en Efectivo: ${cashCut.totalCash}`)
        printer.println(`Ingreso en Tarjeta: ${cashCut.totalCredit}`)
        printer.println(`Retiros Totales: ${cashCut.totalCashWithdrawal ? '-' + cashCut.totalCashWithdrawal : '0'}`)
        printer.setTextDoubleHeight();
        printer.newLine()
        printer.println(`Final Total en Caja: ${cashCut.total}`)
        printer.setTextNormal()

        printer.cut();
        let execute = printer.execute()

        res.status(200).json("Print done!");
    } catch (err) {
        console.error(err)
        res.status(400).json({ msg: err.message });
    }
}