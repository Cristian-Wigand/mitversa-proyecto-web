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

        {/* Dropdown para ProfilePage */}
        <div className="dropdown">
          <Link to="/profilepage" className="dropbtn">
            Icono
          </Link>
          <div className="dropdown-content">
            <Link to="/profilepage">Ver perfil</Link>
            <Link to="/GestionEnv">Gestionar envios</Link>
            <Link to="/GestionUser">Gestionar usuarios</Link>
            <Link to="/GestionVeh">Gestionar vehiculos</Link>
            <Link to="/logout">Cerrar sesión</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
