const express = require('express');
const router = express.Router();
const SecuenciaFacturaController = require('../controllers/SecuenciaFacturaController');
router.get('/', SecuenciaFacturaController.obtenerENCF);

module.exports = router;
