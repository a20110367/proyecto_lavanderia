import { transporter } from "./utils/mailer.js";
import { restAPI } from "./utils/greenapi.js";

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
        const message =  `Tu pedido con el folio: ${order.id_order} está listo, Ya puedes pasar a recogerlo.`
        const subject =  `Tu Ropa esta Lista ${order.client.name}`
        const text =  `Tu ropa esta lista, esperamos que la recojas a su brevedad`

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

    const { pdf, startDate, endDate} = req.body
    
    try{
        const info = await transporter.sendMail({
            from: `"Reporte del ${startDate} al ${endDate}." <pyrop59@gmail.com>`, // sender address
            to: 'proveedores.tyc@gmail.com', // list of receivers
            subject: `Reporte del ${startDate} al ${endDate}.`, // Subject line
            text: 'Revisa este reporte en formato pdf adjunto.', // plain text body
            attachments: [{
                filename: `reporte_${startDate}_${endDate}.pdf`,
                content: pdf,
                contentType: 'application/pdf',
                encoding: 'base64'
            }],
        });
        console.log("Report Mail Message sent:  %s", info.messageId);
        res.status(200).json('Report Sent!')
    }catch(err){
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendCashCut = async (req, res) => {

    const { pdf, date, hour} = req.body
    
    try{
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
    }catch(err){
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}

export const sendWarningCanceledOrder = async (req, res) => {
    
    const {canceledOrder, casher, date, cause} = req.body;
    const message = `// ${date} //
    La orden No. ${canceledOrder.id_order} | ${canceledOrder.payStatus === "paid" ? "PAGADA" : "NO PAGADA"} | 
    Pertenenciente al cliente:  ${canceledOrder.client.name} ${canceledOrder.client.firstLN} ${canceledOrder.client.secondLN}
    Fue cancelada por un monto de:  $${canceledOrder.totalPrice} Pesos
    Cancelada por el cajero:  ${casher}
    Por el motivo de:  ${cause}`;

    try{

        //OWNER
        restAPI.message.sendMessage(process.env.OWNER_PHONE + "@c.us", null, message).then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
        res.status(200).json('Warning Sent!')

        //CLIENTe
    }catch(err) {
        console.error(err)
        res.status(400).json({ message: 'Algo salio mal!' })
    }
}