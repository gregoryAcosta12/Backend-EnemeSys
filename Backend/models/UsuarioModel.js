const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const Usuario = {
  async crearUsuario({ Nombreusuario, apellido, usuario, adminEmail, password, empresaId, role, createdAt }) {
    const id = uuidv4(); // Generar un nuevo UUID

    const sql = `
      INSERT INTO "USUARIOS" ("ID", "NOMBRE","APELLIDOS","USERNAME", "EMAIL", "CONTRASEÑA", "EMPRESA_ID", "ROLE","CREATED_AT")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "ID", "USERNAME";
    `;

    const result = await db.query(sql, [id, Nombreusuario, apellido, usuario, adminEmail, password, empresaId, role, createdAt]);

    console.log("Usuario administrador registrado con ID:", result.rows[0].ID);
    return result.rows[0]; // Retorna el usuario creado
  }
};

module.exports = Usuario;
