const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const Empresa = {
  async crearEmpresa({ nombre, rnc, direccion,direccion2, telefono, email, createdAt, fotoRegMercantil }) {
    const id = uuidv4(); // Generar un nuevo UUID

    const sql = `
      INSERT INTO "EMPRESAS" ("ID", "NOMBRE", "RNC", "DIRECCION", "DIRECCION_2","TELEFONO", "EMAIL", "FOTO_REGIS_MERCA", "CREATED_AT")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING "ID";
    `;

    const result = await db.query(sql, [id, nombre, rnc, direccion, direccion2, telefono, email, fotoRegMercantil, createdAt]);

    console.log("Empresa registrada con ID:", result.rows[0].ID);
    return result.rows[0]; // Retorna el ID generado
  }
};

module.exports = Empresa;
