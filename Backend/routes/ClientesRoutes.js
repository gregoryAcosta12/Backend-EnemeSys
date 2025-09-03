const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClientesController');



// Crear cliente
router.post('/crear-cliente', ClienteController.crearCliente);

// Obtener todos los clientes
router.get('/listar', ClienteController.obtenerClientes);

// Eliminar cliente
router.delete('/eliminar/:id', ClienteController.eliminarCliente);

// Editar cliente
router.put('/editar/:id', ClienteController.editarCliente);

// Cargar clientes desde Excel
router.post('/cargar-desde-excel',  ClienteController.cargarDesdeExcel);


module.exports = router;
