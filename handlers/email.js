const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const { htmlToText } = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,

    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    },
});
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    //juice 
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText(html);
    let info = await transport.sendMail({
        from: 'Uptask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // plain text body
        html, // html body
    });
}



// transport.sendMail(info);