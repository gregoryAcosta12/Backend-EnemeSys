const express = require('express');
const router = express.Router();
const CertificacionController = require('../controllers/CertificacionController');

// Obtener todas las certificaciones
router.get('/listar', CertificacionController.obtenerCertificaciones);

// Crear una certificación
router.post('/crear', CertificacionController.crearCertificacion);

// Editar una certificación
router.put('/editar/:id', CertificacionController.editarCertificacion);

module.exports = router;
