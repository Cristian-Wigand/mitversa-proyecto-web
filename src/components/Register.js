
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí puedes agregar la lógica para manejar el registro
    console.log('Registering with', email, password);
  };

  return (
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
        <button className="auth-button" type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;
