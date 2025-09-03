const express = require("express");
const router = express.Router();
const RazonAnulacionController = require("../controllers/RazonAnulacionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Crear comentario de anulación
router.post("/crear", authMiddleware, RazonAnulacionController.crearComentario);

// Obtener comentarios de una factura
router.get("/factura/:facturaId", RazonAnulacionController.obtenerComentarios);

// Eliminar comentario por ID
router.delete("/eliminar/:id", authMiddleware, RazonAnulacionController.eliminarComentario);

module.exports = router;
