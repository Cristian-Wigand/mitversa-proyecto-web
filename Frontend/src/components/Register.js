import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Login.css';
import '../App.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las passwords coinciden
    if (password !== confirmpassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre,
      apellido,
      email,
      password,
      tipo_usuario: tipoUsuario,
      usuario_creado_el: new Date().toISOString(),
      usuario_actualizado_el: new Date().toISOString(),
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
        setErrorMessage(data.message || 'Error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Hubo un problema con la solicitud:', error);
      setErrorMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Regístrate</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
      </div>
    </div>
  );
};

export default Register;
