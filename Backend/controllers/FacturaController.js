// controllers/FacturaController.js
const nodemailer = require('nodemailer');

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Envío manual con archivos adjuntos (desde formulario)
exports.enviarFacturaPorEmail = async (req, res) => {
  try {
    const {
      clientEmail,
      senderEmail,
      subject,
      body, // Este es el contenido del email que viene del frontend
      includeXML,
      copyToSender,
      facturaId
    } = req.body;

    // Validaciones básicas
    if (!clientEmail || !subject) {
      return res.status(400).json({ error: 'Email del cliente y asunto son requeridos' });
    }

    // Preparar los adjuntos
    const attachments = [];

    // Adjuntar archivos adicionales subidos
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype
        });
      });
    }

    // Configurar opciones del email - Usamos directamente el body del frontend
    const mailOptions = {
      from: senderEmail || process.env.EMAIL_USER,
      to: clientEmail,
      subject: subject,
      text: body, // Usamos text en lugar de html para enviar el texto plano
      attachments: attachments,
      cc: copyToSender === 'true' || copyToSender === true ? senderEmail : undefined
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Correo enviado exitosamente',
      info: info.messageId
    });

  } catch (error) {
    console.error('Error al enviar factura por email:', error);
    res.status(500).json({
      error: 'Error al enviar el correo',
      details: error.message
    });
  }
};


exports.enviarEmailAutomatico = async (req, res) => {
  try {
    const {
      clientEmail,
      senderEmail,
      subject,
      body,
      facturaId,
      copyToSender
    } = req.body;


    if (!clientEmail || !subject || !facturaId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: clientEmail, subject o facturaId' });
    }


    const pdfLink = `https://tuservidor.com/facturas/${facturaId}.pdf`;

    const mailOptions = {
      from: senderEmail || process.env.EMAIL_USER,
      to: clientEmail,
      subject: subject,
      text: `${body || 'Adjuntamos su factura electrónica.'}\n\nPuede visualizarla aquí: ${pdfLink}`,
      cc: copyToSender === 'true' || copyToSender === true ? senderEmail : undefined
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Correo automático enviado exitosamente',
      info: info.messageId
    });

  } catch (error) {
    console.error('Error al enviar correo automático:', error);
    res.status(500).json({
      error: 'Error al enviar el correo automático',
      details: error.message
    });
  }
};
