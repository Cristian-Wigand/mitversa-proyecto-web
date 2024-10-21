import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const loginData = { email, password };

    try {
      const response = await fetch(
        'https://mitversa.christianferrer.me/api/login', // URL de la API de login
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Inicio de sesión exitoso:', data);

        // Verifica que los datos del usuario existen en la respuesta
        if (data.id_usuario || data.id_repartidor || data.id_gerente) {
          sessionStorage.setItem('isLoggedIn', 'true');

          // Almacena el nombre del usuario en sessionStorage
          sessionStorage.setItem('nombreUsuario', data.nombre);

          sessionStorage.setItem('apellidoUsuario', data.apellido);

          sessionStorage.setItem('emailUsuario', data.email); // Asegúrate de que 'data.email' exista en la respuesta

          sessionStorage.setItem('tipoUsuario', data.tipo_usuario);

          navigate('/');
          window.location.reload();
        } else {
          sessionStorage.setItem('isLoggedIn', 'false');
        }
      } else {
        setErrorMessage(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Error al comunicarse con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Inicia sesión</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
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
            <label>password:</label>
            <input
              type="password" // Corrige el tipo a 'password'
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-button" type="submit">
            Iniciar sesión
          </button>
        </form>
        <p>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
