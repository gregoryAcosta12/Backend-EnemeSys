const Moneda = require('../models/ModenasModel');

const MonedaController = {
  // Obtener todas las monedas
  async obtenerTodasLasMonedas(req, res) {
    try {
      const monedas = await Moneda.obtenerTodasLasMonedas();
      res.status(200).json(monedas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener las monedas' });
    }
  },

  // Crear una moneda
  async crearMoneda(req, res) {
    try {
      const { siglas, nombre, simbolo, tasa } = req.body;

      if (!siglas || !tasa) {
        return res.status(400).json({ message: 'Siglas y tasa son obligatorias' });
      }

      const nuevaMoneda = await Moneda.crearMoneda({
        siglas,
        nombre,
        simbolo,
        tasa
      });

      res.status(201).json({ message: 'Moneda creada exitosamente', moneda: nuevaMoneda });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear la moneda' });
    }
  },
  async actualizarTasaMoneda(req, res) {
    try {
      const { id } = req.params;
      const { tasa } = req.body;

      if (!id || !tasa) {
        return res.status(400).json({ message: 'ID de moneda y nueva tasa son requeridos' });
      }

      const monedaActualizada = await Moneda.actualizarTasaMoneda(id, tasa);
      
      res.status(200).json({ 
        message: 'Tasa de moneda actualizada exitosamente',
        moneda: monedaActualizada
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar la tasa de la moneda' });
    }
  }
};

module.exports = MonedaController;
