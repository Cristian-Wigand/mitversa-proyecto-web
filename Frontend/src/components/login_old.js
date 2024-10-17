import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    //Define una función asíncrona llamada handleLogin que se ejecutará cuando el formulario de inicio de sesión sea enviado. Esta función usa async para poder manejar promesas con await.
    e.preventDefault(); // Evita que el formulario se envíe y recargue la página automáticamente.
    setErrorMessage(''); // Resetea el mensaje de error antes de realizar el intento de inicio de sesión.

    // Datos de inicio de sesión
    const loginData = { email, password };

    try {
      // Realizamos la solicitud a la API proporcionada
      const response = await fetch(
        'https://mit.christianferrer.me/api/login', // URL de la api
        {
          method: 'POST', // Usamos el método POST para enviar los datos de login
          headers: {
            'Content-Type': 'application/json', // Indicamos que estamos enviando datos en formato JSON
          },
          body: JSON.stringify(loginData), // Enviamos los datos de login en formato JSON
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Inicio de sesión exitoso:', data);

        // Verificamos si el servidor devolvió un ID de usuario válido
        if (data.id_usuario || data.id_repartidor || data.id_gerente) {
          // Guarda que el usuario ha iniciado sesión en el sessionStorage
          sessionStorage.setItem('isLoggedIn', 'true');
        } else {
          // Si no hay un ID válido, marcamos como no logueado
          sessionStorage.setItem('isLoggedIn', 'false');
        }

        // Navegamos a la página principal después de iniciar sesión
        navigate('/');

        // Recargamos la página para reflejar los cambios en el estado del usuario
        window.location.reload();
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
    </div>
  );
};

export default Login;
