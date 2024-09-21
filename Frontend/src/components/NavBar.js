import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Aquí puedes añadir estilos específicos

const NavBar = () => {
  return (
    <nav className="navbar">
      <img src="/IMG/Logo.png" alt="Logo" className="logo" />{' '}
      {/* Ruta a la imagen */}
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/about">Sobre nosotros</Link>
        <Link to="/contact">Contáctanos</Link>
        <Link to="/login">Iniciar sesión / Registrarse</Link>
        <Link to="/envio">FormularioEnvio</Link>
      </div>
    </nav>
  );
};

export default NavBar;
