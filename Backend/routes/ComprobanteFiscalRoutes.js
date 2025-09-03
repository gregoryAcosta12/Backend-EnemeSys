const express = require('express');
const router = express.Router();
const ComprobanteFiscalController = require('../controllers/ComprobanteFiscalController');

// Obtener todos los comprobantes
router.get('/listar', ComprobanteFiscalController.obtenerComprobantes);

// Editar comprobante
router.put('/editar/:id', ComprobanteFiscalController.editarComprobante);

module.exports = router;
