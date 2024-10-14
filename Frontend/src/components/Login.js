import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar mensajes de error previos

    try {
      const response = await fetch(
        'http://localhost/mitversa-proyecto-web/Backendphp/login.php',
        {
          // Cambia la URL según sea necesario
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Si el inicio de sesión es exitoso, puedes redirigir al usuario
        console.log('Inicio de sesión exitoso:', data.user);
        // Redirige a la página deseada
        navigate('/'); // Cambia a la ruta a la que deseas redirigir
      } else {
        // Si hay un error, muestra el mensaje
        setErrorMessage(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Error al comunicarse con el servidor');
    }
  };

  return (
    <div className="login-container">
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
  );
};

export default Login;
