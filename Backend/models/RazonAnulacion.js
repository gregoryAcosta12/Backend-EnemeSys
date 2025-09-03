const { v4: uuidv4, validate: validarUUID } = require("uuid");
const db = require("../config/db");

const RazonAnulacion = {
  // Crear un comentario relacionado a una factura
  async crearComentario({ facturaId, comentario }) {
    if (!validarUUID(facturaId)) {
      throw new Error("FACTURA_ID no es un UUID válido");
    }

    try {
      const sql = `INSERT INTO "RAZON_ANULACION" 
        ("ID", "FACTURA_ID", "COMENTARIO", "CREATED_AT")
        VALUES ($1, $2, $3, NOW())
        RETURNING *`;

      const result = await db.query(sql, [uuidv4(), facturaId, comentario || null]);
      return result.rows[0];
    } catch (err) {
      console.error("Error al crear comentario de anulación:", err);
      throw new Error("Error al crear comentario de anulación");
    }
  },

  // Obtener todos los comentarios de una factura
  async obtenerComentariosPorFactura(facturaId) {
    if (!validarUUID(facturaId)) {
      throw new Error("FACTURA_ID no es un UUID válido");
    }

    try {
      const sql = `SELECT * FROM "RAZON_ANULACION" 
                   WHERE "FACTURA_ID" = $1 
                   ORDER BY "CREATED_AT" DESC`;
      const result = await db.query(sql, [facturaId]);
      return result.rows;
    } catch (err) {
      console.error("Error al obtener comentarios de la factura:", err);
      throw new Error("Error al obtener comentarios de la factura");
    }
  },

  // Eliminar un comentario
  async eliminarComentario(id) {
    if (!validarUUID(id)) {
      throw new Error("ID no es un UUID válido");
    }

    try {
      const sql = 'DELETE FROM "RAZON_ANULACION" WHERE "ID" = $1 RETURNING *';
      const result = await db.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      throw new Error("Error al eliminar comentario");
    }
  }
};

module.exports = RazonAnulacion;
