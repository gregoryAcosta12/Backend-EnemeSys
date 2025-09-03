const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Crear producto
router.post('/crear-producto', ProductController.crearProducto);

// Obtener productos
router.get('/obtener-productos', ProductController.obtenerProductos);

// Editar producto
router.put('/editar-producto/:id', ProductController.editarProducto);

// Eliminar producto
router.delete('/eliminar-producto/:id', ProductController.eliminarProducto);

// Cargar productos desde Excel
router.post('/cargar-desde-excel', ProductController.cargarDesdeExcel);

module.exports = router;
