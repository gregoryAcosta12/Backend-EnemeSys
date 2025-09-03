const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const Producto = {
  // Crear producto
  async crearProducto({
    nombreProducto,
    precio,
    tipoBienOServicio,
    impuestoId,
    unidadMedidaId
  }) {
    const id = uuidv4();
    const empresaId = 'c7dd4700-6d6e-496f-abfb-84d228de8500';

    const sql = `
      INSERT INTO "producto" (
        ID, nombre_producto, PRECIO, TIPO_BIEN_O_SERVICIO, 
        IMPUESTO_ID, UNIDAD_MEDIDA_ID, EMPRESA_ID
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ID, NOMBRE_PRODUCTO;
    `;

    const result = await db.query(sql, [
      id,
      nombreProducto,
      precio,
      tipoBienOServicio,
      impuestoId,
      unidadMedidaId,
      empresaId
    ]);

    console.log("Producto registrado con ID:", result.rows[0].id);
    return result.rows[0];
  },


  // Cargar productos desde Excel
  async cargarProductosDesdeExcel(listaDeProductos) {
    const empresaId = 'c7dd4700-6d6e-496f-abfb-84d228de8500';
    const resultados = [];

    for (const producto of listaDeProductos) {
      let {
        nombreProducto,
        precio,
        tipoBienOServicio,
        impuestoId,
        unidadMedidaId
      } = producto;

      
   
      const id = uuidv4();

      const sql = `
        INSERT INTO "producto" (
          ID, nombre_producto, PRECIO, TIPO_BIEN_O_SERVICIO, 
          IMPUESTO_ID, UNIDAD_MEDIDA_ID, EMPRESA_ID
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING ID, NOMBRE_PRODUCTO;
      `;

      try {
        const result = await db.query(sql, [
          id,
          nombreProducto,
          precio,
          tipoBienOServicio,
          impuestoId,
          unidadMedidaId,
          empresaId
        ]);
        console.log("Producto cargado desde Excel:", result.rows[0]);
        resultados.push(result.rows[0]);
      } catch (error) {
        console.error("Error al cargar producto desde Excel:", error.message);
        resultados.push({ error: error.message, producto });
      }
    }

    return resultados;
  },

  // Obtener productos
  async obtenerProductos() {
    const sql = `
      SELECT 
        p.id,
        p.nombre_producto,
        p.precio,
        p.tipo_bien_o_servicio,
        p.impuesto_id,
        i."NOMBREIMPUESTO",
        i."IMPUESTO_PORC"
      FROM producto p
      LEFT JOIN "IMPUESTO" i ON p.impuesto_id = i."ID";
    `;

    const result = await db.query(sql);
    return result.rows;
  },

  // Editar producto
  async editarProducto(id, { nombre_producto, precio, tipoBienOServicio, impuesto_id }) {
    const sql = `
      UPDATE "producto"
      SET nombre_producto = $1, PRECIO = $2, TIPO_BIEN_O_SERVICIO = $3, 
          impuesto_id = $4
      WHERE ID = $5
      RETURNING ID, nombre_producto, precio, tipo_bien_o_servicio, impuesto_id;
    `;

    const result = await db.query(sql, [nombre_producto, precio, tipoBienOServicio, impuesto_id, id]);
    const productoActualizado = result.rows[0];

    const impuestoSql = `
      SELECT "NOMBREIMPUESTO", "IMPUESTO_PORC"
      FROM "IMPUESTO"
      WHERE "ID" = $1;
    `;

    const impuestoResult = await db.query(impuestoSql, [productoActualizado.impuesto_id]);

    if (impuestoResult.rows.length > 0) {
      productoActualizado.nombre_impuesto = impuestoResult.rows[0].nombre_impuesto;
      productoActualizado.impuesto_porcentaje = impuestoResult.rows[0].impuesto_porcentaje;
    }

    return productoActualizado;
  },

  // Eliminar producto
  async eliminarProducto(id) {
    const sql = `
      DELETE FROM "producto"
      WHERE ID = $1
      RETURNING ID;
    `;
    const result = await db.query(sql, [id]);
    return result.rows[0];
  }
};

module.exports = Producto;
