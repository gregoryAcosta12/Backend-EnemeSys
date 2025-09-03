const express = require('express');
const router = express.Router();
const ImpuestoController = require('../controllers/ImpuestoController');

// Crear impuesto
router.post('/crear-impuesto', ImpuestoController.crearImpuesto);

// Obtener todos los impuestos
router.get('/listar', ImpuestoController.obtenerImpuestos);

// Eliminar impuesto
router.delete('/eliminar/:id', ImpuestoController.eliminarImpuesto);

// Editar impuesto
router.put('/editar/:id', ImpuestoController.editarImpuesto);

module.exports = router;
