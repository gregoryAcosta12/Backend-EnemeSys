const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Certificacion = {
  async obtenerCertificaciones() {
    try {
      const sql = 'SELECT * FROM certificacion';
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener certificaciones');
    }
  },

  async crearCertificacion({ paso_actual, secuenciaultenviado, id_empresa }) {
    try {
      const id = uuidv4();
      const sql = `
        INSERT INTO certificacion (id, paso_actual, secuenciaultenviado, id_empresa)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await db.query(sql, [id, paso_actual, secuenciaultenviado, id_empresa]);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al crear la certificación');
    }
  },

  async editarCertificacion(id, { paso_actual, secuenciaultenviado, id_empresa }) {
    try {
      const sql = `
        UPDATE certificacion
        SET paso_actual = $1,
            secuenciaultenviado = $2,
            id_empresa = $3
        WHERE id = $4
        RETURNING *;
      `;
      const result = await db.query(sql, [paso_actual, secuenciaultenviado, id_empresa, id]);

      if (result.rows.length === 0) {
        throw new Error('Certificación no encontrada');
      }

      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al editar la certificación');
    }
  }
};

module.exports = Certificacion;
