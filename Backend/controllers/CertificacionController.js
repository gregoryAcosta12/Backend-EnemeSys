const Certificacion = require('../models/CertificacionModel');

const CertificacionController = {
  async obtenerCertificaciones(req, res) {
    try {
      const datos = await Certificacion.obtenerCertificaciones();
      res.status(200).json(datos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener certificaciones' });
    }
  },

  async crearCertificacion(req, res) {
    try {
      const { paso_actual, secuenciaultenviado, id_empresa } = req.body;

      if (!paso_actual || !secuenciaultenviado || !id_empresa) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      const nueva = await Certificacion.crearCertificacion({ paso_actual, secuenciaultenviado, id_empresa });
      res.status(201).json({ message: 'Certificación creada exitosamente', certificacion: nueva });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear certificación' });
    }
  },

  async editarCertificacion(req, res) {
    try {
      const { id } = req.params;
      const { paso_actual, secuenciaultenviado, id_empresa } = req.body;

      if (!paso_actual || !secuenciaultenviado || !id_empresa) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar' });
      }

      const certificacionActualizada = await Certificacion.editarCertificacion(id, {
        paso_actual,
        secuenciaultenviado,
        id_empresa
      });

      res.status(200).json({ message: 'Certificación actualizada exitosamente', certificacion: certificacionActualizada });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al editar certificación' });
    }
  }
};

module.exports = CertificacionController;
