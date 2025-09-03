const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const Medida = {
  async crearUnidadMedida({ siglas, unidadMedida }) {
    const id = uuidv4(); // Generar un nuevo UUID

    const sql = `
      INSERT INTO "unidad_medida" (ID, SIGLAS, UNIDAD_MEDIDA)
      VALUES ($1, $2, $3)
      RETURNING ID, SIGLAS, UNIDAD_MEDIDA;
    `;

    const result = await db.query(sql, [id, siglas, unidadMedida]);
    console.log("Unidad de medida registrada con ID:", result.rows[0].id);

    return result.rows[0];
  },

  async obtenerUnidadesMedida() {
    const sql = `
      SELECT ID, SIGLAS, UNIDAD_MEDIDA
      FROM "unidad_medida";
    `;

    const result = await db.query(sql);
    return result.rows;
  }
};

module.exports = Medida;
