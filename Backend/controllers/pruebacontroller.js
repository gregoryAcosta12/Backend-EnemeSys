const Factura = require('../models/FacturasModel');

const FacturasController = {
  async obtenerTodasLasFacturas(req, res) {
    try {
      const facturas = await Factura.obtenerTodasLasFacturas();
      res.status(200).json(facturas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener las facturas' });
    }
  },
  
  async obtenerFacturaConDetalles(req, res) {
    try {
      const { id } = req.params;
      const facturaCompleta = await Factura.obtenerFacturaConDetalles(id);
      res.status(200).json(facturaCompleta);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  async obtenerNotasPredeterminadas(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      
      const notas = await Factura.obtenerNotasPredeterminadas(req.user.id);
      res.status(200).json(notas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener notas predeterminadas' });
    }
  },

  async crearNotaPredeterminada(req, res) {
    try {
      const { titulo, contenido } = req.body;
      const usuarioId = req.user.id;
      const empresaId = req.user.empresaId || "c7dd4700-6d6e-496f-abfb-84d228de8500";

      if (!titulo || !contenido) {
        return res.status(400).json({ 
          message: 'Título y contenido son requeridos' 
        });
      }

      const nota = await Factura.crearNotaPredeterminada({
        empresaId,
        usuarioId,
        titulo,
        contenido
      });

      res.status(201).json(nota);
    } catch (err) {
      console.error('Error al crear nota predeterminada:', err);
      res.status(500).json({ 
        message: 'Error al crear nota predeterminada',
        error: err.message
      });
    }
  },

  async crearFactura(req, res) {
    try {
      const dataFactura = req.body.factura;
      const detalles = req.body.detalles || [];
      const notasPredeterminadas = req.body.notasPredeterminadas || [];

      if (!dataFactura || typeof dataFactura !== 'object') {
        return res.status(400).json({ message: 'La factura es requerida y debe ser un objeto' });
      }

      if (!Array.isArray(detalles)) {
        return res.status(400).json({ message: 'Los detalles deben ser un arreglo' });
      }

      if (!req.user || !req.user.id || !req.user.username) {
        return res.status(401).json({ message: 'Usuario no autenticado correctamente' });
      }

      dataFactura.USUARIO_ID = req.user.id;
      dataFactura.USUARIO_NOMBRE = req.user.username;
      dataFactura.CREATED_AT = new Date();

      const nuevaFactura = await Factura.crearFactura(dataFactura, detalles, notasPredeterminadas);

      if (!nuevaFactura || !nuevaFactura.id) {
        return res.status(500).json({ message: 'Factura no fue creada correctamente en la base de datos' });
      }

      res.status(201).json({
        message: 'Factura creada exitosamente',
        factura: nuevaFactura,
        secuencia: nuevaFactura.SECUENCIA_ACTUAL
      });

    } catch (err) {
      console.error('❌ Error al crear la factura:', err);
      res.status(500).json({
        message: 'Error al crear la factura',
        error: {
          message: err.message,
          code: err.code,
          detail: err.detail,
          hint: err.hint,
          where: err.where,
          position: err.position,
          routine: err.routine,
          campo_posible: err.where ? `Revisar el campo en la posición mencionada: ${err.where}` : undefined
        }
      });
    }
  },

  async eliminarFactura(req, res) {
    try {
      const { id } = req.params;
      const resultado = await Factura.eliminarFactura(id);
      res.status(200).json({ message: 'Factura eliminada exitosamente', resultado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || 'Error al eliminar la factura' });
    }
  },

  async editarFactura(req, res) {
    try {
      const { id } = req.params;
      const nuevosDatos = req.body.factura;

      console.log("🛠️ Editando factura con ID:", id);
      console.log("📦 Nuevos datos recibidos:", nuevosDatos);

      const facturaEditada = await Factura.editarFactura(id, nuevosDatos);
      res.status(200).json({ message: 'Factura actualizada exitosamente', facturaEditada });
    } catch (err) {
      console.error("❌ Error en editarFactura:", err);
      res.status(500).json({ message: err.message || 'Error al editar la factura' });
    }
  }
};

module.exports = FacturasController;