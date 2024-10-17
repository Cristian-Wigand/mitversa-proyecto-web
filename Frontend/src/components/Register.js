import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmcontraseña, setConfirmcontraseña] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario ya ha iniciado sesión
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      // Si hay una sesión iniciada, redirige a la página principal
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coinciden
    if (contraseña !== confirmcontraseña) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre,
      apellido,
      email,
      contraseña,
    };

    try {
      // Llamada a la API para registrar al usuario
      const response = await fetch(
        'https://mit.christianferrer.me/api/usuarios/', // Cambiar por la URL correcta de la API
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Datos del usuario
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Registro completado correctamente.');
        // Limpiar los campos después del registro exitoso
        setNombre('');
        setApellido('');
        setEmail('');
        setContraseña('');
        setConfirmcontraseña('');
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
              type="password" // Cambiado de 'contraseña' a 'password'
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirmar contraseña:</label>
            <input
              type="password" // Cambiado de 'contraseña' a 'password'
              value={confirmcontraseña}
              onChange={(e) => setConfirmcontraseña(e.target.value)}
              required
            />
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
