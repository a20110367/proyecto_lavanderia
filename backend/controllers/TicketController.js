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

let lastOrder

export const generateTicket = async (req, res) => {

    const { order } = req.body

    let payMethod = ''
    let payStatus = ''
    let payForm = ''

    if (order.payStatus === 'paid') {
        payStatus = 'PAGADO'
        if (order.payMethod === 'cash') {
            payMethod = 'EFECTIVO'
        } else {
            payMethod = 'TARJETA'
        }
    } else {
        payStatus = 'NO PAGADO'
        payMethod = '---------'
    }
    if (order.payForm === 'advance') {
        payForm = 'ANTICIPADO'
    } else {
        payForm = 'A LA ENTREGA'
    }

    try {

        printer.clear();

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
        if (order.pieces === 0 || !order.pieces) {
            printer.println('Cliente: ' + order.client)
        } else {
            printer.tableCustom([
                { text: 'Cliente: ' + order.client, align: "LEFT", bold: true },
                { text: 'PIEZAS: ' + order.pieces, align: "RIGHT" }
            ]);
        }
        printer.bold(false)

        printer.println('F.Recepción: ' + formatDate(order.receptionDate) + ' ' + formatTime(order.receptionTime))

        if (order.serviceType != 'productos') {
            printer.bold(true);
            printer.println('F.Entrega: ' + formatDate(order.scheduledDeliveryDate) + ' ' + formatTime(order.scheduledDeliveryTime))
            printer.bold(false);

            printer.drawLine();

            printer.bold(true)
            printer.print('Observaciones Generales: ')
            printer.bold(false)
            printer.println(order.notes)
        }

        printer.drawLine();

        printer.println('PROFECO NO. REGISTRO: 4390/2013')
        printer.println('NO. EXPEDIENTE PFC.B.E. 7/005243/20013')

        printer.tableCustom([
            { text: "FECHA: " + moment().format('l'), align: "LEFT", bold: true },
            { text: 'HORA: ' + moment().format('LT'), align: "RIGHT" },
        ]);

        printer.cut();
        lastOrder = order
        let execute = await printer.execute()
        console.log(execute)
        console.log("Print done!");

        if (order.serviceType != 'productos' && order.serviceType != 'autoservicio') {
            printTicketFromBackend(order)
        }

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

const printTicketFromBackend = async (orderParameter) => {

    const order = orderParameter

    let payMethod = ''
    let payStatus = ''
    let payForm = ''

    if (order.payStatus === 'paid') {
        payStatus = 'PAGADO'
        if (order.payMethod === 'cash') {
            payMethod = 'EFECTIVO'
        } else {
            payMethod = 'TARJETA'
        }
    } else {
        payStatus = 'NO PAGADO'
        payMethod = '---------'
    }
    if (order.payForm === 'advance') {
        payForm = 'ANTICIPADO'
    } else {
        payForm = 'A LA ENTREGA'
    }

    try {

        printer.clear();

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

        printer.bold(true);                             // Append text with new line
        printer.println('Total Pagado: $' + order.subtotal)
        printer.bold(false);
        printer.println(n2word(order.subtotal))

        printer.alignLeft()

        printer.drawLine();

        printer.bold(true)
        if (order.pieces === 0 || !order.pieces) {
            printer.println('Cliente: ' + order.client)
        } else {
            printer.tableCustom([
                { text: 'Cliente: ' + order.client, align: "LEFT", bold: true },
                { text: 'PIEZAS: ' + order.pieces, align: "RIGHT" }
            ]);
        }
        printer.bold(false)

        printer.println('F.Recepción: ' + formatDate(order.receptionDate) + ' ' + formatTime(order.receptionTime))

        if (order.serviceType != 'productos') {
            printer.bold(true);
            printer.println('F.Entrega: ' + formatDate(order.scheduledDeliveryDate) + ' ' + formatTime(order.scheduledDeliveryTime))
            printer.bold(false);

            printer.drawLine();

            printer.bold(true)
            printer.print('Observaciones Generales: ')
            printer.bold(false)
            printer.println(order.notes)
        }

        printer.drawLine();

        printer.println('PROFECO NO. REGISTRO: 4390/2013')
        printer.println('NO. EXPEDIENTE PFC.B.E. 7/005243/20013')

        printer.tableCustom([
            { text: "FECHA: " + moment().format('l'), align: "LEFT", bold: true },
            { text: 'HORA: ' + moment().format('LT'), align: "RIGHT" },
        ]);

        printer.cut();
        lastOrder = order
        let execute = await printer.execute()
        console.log(execute)
        console.log("Print done!");
    } catch (err) {
        console.error("Print failed:", err);
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

const formatTicketTime = (dateStr) => {
    const date = moment(dateStr).format('hh:mm')
    return date
}

export const generatePartialCashCutTicket = async (req, res) => {
    try {

        const { cashCut, services, products } = req.body

        printer.clear();

        printer.setTypeFontB();

        // LOGO DEL NEGOCIO
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGrayINFO.png');

        printer.newLine()

        printer.setTextQuadArea()
        printer.println('CORTE DE CAJA PARCIAL')

        printer.drawLine();

        if (cashCut) {
            printer.println(`Cajero: ${cashCut.casher}`)
            printer.println(`Turno: ${cashCut.workShift === 'morning' ? 'Matutino' : 'Vespertino'}`)
            printer.println(`Fecha: ${formatDate(cashCut.cashCutD)}`)
            printer.println(`Hora: ${formatTicketTime(cashCut.cashCutT)}`)

            printer.drawLine()
        }

        if (services) {
            printer.setTextDoubleHeight();
            printer.println("Detalles de Ingresos por Servicio")
            printer.newLine()

            printer.setTextNormal()
            printer.println(`Número de Servicios Pagados: ${services.numberOfItems}`)
            printer.println(`Total Autoservicio: ${services.selfService}`)
            printer.println(`Total Lavado por Encargo: ${services.laundry}`)
            printer.println(`Total Planchado: ${services.iron}`)
            printer.println(`Total Tintoreria: ${services.dryCleaning}`)
            printer.println(`Total Encargo Varios: ${services.others}`)

            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Total (Suma de los Servicios): ${services.totalIncome}`)
            printer.setTextNormal()

            printer.newLine()

            printer.println(`Ingreso en Efectivo: ${services.totalCash}`)
            printer.println(`Ingreso en Tarjeta: ${services.totalCredit}`)

            printer.newLine()
            printer.println(`Retiros Totales: ${cashCut.totalCashWithdrawal ? '-' + cashCut.totalCashWithdrawal : '0'}`)
            printer.println(`Dinero en Fondo: ${cashCut.initialCash}`)
            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Final Total en Caja: ${cashCut.total}`)
            printer.setTextNormal()

            printer.setTextQuadArea()
            printer.drawLine()
            printer.setTextNormal()

        }

        if (products) {
            printer.setTextDoubleHeight();
            printer.println("Detalles de Ingresos por Productos")
            printer.newLine()

            printer.setTextNormal()
            printer.println(`Número de Ventas de Productos Pagados: ${products.numberOfItems}`)
            printer.println(`Total Jabon: ${products.soap}`)
            printer.println(`Total Suavitel: ${products.suavitel}`)
            printer.println(`Total Pinol: ${products.pinol}`)
            printer.println(`Total Desengrasante: ${products.degreaser}`)
            printer.println(`Total Cloro: ${products.chlorine}`)
            printer.println(`Total Sanitizante: ${products.sanitizer}`)
            printer.println(`Total Bolsa: ${products.bag}`)
            printer.println(`Total Reforzado: ${products.reinforced}`)
            printer.println(`Total Ganchos: ${products.hook}`)
            printer.println(`Total WC: ${products.wc}`)
            printer.println(`Total Otros: ${products.others}`)

            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Total (Suma de la Venta de Productos): ${products.totalIncome}`)
            printer.setTextNormal()

            printer.newLine()

            printer.println(`Ingreso en Efectivo: ${products.totalCash}`)
            printer.println(`Ingreso en Tarjeta: ${products.totalCredit}`)

        }

        printer.cut();

        let execute = await printer.execute()

        res.status(200).json("Print done!");

    } catch (err) {
        console.error(err)
        res.status(400).json({ msg: err.message });
    }
}

export const reprintTicket = async (req, res) => {
    try {
        if (lastOrder) {
            printTicketFromBackend(lastOrder)
            res.status(200).json('Print done!')
        } else {
            res.status(404).json(false)
        }
    } catch (err) {
        console.error(err)
        res.status(400).json({ msg: err.message })
    }
}

export const cashCutTicket = async (req, res) => {
    try {
        const { cashCut, services, products } = req.body

        printer.clear();

        printer.setTypeFontB();

        // LOGO DEL NEGOCIO
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGrayINFO.png');

        printer.newLine()

        printer.setTextQuadArea()
        printer.println('CORTE DE CAJA TURNO')

        printer.setTextDoubleHeight();
        printer.println(`Folio No.: ${cashCut.cashCutId}`)

        printer.setTextNormal()
        printer.drawLine();

        if (cashCut) {
            printer.println(`Cajero: ${cashCut.casher}`)
            printer.println(`Turno: ${cashCut.workShift === 'morning' ? 'Matutino' : 'Vespertino'}`)
            printer.println(`Fecha: ${formatDate(cashCut.cashCutD)}`)
            printer.println(`Hora: ${formatTicketTime(cashCut.cashCutT)}`)

            printer.drawLine()
        }

        if (services) {
            printer.setTextDoubleHeight();
            printer.println("Detalles de Ingresos por Servicio")
            printer.newLine()

            printer.setTextNormal()
            printer.println(`Número de Servicios Pagados: ${services.numberOfItems}`)
            printer.println(`Total Autoservicio: ${services.selfService}`)
            printer.println(`Total Lavado por Encargo: ${services.laundry}`)
            printer.println(`Total Planchado: ${services.iron}`)
            printer.println(`Total Tintoreria: ${services.dryCleaning}`)
            printer.println(`Total Encargo Varios: ${services.others}`)

            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Total (Suma de los Servicios): ${services.totalIncome}`)
            printer.setTextNormal()

            printer.newLine()

            printer.println(`Ingreso en Efectivo: ${services.totalCash}`)
            printer.println(`Ingreso en Tarjeta: ${services.totalCredit}`)

            printer.newLine()
            printer.println(`Retiros Totales: ${cashCut.totalCashWithdrawal ? '-' + cashCut.totalCashWithdrawal : '0'}`)
            printer.println(`Dinero en Fondo: ${cashCut.initialCash}`)
            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Final Total en Caja: ${cashCut.total}`)
            printer.setTextNormal()

            printer.setTextQuadArea()
            printer.drawLine()
            printer.setTextNormal()
        }

        if (products) {
            printer.setTextDoubleHeight();
            printer.println("Detalles de Ingresos por Productos")
            printer.newLine()

            printer.setTextNormal()
            printer.println(`Número de Ventas de Productos Pagados: ${products.numberOfItems}`)
            printer.println(`Total Jabon: ${products.soap}`)
            printer.println(`Total Suavitel: ${products.suavitel}`)
            printer.println(`Total Pinol: ${products.pinol}`)
            printer.println(`Total Desengrasante: ${products.degreaser}`)
            printer.println(`Total Cloro: ${products.chlorine}`)
            printer.println(`Total Sanitizante: ${products.sanitizer}`)
            printer.println(`Total Bolsa: ${products.bag}`)
            printer.println(`Total Reforzado: ${products.reinforced}`)
            printer.println(`Total Ganchos: ${products.hook}`)
            printer.println(`Total WC: ${products.wc}`)
            printer.println(`Total Otros: ${products.others}`)

            printer.setTextDoubleHeight();
            printer.newLine()
            printer.println(`Total (Suma de la Venta de Productos): ${products.totalIncome}`)
            printer.setTextNormal()

            printer.newLine()

            printer.println(`Ingreso en Efectivo: ${products.totalCash}`)
            printer.println(`Ingreso en Tarjeta: ${products.totalCredit}`)

        }

        printer.cut();

        let execute = await printer.execute()

        res.status(200).json("Print done!");

    } catch (err) {
        console.error(err)
        res.status(400).json({ msg: err.message })
    }
}
