import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Assets/Mitversalogo2_pe.png';
import iconoprofile from '../Assets/default-profile.jpg';
import '../App.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const navigate = useNavigate();

  // Revisamos el sessionStorage al cargar el componente
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Obtener el tipo de usuario desde sessionStorage
    const tipo = sessionStorage.getItem('tipoUsuario');
    if (tipo) {
      setTipoUsuario(tipo);
    }
  }, []);

  const handleLogout = () => {
    // Elimina la sesión de sessionStorage y actualiza el estado
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('tipoUsuario');
    setIsLoggedIn(false);
    navigate('/'); // Redirige a la página principal tras cerrar sesión
  };

  const renderDropdown = () => {
    if (tipoUsuario === 'gerente') {
      return (
        <div className="dropdown-content">
          <Link to="/profilepage">Ver perfil</Link>
          <Link to="/GestionEnv">Gestionar envíos</Link>
          <Link to="/GestionUser">Gestionar Usuarios</Link>
          <Link to="/GestionVeh">Gestionar Vehículos</Link>
          <Link to="/ReportsPage">Informes</Link>
        </div>
      );
    } else if (tipoUsuario === 'repartidor') {
      return (
        <div className="dropdown-content">
          <Link to="/profilepage">Ver perfil</Link>
          <Link to="/VisualizarPaquete">Mis Paquetes</Link>
          <Link to="/VehiculosRepartidor">Mis Vehiculos</Link>
        </div>
      );
    } else if (tipoUsuario === 'cliente') {
      return (
        <div className="dropdown-content">
          <Link to="/profilepage">Ver perfil</Link>
          <Link to="/VisualizarPaqueteCliente">Mis paquetes</Link>
        </div>
      );
    } else {
      return null; // Si no hay tipo de usuario definido, no mostrar nada
    }
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
        {isLoggedIn && (
          <div className="dropdown">
            <Link to="/profilepage" className="dropbtn">
              <img
                src={iconoprofile}
                alt="iconoprofile"
                className="icono-profile"
              />
            </Link>
            {renderDropdown()}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
