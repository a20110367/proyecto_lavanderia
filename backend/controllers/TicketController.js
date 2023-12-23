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
}

export const generateTicket = async () => {

    try {
        printer.println('PROBANDO LINE')
        // printer.cut()
        await printer.printImage('./controllers/utils/img/caprelogoThermalPrinterGray.png');
        // printer.print("Hello World");                               // Append text
        // printer.println("Hello World");                             // Append text with new line
        printer.println('PROBANDO LINE')
        // printer.bold(true);                                         // Set text bold
        // printer.invert(true);                                       // Background/text color inversion
        // printer.underline(true);                                    // Underline text (1 dot thickness)
        // printer.underlineThick(true);                               // Underline text with thick line (2 dot thickness)
        printer.drawLine();                                         // Draws a line
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

        console.log("Print done!");
    } catch (error) {
        console.error("Print failed:", error);
    }
}