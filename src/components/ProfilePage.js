import React from 'react';
import NavBar from './NavBar';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        {/* Primer Rectángulo: Nombre */}
        <div className="profile-box">
          <div className="profile-pic-name">
            <img src="/IMG/default-profile.jpg" alt="Profile" className="profile-pic" />
            <h2 className="profile-name">Nombre del Cliente</h2>
          </div>
          <div className="update-option">
            <button className="update-button">Actualizar nombre</button>
          </div>
        </div>

        {/* Segundo Rectángulo: Correo y Contraseña */}
        <div className="profile-box">
          <div className="profile-detail">
            <p><strong>Correo: </strong>cliente@correo.com</p>
            <button className="update-button">Actualizar correo</button>
          </div>
          <div className="profile-detail">
            <p><strong>Contraseña: </strong>*********</p>
            <button className="update-button">Actualizar contraseña</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
