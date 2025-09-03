const Impuesto = require('../models/ImpuestoModel');

const ImpuestoController = {
  // Obtener todos los impuestos
  async obtenerImpuestos(req, res) {
    try {
      const impuestos = await Impuesto.obtenerImpuestos();
      res.status(200).json(impuestos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los impuestos' });
    }
  },
  
  // Crear impuesto
  async crearImpuesto(req, res) {
    try {
      const { nombreImpuesto, impuestoPorc } = req.body;
      const nuevoImpuesto = await Impuesto.crearImpuesto({ nombreImpuesto, impuestoPorc });
      res.status(201).json({ message: "Impuesto creado exitosamente", impuesto: nuevoImpuesto });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear el impuesto" });
    }
  },

  // Eliminar impuesto
  async eliminarImpuesto(req, res) {
    try {
      const { id } = req.params;
      const impuestoEliminado = await Impuesto.eliminarImpuesto(id);
      res.status(200).json({ message: "Impuesto eliminado exitosamente", impuestoEliminado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al eliminar el impuesto" });
    }
  },

  // Editar impuesto
  async editarImpuesto(req, res) {
    try {
      const { id } = req.params;
      const { NOMBREIMPUESTO , IMPUESTO_PORC } = req.body;
      const impuestoEditado = await Impuesto.editarImpuesto(id, { NOMBREIMPUESTO , IMPUESTO_PORC });
      res.status(200).json({ message: "Impuesto actualizado exitosamente", impuestoEditado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al editar el impuesto" });
    }
  }
};

module.exports = ImpuestoController;
