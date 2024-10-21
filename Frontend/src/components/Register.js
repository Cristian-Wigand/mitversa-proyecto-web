import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Login.css';
import '../App.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coinciden
    if (password !== confirmpassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre,
      apellido,
      email,
      password,
      tipo_usuario: tipoUsuario,
      usuario_creado_el: new Date().toISOString(),
      usuario_actualizado_el: null, // Establecer como null al crear el usuario
    };

    try {
      const response = await fetch(
        'https://mitversa.christianferrer.me/api/usuarios/', // Cambia por la URL correcta de la API
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Registro completado correctamente.');
        // Limpiar los campos después del registro exitoso
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
        setConfirmpassword('');
        setTipoUsuario('cliente');
      } else {
        alert(data.message || 'Error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Hubo un problema con la solicitud:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Regístrate</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirmar contraseña:</label>
            <input
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Tipo de Usuario:</label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="gerente">Gerente</option>
              <option value="repartidor">Repartidor</option>
            </select>
          </div>
          <button className="auth-button" type="submit">
            Registrarse
          </button>
        </form>
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesion aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
