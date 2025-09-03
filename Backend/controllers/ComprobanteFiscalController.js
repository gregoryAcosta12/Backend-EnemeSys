const ComprobanteFiscal = require('../models/ComprobanteFiscalModel');

const ComprobanteFiscalController = {
  // Obtener todos los comprobantes
  async obtenerComprobantes(req, res) {
    try {
      const comprobantes = await ComprobanteFiscal.obtenerComprobantes();
      res.status(200).json(comprobantes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los comprobantes fiscales' });
    }
  },

   // Editar comprobante
  async editarComprobante(req, res) {
    try {
      const { id } = req.params;
      const {
        NOMBRE,
        PREFIJO,
        INICIAR_EN,
        SECUENCIA_ACTUAL,
        TERMINAR_EN,
        FECHA_EMISION,
        FECHA_VENCIMIENTO,
        AVISAR_FALTANDO,
        ACTIVAR_IMPUESTO,
        ESTADO
      } = req.body;

      if (!NOMBRE || !PREFIJO || !FECHA_EMISION || !FECHA_VENCIMIENTO) {
        return res.status(400).json({ message: 'Campos obligatorios faltantes' });
      }

      const estadoFinal = ESTADO ? 'Activo' : 'Inactivo';

      const comprobanteEditado = await ComprobanteFiscal.editarComprobante(id, {
        NOMBRE,
        PREFIJO,
        INICIAR_EN,
        SECUENCIA_ACTUAL,
        TERMINAR_EN,
        FECHA_EMISION,
        FECHA_VENCIMIENTO,
        AVISAR_FALTANDO,
        ACTIVAR_IMPUESTO,
        ESTADO: estadoFinal
      });

      res.status(200).json({ message: 'Comprobante actualizado correctamente', comprobanteEditado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al editar el comprobante fiscal' });
    }
  }
};

module.exports = ComprobanteFiscalController;
