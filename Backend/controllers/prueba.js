const { v4: uuidv4, validate: validarUUID } = require('uuid');
const db = require('../config/db');
const EMPRESA_ID_DEFECTO = "c7dd4700-6d6e-496f-abfb-84d228de8500";

const Factura = {
  async crearNotaPredeterminada({ empresaId, usuarioId, titulo, contenido }) {
    try {
      const sql = `INSERT INTO NOTAS_PREDETERMINADAS (
        ID, EMPRESA_ID, USUARIO_ID, TITULO, CONTENIDO
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      
      const result = await db.query(sql, [
        uuidv4(),
        empresaId,
        usuarioId,
        titulo,
        contenido,
      ]);
      
      return result.rows[0];
    } catch (err) {
      console.error('Error al crear nota predeterminada:', err);
      throw new Error('Error al crear nota predeterminada');
    }
  },

  async obtenerNotasPredeterminadas(usuarioId) {
    try {
      const sql = 'SELECT * FROM NOTAS_PREDETERMINADAS WHERE USUARIO_ID = $1 ORDER BY TITULO';
      const result = await db.query(sql, [usuarioId]);
      return result.rows;
    } catch (err) {
      console.error('Error al obtener notas predeterminadas:', err);
      throw new Error('Error al obtener notas predeterminadas');
    }
  },

  async obtenerTodasLasFacturas() {
    try {
      const sql = 'SELECT * FROM "FACTURA" ORDER BY "CREATED_AT" DESC';
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener las facturas');
    }
  },

  async obtenerFacturaConDetalles(id) {
    if (!validarUUID(id)) {
      throw new Error('ID no es un UUID válido');
    }

    try {
      const facturaSql = 'SELECT * FROM "FACTURA" WHERE "ID" = $1';
      const detallesSql = 'SELECT * FROM DETALLE_FACTURA WHERE factura_id = $1';

      const facturaResult = await db.query(facturaSql, [id]);
      if (facturaResult.rows.length === 0) {
        throw new Error('Factura no encontrada');
      }

      const detallesResult = await db.query(detallesSql, [id]);
      return {
        ...facturaResult.rows[0],
        detalles: detallesResult.rows
      };
    } catch (err) {
      console.error(err);
      throw new Error('Error al obtener la factura con detalles');
    }
  },

  async crearFactura(dataFactura, detalles = [], notasPredeterminadas = []) {
    const facturaId = uuidv4();

    const {
      EMPRESA_ID = EMPRESA_ID_DEFECTO,
      USUARIO_ID, USUARIO_NOMBRE, COMPROBANTE_NOMBRE,
      FECHA_VENCI_COMPROBANTE, CLIENTE_ID,
      CLIENTE_NOMBRE, RNC_CEDULA_CLIENTE, MONEDA_ID, SIGLAS_MONEDA = 'DOP',
      TASA, COMPROBANTE_APLICA, FECHA_EMISION, CREATED_AT = new Date(), TIPO_FACT,
      TOTAL_IMP = 0, RECARGO = 0, TOTALDESCUENTO, FECHA_PROX_PAGO, FECHA_A_PAGAR,
      SUBTOTAL, TOTAL_FACT, TOTAL_FACT_MONEDA_BASE = TOTAL_FACT, TOTAL_IMPUESTO_SERVICIO,
      CODIGO_QR_URL = null, FILENAMEXML = null, FECHAHORAFIRMAXML = null, HASHXML = null,
      ESTATUSDGII = null, RAZON_RESP_DGII = null, ESTADOFACT, INFO1 = '', INFO2 = '', INFO3 = ''
    } = dataFactura;

    // Validaciones de UUID
    if (!validarUUID(facturaId)) throw new Error(`ID generado no es un UUID válido: ${facturaId}`);
    if (!validarUUID(EMPRESA_ID)) throw new Error(`EMPRESA_ID no es un UUID válido: ${EMPRESA_ID}`);
    if (!validarUUID(USUARIO_ID)) throw new Error(`USUARIO_ID no es un UUID válido: ${USUARIO_ID}`);

    const monedaIdInt = parseInt(MONEDA_ID, 10);
    if (isNaN(monedaIdInt)) throw new Error('MONEDA_ID debe ser un número válido');

    const clienteIdInt = parseInt(CLIENTE_ID, 10);
    if (isNaN(clienteIdInt)) throw new Error('CLIENTE_ID debe ser un número válido');

    const siglasMoneda = SIGLAS_MONEDA ? SIGLAS_MONEDA.substring(0, 3).toUpperCase() : 'DOP';
    const tasaNum = TASA === '' || TASA === null || isNaN(parseFloat(TASA)) ? 1 : parseFloat(TASA);

    try {
      const secuenciaResult = await db.query('SELECT obtener_siguiente_secuencia() as secuencia');
      const secuenciaFinal = secuenciaResult.rows[0].secuencia;

      const facturaSql = `INSERT INTO "FACTURA" (
        "ID", "EMPRESA_ID", "USUARIO_ID", "USUARIO_NOMBRE", "COMPROBANTE_NOMBRE",
        "SECUENCIA_ACTUAL", "FECHA_VENCI_COMPROBANTE", "CLIENTE_ID", "CLIENTE_NOMBRE",
        "RNC_CEDULA_CLIENTE", "MONEDA_ID", "SIGLAS_MONEDA", "TASA", "COMPROBANTE_APLICA",
        "FECHA_EMISION", "CREATED_AT", "TIPO_FACT", "TOTAL_IMP", "RECARGO", "TOTALDESCUENTO",
        "FECHA_PROX_PAGO", "FECHA_A_PAGAR", "SUBTOTAL", "TOTAL_FACT", "TOTAL_FACT_MONEDA_BASE",
        "TOTAL_IMPUESTO_SERVICIO", "CODIGO_QR_URL", "FILENAMEXML", "FECHAHORAFIRMAXML",
        "HASHXML", "ESTATUSDGII", "RAZON_RESP_DGII", "ESTADOFACT", "INFO1", "INFO2", "INFO3"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31, $32, $33, $34,
        $35, $36
      ) RETURNING *`;

      const result = await db.query(facturaSql, [
        facturaId, EMPRESA_ID, USUARIO_ID, USUARIO_NOMBRE, COMPROBANTE_NOMBRE,
        secuenciaFinal, FECHA_VENCI_COMPROBANTE, clienteIdInt, CLIENTE_NOMBRE,
        RNC_CEDULA_CLIENTE, monedaIdInt, siglasMoneda, tasaNum, COMPROBANTE_APLICA,
        FECHA_EMISION, CREATED_AT, TIPO_FACT, TOTAL_IMP, RECARGO, TOTALDESCUENTO,
        FECHA_PROX_PAGO, FECHA_A_PAGAR, SUBTOTAL, TOTAL_FACT, TOTAL_FACT_MONEDA_BASE,
        TOTAL_IMPUESTO_SERVICIO, CODIGO_QR_URL, FILENAMEXML, FECHAHORAFIRMAXML,
        HASHXML, ESTATUSDGII, RAZON_RESP_DGII, ESTADOFACT, INFO1, INFO2, INFO3
      ]);

      const facturaCreada = result.rows[0];

      // Insertar detalles
      if (detalles.length > 0) {
        const detalleSql = `INSERT INTO DETALLE_FACTURA (
          FACTURA_ID, EMPRESA_ID, DESCRIPCION, CANTIDAD, UNIDAD_MEDIDA,
          PRECIO_UNITARIO, SUBTOTAL, TIPO_BIEN_SERVICIO, TOTAL_LINEA_FACT,
          DESCUENTO, NOMBREIMPUESTO, IMPUESTO_PORC, TASA, MONEDA_ID,
          TOTAL_MONEDA_BASE, SIGLA_MONEDA
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16
        )`;

        for (const detalle of detalles) {
          if (!detalle.DESCRIPCION || detalle.DESCRIPCION.trim() === '') continue;

          const d = {
            ...detalle,
            EMPRESA_ID: detalle.EMPRESA_ID || EMPRESA_ID,
            UNIDAD_MEDIDA: detalle.UNIDAD_MEDIDA || 'UND',
            TIPO_BIEN_SERVICIO: detalle.TIPO_BIEN_SERVICIO || 'BIEN',
            DESCUENTO: parseFloat(detalle.DESCUENTO) || 0,
            NOMBREIMPUESTO: detalle.NOMBREIMPUESTO || 'ITBIS',
            TASA: parseFloat(detalle.TASA) || tasaNum,
            MONEDA_ID: parseInt(detalle.MONEDA_ID || MONEDA_ID, 10),
            TOTAL_MONEDA_BASE: parseFloat(detalle.TOTAL_MONEDA_BASE || detalle.TOTAL_LINEA_FACT),
            SIGLA_MONEDA: (detalle.SIGLA_MONEDA || siglasMoneda).substring(0, 3)
          };

          if (!validarUUID(d.EMPRESA_ID)) {
            throw new Error(`EMPRESA_ID inválido en detalle: ${d.EMPRESA_ID}`);
          }

          await db.query(detalleSql, [
            facturaId,
            d.EMPRESA_ID,
            d.DESCRIPCION,
            parseFloat(d.CANTIDAD),
            d.UNIDAD_MEDIDA,
            parseFloat(d.PRECIO_UNITARIO),
            parseFloat(d.SUBTOTAL),
            d.TIPO_BIEN_SERVICIO,
            parseFloat(d.TOTAL_LINEA_FACT),
            d.DESCUENTO,
            d.NOMBREIMPUESTO,
            parseFloat(d.IMPUESTO_PORC),
            d.TASA,
            d.MONEDA_ID,
            d.TOTAL_MONEDA_BASE,
            d.SIGLA_MONEDA
          ]);
        }
      }

      // Insertar notas predeterminadas
      if (notasPredeterminadas.length > 0) {
        const notaSql = `INSERT INTO NOTAS_FACTURA (
          FACTURA_ID, NOTA_PREDETERMINADA_ID
        ) VALUES ($1, $2)`;

        for (const notaId of notasPredeterminadas) {
          if (!validarUUID(notaId)) {
            throw new Error(`NOTA_PREDETERMINADA_ID inválido: ${notaId}`);
          }
          await db.query(notaSql, [facturaId, notaId]);
        }
      }

      return facturaCreada;

    } catch (err) {
      console.error('❌ Error al crear la factura:', err);
      throw new Error(`Error al crear la factura: ${err.message}`);
    }
  },

  async eliminarFactura(id) {
    if (!validarUUID(id)) {
      throw new Error('ID no es un UUID válido');
    }

    try {
      await db.query('DELETE FROM "DETALLE_FACTURA" WHERE "FACTURA_ID" = $1', [id]);
      const result = await db.query('DELETE FROM "FACTURA" WHERE "ID" = $1', [id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar la factura');
    }
  },

  async editarFactura(id, nuevosDatos) {
    if (!validarUUID(id)) {
      throw new Error('ID no es un UUID válido');
    }

    if (!nuevosDatos.MONEDA_ID) {
      nuevosDatos.MONEDA_ID = 3;
    }

    const columnasValidas = [
      "CLIENTE_ID", "CLIENTE_NOMBRE", "RNC_CEDULA_CLIENTE", "FECHA_EMISION",
      "FECHA_A_PAGAR", "MONEDA_ID", "SIGLAS_MONEDA", "TASA", "INFO1", "INFO2",
      "TOTALDESCUENTO", "TOTAL_IMP", "TOTAL_FACT", "SUBTOTAL", "TIPO_FACT",
      "COMPROBANTE_NOMBRE", "ESTADOFACT", "TOTAL_IMPUESTO_SERVICIO"
    ];

    const datosFiltrados = {};
    for (const key of Object.keys(nuevosDatos)) {
      if (columnasValidas.includes(key)) {
        datosFiltrados[key] = nuevosDatos[key];
      }
    }

    if (Object.keys(datosFiltrados).length === 0) {
      throw new Error("No hay campos válidos para actualizar");
    }

    const fields = Object.keys(datosFiltrados);
    const values = Object.values(datosFiltrados);
    const setClause = fields.map((field, idx) => `"${field}" = $${idx + 2}`).join(', ');

    try {
      const sql = `UPDATE "FACTURA" SET ${setClause} WHERE "ID" = $1 RETURNING *`;
      const result = await db.query(sql, [id, ...values]);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error al actualizar la factura');
    }
  }
};

module.exports = Factura;
