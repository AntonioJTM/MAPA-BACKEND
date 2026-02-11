const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  host: "mail.metabooks.com.mx",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.SUPPORT_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailTemplates = {
  forgotPassword: {
    subject: `Recuperación de contraseña - ${process.env.APP_NAME}`,
    template: "recupera.html",
    attachments: [
      {
        filename: "unnamed.png",
        path: path.join(__dirname, "../controllers/web/template/unnamed.png"),
        cid: "unnamed",
      },
    ],
    dataMapping: (data) => ({
      usuario: data.name,
      contraseña: data.password,
    }),
  },
  changePassword: {
    subject: `Recuperación de contraseña - ${process.env.APP_NAME}`,
    template: "recupera.html",
    attachments: [
      {
        filename: "unnamed.png",
        path: path.join(__dirname, "../controllers/web/template/unnamed.png"),
        cid: "unnamed",
      },
    ],
    dataMapping: (data) => ({ contraseña: data.password }),
  },
  register: {
    subject: `¡Bienvenido a ${process.env.APP_NAME}!`,
    template: "register.html",
    attachments: [
      {
        filename: "unnamed.png",
        path: path.join(__dirname, "../controllers/web/template/unnamed.png"),
        cid: "unnamed",
      },
    ],
    dataMapping: (data) => ({
      usuario: data.name,
      contraseña: data.password,
    }),
  },
};

const sendEmailSupport = async (nombre, correo, mensaje) => {
  const now = new Date();
  const formato = now.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
  }).replace(' de ', ' ').replace(' de ', ', ');
  try {
    const mailOptions = {
      from: `"META Support System" <${correo}>`, // El nombre del remitente y su correo
      to: "contacto@metabooks.com.mx",
      replyTo: correo, // This allows you to reply directly to the user
      subject: `Nuevo mensaje de soporte de ${nombre}`,
      html: `
                <html>
                <head>
                  <style>
                  .user-info {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                  }
                  .user-info td {
                      padding: 12px;
                      border-bottom: 1px solid #f0f0f0;
                  }
                  </style>
                </head>
                <body>
                  <span>  📥 ¡Hemos recibido un nuevo mensaje!</span> 
                  <span>Hola Equipo de Soporte META, se ha generado una nueva consulta a través del formulario de contacto. 
                  Aquí tienes los detalles: </span> 
                  <table class="user-info">
                  <tr>
                      <td class="label">👤 Nombre</td>
                      <td class="value">${nombre}</td>
                  </tr>
                  <tr>
                      <td class="label">📧 Correo</td>
                      <td class="value"><a href="mailto:${correo}" style="color: #2563eb; text-decoration: none;">${correo}</a></td>
                  </tr>
                  <tr>
                      <td class="label">📅 Fecha</td>
                      <td class="value">${formato}</td>
                  </tr>
                  </table>
                  <span>Mensaje del usuario:</span> 
                  <div class="message-box">
                   "${mensaje}"
                  </div>
                </body>
                </html>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`Error en sendEmailSupport (${correo}):`, error);
    throw new Error(`Error al enviar el correo de ${correo}`);
  }
};

module.exports = {
  sendEmailSupport,
};
