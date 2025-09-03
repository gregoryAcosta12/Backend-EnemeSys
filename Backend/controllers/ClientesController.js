const Cliente = require('../models/ClienteModel');


const ClienteController = {
  // Obtener todos los clientes
  async obtenerClientes(req, res) {
    try {
      const clientes = await Cliente.obtenerClientes();
      res.status(200).json(clientes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los clientes' });
    }
  },

 // Cargar múltiples clientes desde un arreglo enviado en el body (como productos)
async cargarDesdeExcel(req, res) {
  try {
    const clientesExcel = req.body.clientes;

    if (!Array.isArray(clientesExcel) || clientesExcel.length === 0) {
      return res.status(400).json({ message: "Debe enviar un arreglo de clientes." });
    }

    const clientesInsertados = await Cliente.cargarClientesDesdeExcel(clientesExcel);

    res.status(201).json({
      message: "Clientes cargados exitosamente desde Excel",
      clientes: clientesInsertados
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al cargar clientes desde Excel" });
  }
},


  // Crear cliente
  async crearCliente(req, res) {
    try {
      const { nombre, rncOCedula, direccion, email, monedaId, pasaporte, tipoCliente } = req.body;

      if (!monedaId) {
        return res.status(400).json({ message: 'El campo MONEDA_ID es obligatorio' });
      }

      const nuevoCliente = await Cliente.crearCliente({
        nombre,
        rncOCedula,
        direccion,
        email,
        monedaId,
        pasaporte,
        tipoCliente
      });

      res.status(201).json({ message: "Cliente creado exitosamente", cliente: nuevoCliente });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear cliente" });
    }
  },

  // Eliminar cliente
  async eliminarCliente(req, res) {
    try {
      const { id } = req.params;
      const clienteEliminado = await Cliente.eliminarCliente(id);
      res.status(200).json({ message: "Cliente eliminado exitosamente", clienteEliminado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al eliminar el cliente" });
    }
  },

  // Editar cliente
// Editar cliente
async editarCliente(req, res) {
  try {
    const { id } = req.params;
    const { NOMBRE, RNC_O_CEDULA, pasaporte, DIRECCION, EMAIL, MONEDA_ID, tipo_cliente } = req.body;

    // Validar si algún campo está vacío
    if (!NOMBRE || !RNC_O_CEDULA || !pasaporte || !DIRECCION || !EMAIL || !MONEDA_ID || !tipo_cliente) {
      // Crear un mensaje de error detallando qué campos están vacíos
      const camposVacios = [];
      if (!NOMBRE) camposVacios.push('NOMBRE');
      if (!RNC_O_CEDULA) camposVacios.push('RNC_O_CEDULA');
      if (!pasaporte) camposVacios.push('pasaporte');
      if (!DIRECCION) camposVacios.push('DIRECCION');
      if (!EMAIL) camposVacios.push('EMAIL');
      if (!MONEDA_ID) camposVacios.push('monedaId');
      if (!tipoCliente) camposVacios.push('tipoCliente');

      return res.status(400).json({
        message: "Faltan campos requeridos",
        camposVacios: camposVacios
      });
    }

    // Si todos los campos son válidos, proceder a actualizar el cliente
    const clienteEditado = await Cliente.editarCliente(id, {
      NOMBRE,
      RNC_O_CEDULA,
      pasaporte,
      DIRECCION,
      EMAIL,
      MONEDA_ID,
      tipo_cliente
    });

    res.status(200).json({ message: "Cliente actualizado exitosamente", clienteEditado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al editar el cliente" });
  }
}

};

module.exports = ClienteController;
