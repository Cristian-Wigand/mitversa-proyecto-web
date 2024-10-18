import React, { useState } from 'react';
import '../App.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');

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

      if (text) {
        try {
          const result = JSON.parse(text);
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
            setTipoUsuario('cliente');
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
          <div>
            <label>Tipo de Usuario:</label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="gerente">Administrador</option>
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
