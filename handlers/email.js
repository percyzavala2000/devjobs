
import emailConfig from '../database/email.js';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import util from 'util';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

let transport=nodemailer.createTransport({
    host:emailConfig.host,
    port:emailConfig.port,
    auth:{
        user:emailConfig.user,
        pass:emailConfig.pass
    }
});

//utilizar los templates de handlebars
    transport.use(
      "compile",
      hbs({
        viewEngine: {
          extName: "handlebars",
          partialsDir: __dirname + "/../views/emails",
          layoutsDir: __dirname + "/../views/emails",
          defaultLayout: "reset.handlebars",
        },
        viewPath: __dirname + "/../views/emails",
        extName: ".handlebars",
      })
    );

const enviar=async (opciones)=>{
    const opcionesEmail = {
      from: "devJobs <no-reply@devjobs.com",
      to: opciones.usuario.email,
      subject: opciones.subject,
      template: opciones.archivo,
      context: {
        resetUrl: opciones.resetUrl,
      },
    };
    const sendMail=util.promisify(transport.sendMail,transport);
    return sendMail.call(transport,opcionesEmail);
}

export default enviar;