const User = require('../models/UserModel');


const UserController = {
  // Obtener todos los usuarios
  async obtenerTodosLosUsuarios(req, res) {
    try {
      const usuarios = await User.obtenerTodosLosUsuarios();
      res.status(200).json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  },

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(req, res) {
    try {
      const { id } = req.params; // Obtenemos el ID desde los parámetros de la URL
      const usuario = await User.obtenerUsuarioPorId(id); // Llamamos al método del modelo para obtener el usuario

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario encontrado", usuario }); // Retornamos el usuario con un mensaje de éxito
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  },


// Crear usuario
async crearUsuario(req, res) {
  try {
    const { nombre, apellidos, username, email, password, role } = req.body;
    const empresaId = req.user.empresaId;
    const createdAt = new Date();

    const creadoPorId = req.user.id; // ID del usuario autenticado
    const creadoPorNombre = req.user.username; // Username del usuario autenticado

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.crearUsuario({
      nombre,
      apellidos,
      username,
      email,
      password: hashedPassword,
      role,
      empresaId,
      createdAt,
      creadoPorId,
      creadoPorNombre
    });

    console.log(`✅ Usuario creado por: ${creadoPorNombre} (ID: ${creadoPorId})`);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: nuevoUsuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear usuario" });
  }
}
,

  // Eliminar usuario
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuarioEliminado = await User.eliminarUsuario(id);
      res.status(200).json({ message: "Usuario eliminado exitosamente", usuarioEliminado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  },

  // Editar usuario
  async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { NOMBRE, APELLIDOS, USERNAME, EMAIL } = req.body;

      const usuarioEditado = await User.editarUsuario(id, {
        NOMBRE,
        APELLIDOS,
        USERNAME,
        EMAIL,
        
      });

      res.status(200).json({ message: "Usuario actualizado exitosamente", usuarioEditado });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al editar el usuario" });
    }
  }
};

module.exports = UserController;
