const db = require("../config/db")

const SecuenciaFactura = {
  async obtenerENCF(empresaId = "c7dd4700-6d6e-496f-abfb-84d228de8500", prefijoForzado = null) {
    try {
      let prefijo

      // Si se proporciona un prefijo forzado (como E34), usarlo directamente
      if (prefijoForzado) {
        prefijo = prefijoForzado
        console.log(`Usando prefijo forzado: ${prefijo}`)
      } else {
        // 1. Buscar la última factura insertada (por fecha de creación)
        const res = await db.query(`
          SELECT "COMPROBANTE_NOMBRE"
          FROM "FACTURA"
          WHERE "COMPROBANTE_NOMBRE" IS NOT NULL
          ORDER BY "CREATED_AT" DESC
          LIMIT 1
        `)

        if (res.rows.length === 0) {
          console.warn("No hay facturas con comprobante, usando E31 por defecto")
          prefijo = "E31"
        } else {
          const comprobanteNombre = res.rows[0].COMPROBANTE_NOMBRE
          if (!comprobanteNombre) {
            throw new Error("La secuencia está <NULL> y no puede ser usada.")
          }
          prefijo = comprobanteNombre.substring(0, 3) // Ej: "E45"
        }
      }

      // 2. Llamar a la función para obtener el número secuencial
      const result = await db.query("SELECT asignar_siguiente_comprobante($1, $2) AS secuencia", [prefijo, empresaId])

      let numero = result.rows[0].secuencia

      if (numero === null || numero === undefined) {
        throw new Error(`No se pudo obtener secuencia para el prefijo ${prefijo}`)
      }

      // Asegurarse de que sea número, quitar ceros sobrantes si los hay
      numero = Number.parseInt(numero) // Elimina ceros innecesarios
      const numeroFormateado = numero.toString().padStart(10, "0") // Siempre 10 dígitos

      // 3. Unir con el prefijo
      const secuenciaFinal = `${prefijo}${numeroFormateado}` // Total: 13 caracteres

      // Validación final
      if (secuenciaFinal.length !== 13) {
        throw new Error(`eNCF inválido: '${secuenciaFinal}' (longitud ${secuenciaFinal.length})`)
      }

      console.log(`eNCF generado exitosamente: ${secuenciaFinal}`)
      return secuenciaFinal
    } catch (error) {
      console.error("Error al obtener eNCF:", error.message)
      throw new Error("Error al obtener la secuencia del eNCF")
    }
  },
}

module.exports = SecuenciaFactura
