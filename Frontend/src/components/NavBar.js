import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Assets/Mitversalogo2_pe.png';
import iconoprofile from '../Assets/default-profile.jpg';
import '../Css/NavBar.css';
import '../Css/App.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Revisamos el sessionStorage al cargar el componente
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    // Elimina la sesión de sessionStorage y actualiza el estado
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); // Redirige a la página principal tras cerrar sesión
  };

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
        {isLoggedIn ? (
          <button className="primary-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <Link to="/Login">
            <button className="primary-button">Inicia sesión</button>
          </Link>
        )}

        {/* Dropdown para ProfilePage */}
        <div className="dropdown">
          <Link to="/profilepage" className="dropbtn">
            <img
              src={iconoprofile}
              alt="iconoprofile"
              className="icono-profile"
            />
          </Link>
          <div className="dropdown-content">
            <Link to="/profilepage">Ver perfil</Link>
            <Link to="/GestionEnv">Gestionar envíos</Link>
            <Link to="/GestionUser">Gestionar usuarios</Link>
            <Link to="/GestionVeh">Gestionar vehículos</Link>
            <Link to="/VisualizarPaquete">Visualizar Paquete</Link>
            <Link to="/EstadoPaquete">Estado Paquete</Link>
            <Link to="/ReportsPage">Informes</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
