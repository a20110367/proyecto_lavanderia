import { PrismaClient } from "@prisma/client";
import { transporter } from "./utils/mailer.js";
import { restAPI } from "./utils/greenapi.js";
import { NumerosALetras } from 'numero-a-letras'

const prisma = new PrismaClient();

export const n2word = async (req, res) => {
    const { number } = req.body
    try {
        const word = NumerosALetras(number);
        res.status(200).json(word);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

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