const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // Configuración de la base de datos

const Cliente = {
  // Obtener todos los clientes con los campos especificados
  async obtenerClientes() {
    try {
      const sql = `
      SELECT 
        c."ID", 
        c."NOMBRE", 
        c."RNC_O_CEDULA", 
        c."pasaporte",         -- Aquí en minúsculas
        c."tipo_cliente", 
        c."DIRECCION", 
        c."EMAIL", 
        c."EMPRESA_ID", 
        c."MONEDA_ID",
        m."SIGLAS" AS "MONEDA_SIGLAS", 
        m."NOMBRE" AS "MONEDA_NOMBRE", 
        m."SIMBOLO" AS "MONEDA_SIMBOLO"
      FROM "CLIENTES" c
      JOIN "MONEDA" m ON c."MONEDA_ID" = m."ID"
    `;
      
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener clientes');
    }
  },

  // Crear cliente
  async crearCliente({ id, nombre, rncOCedula, direccion, email, monedaId, empresaId, pasaporte, tipoCliente }) {
    try {
      if (!monedaId) {
        throw new Error('El campo MONEDA_ID es obligatorio');
      }

      const clientId = id || Math.floor(Math.random() * 1000000);
      const empresaIdGenerado = empresaId || 'c7dd4700-6d6e-496f-abfb-84d228de8500';

      const sql = `
        INSERT INTO "CLIENTES" (
          "ID", "NOMBRE", "RNC_O_CEDULA", "DIRECCION", "EMAIL", 
          "EMPRESA_ID", "MONEDA_ID", "pasaporte", "tipo_cliente"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;

      const valores = [
        clientId,
        nombre,
        rncOCedula,
        direccion,
        email,
        empresaIdGenerado,
        monedaId,
        pasaporte || null,
        tipoCliente || null
      ];

      const result = await db.query(sql, valores);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al crear cliente');
    }
  },

  // Eliminar un cliente
  async eliminarCliente(id) {
    if (!id) {
      throw new Error('ID de cliente no proporcionado');
    }

    try {
      const sql = 'DELETE FROM "CLIENTES" WHERE "ID" = $1 RETURNING "ID"';
      const result = await db.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error('Cliente no encontrado');
      }
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar el cliente');
    }
  },
  // Dentro de ClienteModel.js
// Dentro de ClienteModel.js
async cargarClientesDesdeExcel(clientes) {
  const clienteInsertados = [];

  for (const cliente of clientes) {
    const {
      NOMBRE,
      RNC_O_CEDULA,
      pasaporte,
      DIRECCION,
      EMAIL,
      MONEDA_ID,
      tipo_cliente,
      EMPRESA_ID
    } = cliente;

    const id = Math.floor(Math.random() * 1000000);

    const monedaId = MONEDA_ID || 3; // Asignar ID 3 por defecto
    const empresaId = EMPRESA_ID || 'c7dd4700-6d6e-496f-abfb-84d228de8500';

    const sql = `
      INSERT INTO "CLIENTES" (
        "ID", "NOMBRE", "RNC_O_CEDULA", "pasaporte", "DIRECCION",
        "EMAIL", "MONEDA_ID", "tipo_cliente", "EMPRESA_ID"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const valores = [
      id,
      NOMBRE,
      RNC_O_CEDULA,
      pasaporte || null,
      DIRECCION,
      EMAIL,
      monedaId,
      tipo_cliente || null,
      empresaId
    ];

    const result = await db.query(sql, valores);
    clienteInsertados.push(result.rows[0]);
  }

  return clienteInsertados;
}
,


  // Editar cliente
async editarCliente(id, { NOMBRE, RNC_O_CEDULA, pasaporte, DIRECCION, EMAIL, MONEDA_ID, tipo_cliente }) {
  try {
    // Validamos que los campos obligatorios no estén vacíos o sean nulos
    if (!RNC_O_CEDULA || !RNC_O_CEDULA || !DIRECCION || !EMAIL) {
      throw new Error('Faltan campos obligatorios');
    }

    const sql = `
      UPDATE "CLIENTES" 
      SET "NOMBRE" = $1, "RNC_O_CEDULA" = $2, "pasaporte" = $3, "DIRECCION" = $4, 
          "EMAIL" = $5, "MONEDA_ID" = $6, "tipo_cliente" = $7
      WHERE "ID" = $8
      RETURNING *;
    `;
    const result = await db.query(sql, [NOMBRE, RNC_O_CEDULA, pasaporte, DIRECCION, EMAIL, MONEDA_ID, tipo_cliente, id]);

    if (result.rows.length === 0) {
      throw new Error('Cliente no encontrado');
    }

    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error al editar el cliente');
  }
}
};

module.exports = Cliente;
