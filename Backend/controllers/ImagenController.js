const Factura = require('../models/Factura'); // Si quieres guardar la ruta de la imagen en la factura
// const OtroModelo = require('../models/OtroModelo'); // O usar otro modelo si es distinto

const subirImagenFactura = async (req, res) => {
  try {
    const { facturaId } = req.body; // opcional, si quieres relacionar la imagen con una factura existente
    const imagen = req.file;

    if (!imagen) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const rutaImagen = imagen.path;

    // Si quieres guardar en la factura existente
    if (facturaId) {
      const factura = await Factura.findByPk(facturaId);
      if (!factura) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }
      factura.imagen = rutaImagen;
      await factura.save();
      return res.status(200).json(factura);
    }

    // Si quieres crear un registro solo de la imagen
    // const nuevaImagen = await OtroModelo.create({ ruta: rutaImagen });
    // return res.status(201).json(nuevaImagen);

    res.status(200).json({ rutaImagen });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir imagen' });
  }
};

module.exports = { subirImagenFactura };
