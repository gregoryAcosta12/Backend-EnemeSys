const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/FacturasController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FacturasController = require('../controllers/FacturasController');

// Configuración multer para archivos de facturas
const storageFactura = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'facturas');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'anexo-' + uniqueSuffix + path.extname(file.originalname));
  }
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


router.post('/crear-factura', authMiddleware,
 
  uploadFactura.single('anexo_archivo'), // ¡Asegúrate de que este sea el nombre correcto!
  FacturasController.crearFactura
);

// Obtener todas las facturas
router.get('/listar', FacturaController.obtenerTodasLasFacturas);



// Obtener notas predeterminadas
router.get('/notas-predeterminadas', authMiddleware,FacturaController.obtenerNotasPredeterminadas);

// Crear nota predeterminada
router.post('/notas-predeterminadas', authMiddleware, FacturaController.crearNotaPredeterminada);

// Editar una factura
router.put('/editar/:id', FacturaController.editarFactura);

// Eliminar una factura
router.delete('/eliminar/:id', FacturaController.eliminarFactura);

// Esta debe ir al final
router.get('/:id', FacturaController.obtenerFacturaConDetalles);

router.put('/editar/:id', authMiddleware, FacturaController.editarFactura);

// En tu archivo de rutas (routes/facturas.js)
router.put('/actualizar-dgii/:id', authMiddleware, FacturaController.actualizarFacturaConDGII);

// En tus routes
router.get('/comprobante-aplica/:comprobanteAplica', 
  authMiddleware, 
  FacturaController.obtenerFacturasPorComprobanteAplica
);


// En tu servidor (backend), necesitarás un endpoint para manejar la creación de facturas E33
router.post('/crear-factura-e33', async (req, res) => {
  try {
    const { facturaOriginalId, razonAnulacion } = req.body;
    
    // Obtener factura original
    const facturaOriginal = await Factura.findByPk(facturaOriginalId, {
      include: [DetalleFactura]
    });
    
    if (!facturaOriginal) {
      return res.status(404).json({ error: 'Factura original no encontrada' });
    }
    
    // Generar nuevo NCF para E33
    const nuevoNCF = await generarNCF('E33');
    
    // Crear factura E33
    const facturaE33 = await Factura.create({
      tipo: 'E33',
      secuencia: nuevoNCF,
      fecha_emision: new Date(),
      cliente_id: facturaOriginal.cliente_id,
      rnc_cedula: facturaOriginal.rnc_cedula,
      subtotal: 0,
      impuestos: 0,
      total: 0,
      estado: 'anulada',
      factura_original_id: facturaOriginal.id,
      razon_anulacion: razonAnulacion
    });
    
    // Crear detalle de la factura E33
    await DetalleFactura.create({
      factura_id: facturaE33.id,
      descripcion: `Anulación de factura ${facturaOriginal.secuencia}`,
      cantidad: 1,
      precio_unitario: 0,
      impuesto: 0,
      subtotal: 0,
      total: 0
    });
    
    res.json(facturaE33);
    
  } catch (error) {
    console.error('Error al crear factura E33:', error);
    res.status(500).json({ error: 'Error al crear factura de anulación' });
  }
});

module.exports = router;
