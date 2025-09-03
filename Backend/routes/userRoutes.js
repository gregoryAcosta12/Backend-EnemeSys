const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Middleware para obtener req.user.empresaId desde el token
const authMiddleware = require('../middlewares/authMiddleware');

// Crear usuario
router.post('/crear-usuario', authMiddleware, UserController.crearUsuario);

// Obtener todos los usuarios
router.get('/listar', UserController.obtenerTodosLosUsuarios);

// Obtener un usuario por ID
router.get('/editar/:id', UserController.obtenerUsuarioPorId);

// Eliminar usuario
router.delete('/eliminar/:id', UserController.eliminarUsuario);

// Editar usuario
router.put('/editar/:id', UserController.editarUsuario);

module.exports = router;
