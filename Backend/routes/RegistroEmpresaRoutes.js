const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/RegistroEmpresaController');

router.post('/empresas', empresaController.crearEmpresaYUsuario);

module.exports = router;
