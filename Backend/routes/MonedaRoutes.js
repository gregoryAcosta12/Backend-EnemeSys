const express = require('express');
const router = express.Router();
const MonedaController = require('../controllers/ModenaController');

// Crear moneda
router.post('/crear-moneda', MonedaController.crearMoneda);

// Obtener todas las monedas
router.get('/listar', MonedaController.obtenerTodasLasMonedas);

// Actualizar tasa de moneda (nueva ruta)
router.put('/:id/tasa', MonedaController.actualizarTasaMoneda);

module.exports = router;