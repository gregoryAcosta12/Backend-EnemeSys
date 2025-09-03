const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/LoginUsersModel');

exports.login = async (req, res) => {
  try {
    const { rnc, usuario, password } = req.body;
    console.log("Datos recibidos del frontend:", req.body);

    // Buscar el usuario y validar que el RNC coincida
    const usuarioEncontrado = await Usuario.buscarPorEmailOUsuarioYValidarRNC(usuario, rnc);

    if (!usuarioEncontrado) {
      console.log("Usuario no encontrado o RNC incorrecto");
      return res.status(401).json({ error: "Usuario, contraseña o RNC incorrectos" });
    }

    // Verificar la contraseña
    const esValida = await bcrypt.compare(password, usuarioEncontrado.CONTRASEÑA);
    if (!esValida) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ error: "Usuario, contraseña o RNC incorrectos" });
    }

    // Crear el token JWT
const token = jwt.sign(
  {
    id: usuarioEncontrado.ID,
    role: usuarioEncontrado.ROLE,
    empresaId: usuarioEncontrado.EMPRESA_ID,
    username: usuarioEncontrado.USERNAME  // ✅ AÑADE ESTO
  },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);


    // Establecer el token en una cookie segura
    res.cookie('token', token, {
      httpOnly: true,  // Impide acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
      sameSite: 'Strict',  // Para proteger contra CSRF
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),  // Expiración de 8 horas
    });

    console.log("Token generado y enviado en la cookie");

    res.json({ message: "Inicio de sesión exitoso" });

  } catch (err) {
    console.error("Error en el login:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
