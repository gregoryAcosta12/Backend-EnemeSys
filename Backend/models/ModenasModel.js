const db = require('../config/db'); // Configuración de la base de datos

const Moneda = {
  // Obtener todas las monedas
  async obtenerTodasLasMonedas() {
    try {
      const sql = 'SELECT * FROM "MONEDA"';
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener las monedas');
    }
  },

// Crear una moneda con ID autogenerado
async crearMoneda({ siglas, nombre, simbolo, tasa }) {
  try {
    const id = Math.floor(Math.random() * 1000000); // Genera un ID aleatorio entero
    const sql = `
      INSERT INTO "MONEDA" ("ID", "SIGLAS", "NOMBRE", "SIMBOLO", "TASA")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "ID", "SIGLAS", "NOMBRE", "SIMBOLO", "TASA";
    `;
    const result = await db.query(sql, [id, siglas, nombre, simbolo, tasa]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error al crear la moneda');
  }
},

 async actualizarTasaMoneda(id, nuevaTasa) {
    try {
      const sql = `
        UPDATE "MONEDA" 
        SET "TASA" = $1 
        WHERE "ID" = $2
        RETURNING "ID", "SIGLAS", "NOMBRE", "SIMBOLO", "TASA";
      `;
      const result = await db.query(sql, [nuevaTasa, id]);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al actualizar la tasa de la moneda');
    }
  }

};

module.exports = Moneda;
