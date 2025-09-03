const Medida = require('../models/MedidaModel');

const MedidaController = {
  // Crear unidad de medida
  async crearUnidadMedida(req, res) {
    try {
      const { siglas, unidadMedida } = req.body;

      const nuevaUnidad = await Medida.crearUnidadMedida({ siglas, unidadMedida });

      res.status(201).json({
        message: "Unidad de medida creada exitosamente",
        unidad: nuevaUnidad
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear unidad de medida" });
    }
  },

  // Obtener todas las unidades de medida
  async obtenerUnidadesMedida(req, res) {
    try {
      const unidades = await Medida.obtenerUnidadesMedida();

      res.status(200).json(unidades);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al obtener unidades de medida" });
    }
  }
};

module.exports = MedidaController;
