const RazonAnulacion = require("../models/RazonAnulacion");

// Crear un comentario de anulación
exports.crearComentario = async (req, res) => {
  try {
    const { facturaId, comentario } = req.body;
    if (!facturaId) {
      return res.status(400).json({ error: "FACTURA_ID es requerido" });
    }

    const nuevoComentario = await RazonAnulacion.crearComentario({ facturaId, comentario });
    res.status(201).json(nuevoComentario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los comentarios de una factura
exports.obtenerComentarios = async (req, res) => {
  try {
    const { facturaId } = req.params;
    if (!facturaId) {
      return res.status(400).json({ error: "FACTURA_ID es requerido" });
    }

    const comentarios = await RazonAnulacion.obtenerComentariosPorFactura(facturaId);
    res.json(comentarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un comentario por ID
exports.eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await RazonAnulacion.eliminarComentario(id);

    if (!eliminado) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json({ message: "Comentario eliminado", eliminado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
