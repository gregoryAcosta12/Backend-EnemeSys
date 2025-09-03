const db = require('../config/db');

const ComprobanteFiscal = {
  // Obtener todos los comprobantes fiscales
  async obtenerComprobantes() {
    try {
      const sql = `
        SELECT * FROM "COMPROBANTEFISCAL";
      `;
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener comprobantes fiscales');
    }
  },

  // Editar comprobante fiscal por ID
  async editarComprobante(id, {
    NOMBRE,
    PREFIJO,
    INICIAR_EN,
    SECUENCIA_ACTUAL,
    TERMINAR_EN,
    FECHA_EMISION,
    FECHA_VENCIMIENTO,
    AVISAR_FALTANDO,
    ACTIVAR_IMPUESTO,
    ESTADO
  }) {
    try {
      const sql = `
        UPDATE "COMPROBANTEFISCAL"
        SET 
          "NOMBRE" = $1,
          "PREFIJO" = $2,
          "INICIAR_EN" = $3,
          "SECUENCIA_ACTUAL" = $4,
          "TERMINAR_EN" = $5,
          "FECHA_EMISION" = $6,
          "FECHA_VENCIMIENTO" = $7,
          "AVISAR_FALTANDO" = $8,
          "ACTIVAR_IMPUESTO" = $9,
          "ESTADO" = $10
        WHERE "ID" = $11
        RETURNING *;
      `;
      const values = [
        NOMBRE,
        PREFIJO,
        INICIAR_EN,
        SECUENCIA_ACTUAL,
        TERMINAR_EN,
        FECHA_EMISION,
        FECHA_VENCIMIENTO,
        AVISAR_FALTANDO,
        ACTIVAR_IMPUESTO,
        ESTADO,
        id
      ];

      const result = await db.query(sql, values);
      if (result.rows.length === 0) {
        throw new Error('Comprobante no encontrado');
      }
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al editar comprobante fiscal');
    }
  }
};

module.exports = ComprobanteFiscal;
