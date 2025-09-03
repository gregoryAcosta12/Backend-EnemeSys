const Producto = require('../models/PruductModel');

const ProductController = {
  // Crear un solo producto
  async crearProducto(req, res) {
    try {
      const { nombre, precio, tipo, impuestoId, idUnidadMedida } = req.body;

      if (!nombre) return res.status(400).json({ message: "El campo 'nombre' es requerido." });
      if (!precio) return res.status(400).json({ message: "El campo 'precio' es requerido." });
      if (!tipo) return res.status(400).json({ message: "El campo 'tipo' es requerido." });
      if (!impuestoId) return res.status(400).json({ message: "El campo 'impuestoId' es requerido." });
      if (!idUnidadMedida) return res.status(400).json({ message: "El campo 'idUnidadMedida' es requerido." });

      const nuevoProducto = await Producto.crearProducto({
        nombreProducto: nombre,
        precio,
        tipoBienOServicio: tipo,
        impuestoId,
        unidadMedidaId: idUnidadMedida
      });

      res.status(201).json({
        message: "Producto creado exitosamente",
        producto: nuevoProducto
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear producto" });
    }
  },

  // Obtener productos
  async obtenerProductos(req, res) {
    try {
      const productos = await Producto.obtenerProductos();
      res.status(200).json({ productos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  },

  // Editar producto
  async editarProducto(req, res) {
    try {
      const { id } = req.params;
      const { nombre_producto, precio, tipo, impuesto_id, nombre_impuesto, impuesto_porcentaje } = req.body;

      const productoActualizado = await Producto.editarProducto(id, {
        nombre_producto,
        precio,
        tipoBienOServicio: tipo,
        impuesto_id,
        nombre_impuesto,
        impuesto_porcentaje
      });

      res.status(200).json({ message: "Producto actualizado exitosamente", producto: productoActualizado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al editar producto" });
    }
  },

  // Eliminar producto
  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;

      const productoEliminado = await Producto.eliminarProducto(id);

      res.status(200).json({ message: "Producto eliminado exitosamente", id: productoEliminado.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  },

//// Cargar múltiples productos desde un archivo Excel (sin validación estricta)
// Cargar múltiples productos desde un archivo Excel (sin validación estricta)
async cargarDesdeExcel(req, res) {
  try {
    const productosExcel = req.body.productos;

    if (!Array.isArray(productosExcel) || productosExcel.length === 0) {
      return res.status(400).json({ message: "Debe enviar un arreglo de productos." });
    }

    // 👇 Aquí estaba el error (crear → cargar)
    const productosInsertados = await Producto.cargarProductosDesdeExcel(productosExcel);

    res.status(201).json({
      message: "Productos cargados exitosamente desde Excel",
      productos: productosInsertados
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al cargar productos desde Excel" });
  }
}



};

module.exports = ProductController;
