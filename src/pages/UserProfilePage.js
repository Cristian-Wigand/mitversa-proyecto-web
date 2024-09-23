// src/pages/UserProfilePage.js

import React from 'react';

const UserProfilePage = () => {
  // Simulando datos de usuario; en una aplicación real, estos datos vendrían de un contexto, estado global o una API
    const user = {
        name: 'Javier Sanhueza',
        email: 'jsanhuesa2023@alu.uct.cl',
        bio: 'Desarrollador web entusiasta con pasión por la tecnología y la programación.',
    };

    return (
    <div className="profile-container">
        <h1>Perfil de Usuario</h1>
        <div className="profile-details">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Biografía:</strong> {user.bio}</p>
        </div>
    </div>
    );
};

export default UserProfilePage;
