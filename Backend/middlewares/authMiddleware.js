const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación que verifica el token JWT desde cookies o encabezado Authorization.
 */
const authMiddleware = (req, res, next) => {
  // Obtener el token desde la cookie o desde el header Authorization (Bearer token)
  const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];

  // Si no hay token, denegar el acceso
  if (!token) {
    return res.status(401).json({ message: 'No se encontró el token. Usuario no autenticado.' });
  }

  try {
    // Verificar el token usando el secreto definido en el .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos del usuario decodificado a la request
    req.user = decoded;

    // Pasar al siguiente middleware o ruta
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);

    return res.status(401).json({
      message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.',
      error: err.message
    });
  }
};

module.exports = authMiddleware;
