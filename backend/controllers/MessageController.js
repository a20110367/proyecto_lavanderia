import { PrismaClient } from "@prisma/client";
import { transporter } from "./utils/mailer.js";

const prisma = new PrismaClient();

export const sendMessage = async (req, res) => {
    const {id_order, name, email, message} = req.body
    const output = `
        <h3>Detalles del Pedido:</h3>
        <ul>  
            <li>Folio: ${id_order}</li> 
            <li>Nombre: ${name}</li>
            <li>Correo Electronico: ${email}</li>            
        </ul>
        <h3>Cuerpo</h3>
        <p>${message}</p>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Tu Ropa esta Lista 👻" <pyrop59@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Tu Ropa esta Lista", // Subject line
            text: "Tu ropa esta lista, esperamos que la recojas a su brevedad", // plain text body
            // html: "<b>Tamal</b>", // html body
            html: output,
        });

        console.log("Message sent:  %s", info.messageId);
    } catch (err) {
        emailStatus = err
        return res.status(400).json({ message: 'Algo salio mal!' })
    }
}