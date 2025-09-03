const { v4: uuidv4, validate } = require('uuid'); // Importa la librería uuid
const db = require('../config/db'); // Tu configuración de la base de datos

const User = {
  // Obtener todos los usuarios
  async obtenerTodosLosUsuarios() {
    try {
      const sql = 'SELECT * FROM "USUARIOS"';
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener todos los usuarios');
    }
  },

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(id) {
    // Validar que el id es un UUID válido
    if (!validate(id)) {
      throw new Error('ID no es un UUID válido');
    }

    try {
      const sql = 'SELECT * FROM "USUARIOS" WHERE "ID" = $1';
      const result = await db.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener el usuario');
    }
  },

  /// Crear un usuario
async crearUsuario({
  nombre,
  apellidos,
  username,
  email,
  password,
  role,
  empresaId,
  createdAt,
  creadoPorId,
  creadoPorNombre
}) {
  const id = uuidv4(); // Generar un UUID válido para el nuevo usuario
  const sql = `
    INSERT INTO "USUARIOS" (
      "ID", "NOMBRE", "APELLIDOS", "USERNAME", "EMAIL", "CONTRASEÑA", 
      "ROLE", "EMPRESA_ID", "CREATED_AT", "CREADO_POR_ID", "CREADO_POR_NOMBRE"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING "ID", "USERNAME";
  `;
  const result = await db.query(sql, [
    id, nombre, apellidos, username, email, password,
    role, empresaId, createdAt, creadoPorId, creadoPorNombre
  ]);
  return result.rows[0];
},

  // Eliminar un usuario
  async eliminarUsuario(id) {
    // Validar que el id es un UUID válido
    if (!validate(id)) {
      throw new Error('ID no es un UUID válido');
    }

    try {
      const sql = 'DELETE FROM "USUARIOS" WHERE "ID" = $1 RETURNING "ID"';
      const result = await db.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar el usuario');
    }
  },

  // Editar un usuario
  async editarUsuario(id, { NOMBRE, APELLIDOS, USERNAME, EMAIL }) {
    // Validar que el id es un UUID válido
    if (!validate(id)) {
      throw new Error('ID no es un UUID válido');
    }

    try {
      const sql = `
        UPDATE "USUARIOS" 
        SET "NOMBRE" = $1, "APELLIDOS" = $2, "USERNAME" = $3, "EMAIL" = $4
        WHERE "ID" = $5
        RETURNING *;
      `;
      const result = await db.query(sql, [NOMBRE, APELLIDOS, USERNAME, EMAIL, id]);
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al editar el usuario');
    }
  }
};

module.exports = User;
