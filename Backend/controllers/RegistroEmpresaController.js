const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const Empresa = require('../models/RegistroEmpresaModel');
const Usuario = require('../models/UsuarioModel');
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes y PDFs.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

async function enviarCorreoConfirmacion(emailDestino, nombre, tipo) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 📌 Leer la plantilla HTML
  const templatePath = path.join(__dirname, `../template/${tipo}Confirmacion.html`);
  const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  // 📌 Compilar la plantilla con Handlebars
  const template = handlebars.compile(htmlTemplate);
  const htmlToSend = template({ nombre });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailDestino,
    subject: `Confirmación de Registro en el Sistema`,
    html: htmlToSend, // 🔥 Aquí va el HTML procesado
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo de confirmación enviado a ${emailDestino}`);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
}

async function enviarCorreoConAdjunto(emailDestino, archivoPath, empresaData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 📌 Leer la plantilla HTML
  const templatePath = path.join(__dirname, '../template/registroEmpresa.html');
  const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  // 📌 Compilar la plantilla con Handlebars
  const template = handlebars.compile(htmlTemplate);
  const htmlToSend = template(empresaData);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailDestino,
    subject: `Nueva Empresa Registrada: ${empresaData.nombreEmpresa}`,
    html: htmlToSend, // 🔥 Aquí va el HTML procesado
    attachments: archivoPath ? [{ filename: path.basename(archivoPath), path: archivoPath }] : []
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con plantilla HTML");
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
}

exports.crearEmpresaYUsuario = [
  upload.fields([ // Mantén esto igual
    { name: 'logo', maxCount: 1 },
    { name: 'fotoRegMercantil', maxCount: 1 },
  ]),

  async (req, res) => {
    try {
      const { nombre, rnc, direccion, direccion2, telefono, email, Nombreusuario, apellido, adminEmail, usuario, password } = req.body;

      const fotoRegMercantilPath = req.files['fotoRegMercantil']?.[0]?.path;
      const fotoRegMercantilBuffer = fotoRegMercantilPath ? fs.readFileSync(fotoRegMercantilPath) : null;

      const createdAt = new Date().toISOString();

      // 📌 Crear la empresa
      const empresa = await Empresa.crearEmpresa({
        nombre, rnc, direccion, direccion2, telefono, email, createdAt, fotoRegMercantil: fotoRegMercantilBuffer
      });

      if (!empresa || !empresa.ID) {
        throw new Error("No se pudo registrar la empresa.");
      }

      // 🔐 Hashear la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // 📌 Crear el usuario administrador
      const usuarioCreado = await Usuario.crearUsuario({
        Nombreusuario, apellido, usuario, adminEmail, password: hashedPassword, empresaId: empresa.ID, role: 'admin', createdAt
      });

      if (!usuarioCreado || !usuarioCreado.ID) {
        throw new Error("No se pudo registrar el usuario administrador.");
      }

      // 📩 Enviar correo con plantilla Handlebars a la empresa y al usuario administrador
      await enviarCorreoConAdjunto('acostagregory258@gmail.com', fotoRegMercantilPath, {
        nombreEmpresa: nombre,
        rnc: rnc,
        direccion: direccion,
        telefono: telefono,
        email: email,
        nombreUsuario: Nombreusuario,
        apellido: apellido,
        usuario: usuario,
        adminEmail: adminEmail
      });

      // 📩 Enviar correo de confirmación al email de la empresa
      await enviarCorreoConfirmacion(email, nombre, 'empresa');

      // 📩 Enviar correo de confirmación al adminEmail
      await enviarCorreoConfirmacion(adminEmail, Nombreusuario, 'usuario');

      // 🗑️ Eliminar archivos temporales del servidor
      [req.files['logo']?.[0]?.path, fotoRegMercantilPath].forEach((file) => {
        if (file) fs.unlinkSync(file);
      });

      res.status(201).json({ message: "✅ Empresa y usuario registrados correctamente, se enviaron los correos de confirmación." });

    } catch (err) {
      console.error('❌ Error al registrar:', err.message);
      res.status(500).json({ error: "Ocurrió un error al registrar la empresa y el usuario." });
    }
  }
];
