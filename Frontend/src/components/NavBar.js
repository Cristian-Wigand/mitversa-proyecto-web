import React from 'react';
import Logo from '../Assets/Mitversalogo2_pe.png';
import { Link } from 'react-router-dom';
import '../Css/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar-container">
      {/* Lado izquierdo (25%) */}
      <div className="navbar-left">
        <img src={Logo} alt="Logo de la empresa" />
      </div>
      {/* Lado derecho (75%) */}
      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/about">Sobre nosotros</Link>
        <Link to="/contact">Contáctanos</Link>
        <Link to="/auth">
          <button className="primary-button">Inicia sesión</button>
        </Link>
        <Link to="/profilepage">icono</Link>
      </div>
    </nav>
  );
};

export default NavBar;
