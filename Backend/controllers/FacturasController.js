const Factura = require('../models/FacturasModel');


const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storageFactura = multer.diskStorage({
destination: (req, file, cb) => {
  const uploadPath = path.join(__dirname, '..', 'uploads'); 
  console.log('📂 Ruta de subida:', uploadPath);

  if (!fs.existsSync(uploadPath)) {
    console.log('🚨 Carpeta no existe, se creará automáticamente');
    fs.mkdirSync(uploadPath, { recursive: true });
  } else {
    console.log('✅ Carpeta existe');
  }

  cb(null, uploadPath);
},

});

const fileFilterFactura = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes y PDFs.'));
  }
};

const uploadFactura = multer({ storage: storageFactura, fileFilter: fileFilterFactura });

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
    const respuestaDGII = req.body.respuestaDGII || null;

    if (!dataFactura || typeof dataFactura !== 'object') {
      return res.status(400).json({ message: 'La factura es requerida y debe ser un objeto' });
    }

    dataFactura.USUARIO_ID = req.user.id;
    dataFactura.USUARIO_NOMBRE = req.user.username;
    dataFactura.CREATED_AT = new Date();

    // 🔹 Procesar archivo anexo si existe
    if (req.file) {
      // Leer el archivo como buffer
      const anexoBuffer = fs.readFileSync(req.file.path);
      
      // Convertir a base64 para almacenar en la base de datos
      const base64Data = anexoBuffer.toString('base64');
      const mimeType = req.file.mimetype;
      
      // Agregar al objeto dataFactura
      dataFactura.ANEXO_ARCHIVO = `data:${mimeType};base64,${base64Data}`;
      dataFactura.ANEXO_DESCRIPCION = req.body.anexo_descripcion || '';
      
      // 🗑️ Eliminar archivo temporal del servidor
      fs.unlinkSync(req.file.path);
    } else {
      dataFactura.ANEXO_ARCHIVO = null;
      dataFactura.ANEXO_DESCRIPCION = null;
    }

    let nuevaFactura;
    if (respuestaDGII) {
      nuevaFactura = await Factura.crearFacturaConDGII(dataFactura, detalles, respuestaDGII);
    } else {
      nuevaFactura = await Factura.crearFactura(dataFactura, detalles);
    }

    if (!nuevaFactura || !nuevaFactura.id) {
      return res.status(500).json({ message: 'Factura no fue creada correctamente en la base de datos' });
    }

    res.status(201).json({
      message: 'Factura creada exitosamente',
      factura: nuevaFactura
    });

  } catch (err) {
    console.error('❌ Error al crear la factura:', err);
    
    // Asegurarse de eliminar el archivo temporal en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Error al crear la factura', error: err.message });
  }
}
,
  async actualizarFacturaConDGII (req, res) {
     try {
    const { id } = req.params;
    const { encf, estado, url } = req.body;

    // Validar campos requeridos
    if (!encf || !estado || !url) {
      return res.status(400).json({ error: 'vengo del backend Faltan campos requeridos: encf, estado, url' });
    }

    // Buscar y actualizar la factura
    const facturaActualizada = await Factura.actualizarFacturaConDGII(id, {
      encf,
      estado,
      url
    });

    res.json(facturaActualizada);
  } catch (error) {
    console.error('Error al actualizar factura con datos DGII:', error);
    res.status(500).json({ error: error.message });
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
  // En el controlador FacturasController
async obtenerFacturasPorComprobanteAplica(req, res) {
  try {
    const { comprobanteAplica } = req.params;
    
    if (!comprobanteAplica) {
      return res.status(400).json({ 
        message: 'El parámetro comprobanteAplica es requerido' 
      });
    }

    const facturas = await Factura.obtenerFacturasPorComprobanteAplica(comprobanteAplica);
    
    if (facturas.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron facturas con ese comprobante aplicado' 
      });
    }

    res.status(200).json(facturas);
  } catch (err) {
    console.error('Error al obtener facturas por COMPROBANTE_APLICA:', err);
    res.status(500).json({ 
      message: 'Error al obtener facturas por comprobante aplicado',
      error: err.message 
    });
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