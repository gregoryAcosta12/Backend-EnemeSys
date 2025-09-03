const SecuenciaFactura = require('../models/SecuenciaFacturaModel');

const SecuenciaFacturaController = {
  async obtenerENCF(req, res) {
    try {
      const prefijoForzado = req.query.prefijo || null

    console.log(`Solicitud eNCF - Prefijo forzado: ${prefijoForzado}`)

    // Pasar el prefijo forzado al modelo
    const eNCF = await SecuenciaFactura.obtenerENCF(undefined, prefijoForzado)

    res.json({
      eNCF,
      prefijo: prefijoForzado || eNCF.substring(0, 3),
      success: true,
    })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener la secuencia del eNCF' });
    }
  }
};

module.exports = SecuenciaFacturaController;
