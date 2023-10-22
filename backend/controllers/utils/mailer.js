import nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'pyrop59@gmail.com    ', // generated ethereal user
        pass: 'gnxo yjdu khzi aoco'  // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify().then( () => {
    console.log('Listo para enviar correos')
})

