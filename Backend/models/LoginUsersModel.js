const db = require('../config/db');

const Usuario = {
  async buscarPorEmailOUsuarioYValidarRNC(emailOUsuario, rnc) {
    try {
      const sql = `
        SELECT u.*, e."RNC" 
        FROM "USUARIOS" u
        JOIN "EMPRESAS" e ON u."EMPRESA_ID" = e."ID"
        WHERE (u."EMAIL" = $1 OR u."USERNAME" = $1) AND e."RNC" = $2
      `;
      const result = await db.query(sql, [emailOUsuario, rnc]);

      if (result.rows.length === 0) {
        console.log("No se encontró el usuario con ese email/usuario o el RNC no coincide");
        return null;
      }

      return result.rows[0];
    } catch (err) {
      console.error("Error en la consulta de usuario:", err.message);
      throw new Error("Error al buscar el usuario");
    }
  }
};

module.exports = Usuario;
