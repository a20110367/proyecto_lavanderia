import { PrismaClient } from "@prisma/client";
import { transporter } from "./utils/mailer.js";
import { restAPI } from "./utils/greenapi.js";
import { NumerosALetras } from 'numero-a-letras'

const prisma = new PrismaClient();

export const n2word = async (req, res) => {
    const {number} = req.body
    try {
        const word = NumerosALetras(number);    
        res.status(200).json(word);
    }catch(err){
        res.status(400).json({msg:err.message});
    }
}

export const sendMessage = async (req, res) => {
    const {id_order, name, email, tel, message} = req.body
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
            to: email, // list of receivers
            subject: "Tu Ropa esta Lista", // Subject line
            text: "Tu ropa esta lista, esperamos que la recojas a su brevedad", // plain text body
            // html: "<b>Tamal</b>", // html body
            html: output,
        });

        console.log("Mail Message sent:  %s", info.messageId);
        
        restAPI.message.sendMessage(tel+"@c.us", null , "Su suscripción a brazzers caduco, es prueba de la lavanderia de whatsapp").then((data) => {
            console.log("Whatsapp Message sent:  %s", data);
        });
          
    } catch (err) {
        emailStatus = err
        return res.status(400).json({ message: 'Algo salio mal!' })
    }
}