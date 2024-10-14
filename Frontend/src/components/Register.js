import React, { useState } from 'react';
import '../Css/App.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente'); // Valor por defecto

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre,
      apellido,
      email,
      password,
      tipo_usuario: tipoUsuario,
    };

    try {
      const response = await fetch(
        'http://localhost/mitversa-proyecto-web/Backendphp/usuario.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      const text = await response.text();
      console.log('Respuesta del servidor:', text); // Revisa si el texto está vacío

      if (text) {
        try {
          const result = JSON.parse(text); // Intenta parsear la respuesta si no está vacía
          if (result.message) {
            alert(result.message);
          } else {
            alert('Registro completado correctamente.');
            // Vaciar campos después de registro exitoso
            setNombre('');
            setApellido('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTipoUsuario('cliente'); // Restablece a valor por defecto
          }
        } catch (error) {
          console.error('Respuesta no es JSON válido:', error, text);
          alert('Hubo un problema al procesar la respuesta del servidor.');
        }
      } else {
        alert('El servidor no devolvió una respuesta válida.');
      }
    } catch (error) {
      console.error('Hubo un problema con la solicitud fetch:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="register-form">
      <div className="register-container">
        <h2>Regístrate</h2>
        <form onSubmit={handleRegister}>
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
          <div>
            <label>Confirmar Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
