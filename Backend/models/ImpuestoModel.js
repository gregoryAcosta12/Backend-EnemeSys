const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // Tu configuración de la base de datos

const Impuesto = {
  // Obtener todos los impuestos
  async obtenerImpuestos() {
    try {
      const sql = 'SELECT * FROM "IMPUESTO"';
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener los impuestos');
    }
  },

  async crearImpuesto({ nombreImpuesto, impuestoPorc }) {
    const id = Math.floor(Math.random() * 1000000); // Genera un ID aleatorio entero
    const sql = `
      INSERT INTO "IMPUESTO" ("ID", "NOMBREIMPUESTO", "IMPUESTO_PORC")
      VALUES ($1, $2, $3)
      RETURNING "ID", "NOMBREIMPUESTO";
    `;
    const result = await db.query(sql, [id, nombreImpuesto, impuestoPorc]);
    return result.rows[0];
  },

  async eliminarImpuesto(id) {
    try {
      // Eliminar productos que usan el impuesto
      const deleteProductosSql = 'DELETE FROM PRODUCTO WHERE IMPUESTO_ID = $1';
      await db.query(deleteProductosSql, [id]);
  
      // Eliminar el impuesto
      const sql = 'DELETE FROM "IMPUESTO" WHERE "ID" = $1 RETURNING "ID"';
      const result = await db.query(sql, [id]);
  
      if (result.rows.length === 0) {
        throw new Error('Impuesto no encontrado');
      }
  
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar el impuesto');
    }
  }
  
  ,

  // Editar un impuesto
 // Editar un impuesto
async editarImpuesto(id, { NOMBREIMPUESTO, IMPUESTO_PORC }) {
  try {
    // Verificación básica de los parámetros
    if (!id || !NOMBREIMPUESTO || !IMPUESTO_PORC) {
      throw new Error('Faltan parámetros para actualizar el impuesto.');
    }

    // Consultar y actualizar el impuesto en la base de datos
    const sql = `
      UPDATE "IMPUESTO" 
      SET "NOMBREIMPUESTO" = $1, "IMPUESTO_PORC" = $2
      WHERE "ID" = $3
      RETURNING *;
    `;
    
    const result = await db.query(sql, [NOMBREIMPUESTO, IMPUESTO_PORC, id]);

    // Si no se encuentra el impuesto, lanzar error
    if (result.rows.length === 0) {
      throw new Error('Impuesto no encontrado');
    }

    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error al editar el impuesto: ' + err.message);
  }
}

};

module.exports = Impuesto;
