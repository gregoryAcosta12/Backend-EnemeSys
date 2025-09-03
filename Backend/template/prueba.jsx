

import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/RegisterUsers.css';
import logo from '../assets/logoo.png';

function RegisterUser() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    username: '',
    email: '',
    password: '',
    role: '',
    empresaId: '',
    createdAt: '',
    token: '', // Agregar campo para el token
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Obtener el token desde el almacenamiento local
    const token = localStorage.getItem('authToken');

    axios.post('http://localhost:5000/api/usuarios/crear-usuario', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera Authorization
      }
    })
      .then(response => {
        console.log('Usuario creado exitosamente', response.data);
        // Suponiendo que el backend devuelve un token
        setFormData({
          nombre: '',
          apellidos: '',
          username: '',
          email: '',
          password: '',
          role: '',
          empresaId: '',
          createdAt: '',
          token: response.data.token, // Guardar el token
        });

        // Puedes almacenar el token en localStorage para su uso posterior
        localStorage.setItem('authToken', response.data.token);
      })
      .catch(err => {
        console.error('Error al crear el usuario', err);
      });
  };

  return (
    <div className="register-containerw">
      <div className="form-containerw">
        <img src={logo} alt="Logo" className="form-logowI" />
        <h3 className='hreg'>Creación de cuentas de usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group-half-leftt">
              <label className='labelnombre' htmlFor="nombre"><FaUser /> Nombre</label>
              <input type="text" name="nombre" id="nombre" placeholder="Digite el nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="input-group-half-rightt">
              <label className='ape' htmlFor="apellidos"><FaUser /> Apellidos</label>
              <input type="text" name="apellidos" id="apellidos" placeholder="Digite el apellidos" value={formData.apellidos} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group-half-leftt">
              <label className='user' htmlFor="username"><FaIdBadge /> Nombre de Usuario</label>
              <input type="text" name="username" id="username" placeholder="Digite el usuario" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="input-group-half-rightt">
              <label className="c" htmlFor="email"><FaEnvelope /> Correo Electrónico</label>
              <input type="email" name="email" id="email" placeholder="Digite el correo electrónico" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group-half-leftt">
              <label className='he' htmlFor="password"><FaLock /> Contraseña</label>
              <input type="password" name="password" id="password" placeholder="Digite la contraseña" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="input-group-half-leftt">
              <label className='v' htmlFor="password"><FaLock /> Repetir contraseña</label>
              <input className='in' type="password" name="password" id="password" placeholder="Repita la Contraseña" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group-half-rightt">
              <label className='t' htmlFor="role"><FaUser /> Rol</label>
              <select name="role" id="role" value={formData.role} onChange={handleChange} required>
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
          </div>

          <button type="button" className="submit-buttonwr">Cancelar</button>
          <button type="submit" className="submit-buttonwr">Crear</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;

