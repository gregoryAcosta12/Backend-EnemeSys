const express = require('express');
const router = express.Router();
const MedidaController = require('../controllers/unidad_medidas');

// Ruta para crear una unidad de medida
router.post('/crear', MedidaController.crearUnidadMedida);

// Ruta para obtener todas las unidades de medida
router.get('/listar', MedidaController.obtenerUnidadesMedida);

module.exports = router;
