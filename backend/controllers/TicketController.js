import { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } from 'node-thermal-printer';

console.log('PRINTER WORKING IN ' + process.env.INTERFACE)

let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: process.env.INTERFACE,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
});

const execute = async () => {
    let execute = printer.execute()
    console.log("Print done!");
}

export const generateTicket = async () => {

    try {
        // LOGO DEL NEGOCIO
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGrayINFO.png');

        printer.drawLine();
        printer.setTypeFontB();
        
        printer.setTextDoubleHeight();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "Folio: 12+1", align: "LEFT", bold: true},
            { text: "PAGADO", align: "RIGHT" }
        ]);

        printer.setTextNormal();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "CATEGORIA: ENCARGO", align: "LEFT", bold: true},
            { text: "TIPO PAGO: ANTICIPADO", align: "RIGHT" }
        ]);

        printer.setTextNormal();
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
            { text: "Cajero: isra", align: "LEFT", bold: true},
            { text: "FORMA PAGO: EFECTIVO", align: "RIGHT" }
        ]);

        printer.drawLine();

        // printer.table(['Zero',"One", "Two", "Three", 'Four', 'Five']);  
        printer.tableCustom([
            { text: "Cant.", align: "LEFT"},
            { text: "", align: 'LEFT'},
            { text: "Descripción", align: "CENTER", bold: true },
            { text: "Precio", align: "RIGHT" }
        ]);

        printer.newLine()

        printer.tableCustom([
            { text: "2", align: "LEFT"},
            { text: "X", align: "LEFT", bold: true},
            { text: "Lavado 8kg", align: "CENTER"},
            { text: "$90", align: "RIGHT" }
        ]);

        printer.alignCenter()

        printer.drawLine();
        // printer.print("Hello World");                               // Append text
        // printer.println("Hello World");  

        printer.bold(true);                             // Append text with new line
        printer.println('Total Pagado: $90')
        printer.bold(false);
        printer.println('Noventa Pesos 00/100 M.N.')

        printer.alignLeft()

        printer.drawLine();

        printer.println('Cliente: Janito')
        printer.println('F.Recepción: 23/12/2023 SABADO 11:19PM')
        printer.bold(true);
        printer.println('F.Entrega: 24/12/2023 DOMINGO 09:00AM')
        printer.bold(false);   

        printer.drawLine();

        printer.println('Observaciones Generales: ')

        printer.drawLine();

        printer.println('PROFECO NO. REGISTRO: 4390/2013')
        printer.println('NO. EXPEDIENTE PFC.B.E. 7/005243/20013')
    
        printer.tableCustom([
            { text: "FECHA: 23/12/2023", align: "LEFT", bold: true},
            { text: "HORA: 11:19PM", align: "RIGHT"},
        ]);

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
        // }
        printer.cut();                                              // Cuts the paper (if printer only supports one mode use this)
        execute()


    } catch (error) {
        console.error("Print failed:", error);
    }
}