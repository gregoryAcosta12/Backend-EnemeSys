// routes/FacturaRoutes.js
const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/FacturaController');
const multer = require('multer');
const upload = multer(); // sin restricciones

// Envío manual
router.post('/enviar-email', upload.any(), facturaController.enviarFacturaPorEmail);

// Envío automático (nuevo endpoint)
router.post('/enviar-email-automatico', upload.none(), facturaController.enviarEmailAutomatico);

module.exports = router;
