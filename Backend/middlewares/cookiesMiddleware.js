// middlewares/cookiesMiddleware.js
const cookieParser = require('cookie-parser');

const cookiesMiddleware = cookieParser();  // Configuración del middleware para cookies

module.exports = cookiesMiddleware;
