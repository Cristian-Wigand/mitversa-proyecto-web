import React, { useState, useEffect } from 'react';
import '../App.css';
import perfildefault from '../Assets/default-profile.jpg';
import backgroundperfil from '../Assets/backgroundperfil.png';

const ProfilePage = () => {
  const [activeForm, setActiveForm] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apellido, setApellido] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Carga los datos del usuario del sessionStorage al montar el componente
  useEffect(() => {
    const storedName = sessionStorage.getItem('nombreUsuario');
    const storedEmail = sessionStorage.getItem('emailUsuario');
    const storedApellido = sessionStorage.getItem('apellidoUsuario');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedApellido) setApellido(storedApellido);
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setActiveForm(null); // Cierra el formulario

    const userId = sessionStorage.getItem('userId');
    const tipo = sessionStorage.getItem('tipoUsuario');
    const UsuarioCreado = sessionStorage.getItem('FechaCreacion');

    const currentUserData = {
      nombre: newName || name,
      apellido: apellido,
      email: email,
      tipo_usuario: tipo,
      usuario_creado_el: UsuarioCreado || "2024-10-21T07:29:56Z",
      password: currentPassword || '',
    };

    try {
      const response = await fetch(`https://mitversa.christianferrer.me/api/usuarios/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentUserData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setName(updatedUser.nombre);
        alert('Nombre actualizado con éxito.');
        sessionStorage.setItem('nombreUsuario', updatedUser.nombre);
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar el nombre:', errorData);
        alert(`Error al actualizar el nombre: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setActiveForm(null); // Cierra el formulario

    const userId = sessionStorage.getItem('userId');
    const tipo = sessionStorage.getItem('tipoUsuario');
    const UsuarioCreado = sessionStorage.getItem('FechaCreacion');

    const currentUserData = {
      nombre: name,
      apellido: apellido,
      email: newEmail || email,
      tipo_usuario: tipo,
      usuario_creado_el: UsuarioCreado || "2024-10-21T07:29:56Z",
      password: currentPassword || '',
    };

    try {
      const response = await fetch(`https://mitversa.christianferrer.me/api/usuarios/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentUserData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setEmail(updatedUser.email);
        alert('Correo actualizado con éxito.');
        sessionStorage.setItem('emailUsuario', updatedUser.email);
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar el correo:', errorData);
        alert(`Error al actualizar el correo: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setActiveForm(null); // Cierra el formulario

    if (newPassword !== confirmNewPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const tipo = sessionStorage.getItem('tipoUsuario');
    const UsuarioCreado = sessionStorage.getItem('FechaCreacion');

    const currentUserData = {
      nombre: name,
      apellido: apellido,
      email: email,
      tipo_usuario: tipo,
      usuario_creado_el: UsuarioCreado || "2024-10-21T07:29:56Z",
      password: newPassword || currentPassword,
    };

    try {
      const response = await fetch(`https://mitversa.christianferrer.me/api/usuarios/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentUserData),
      });

      if (response.ok) {
        alert('Contraseña actualizada con éxito.');
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar la contraseña:', errorData);
        alert(`Error al actualizar la contraseña: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleForm = (form) => {
    setActiveForm(activeForm === form ? null : form);
  };

  const discardChanges = () => {
    setActiveForm(null); // Cierra el formulario sin guardar cambios
    setCurrentPassword('');
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="perfil-background-container">
          <img src={backgroundperfil} alt="" />
        </div>

        {/* Primer Rectángulo: Nombre */}
        <div className="profile-box">
          <div className="profile-pic-name">
            <img src={perfildefault} alt="Profile" className="profile-pic" />
            <h2 className="profile-name">{name} {apellido}</h2>
          </div>
          <div className="update-option">
            <button className="update-button" onClick={() => toggleForm('name')}>Actualizar nombre</button>
            {activeForm === 'name' && (
              <form className="update-form" onSubmit={handleUpdateName}>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nuevo nombre"
                  required
                />
                <button type="submit" className="submit-button">Guardar</button>
                <button type="button" className="discard-button" onClick={discardChanges}>Descartar</button>
              </form>
            )}
          </div>
        </div>

        {/* Segundo Rectángulo: Correo y Contraseña */}
        <div className="profile-box">
          <div className="profile-detail">
            <p><strong>Correo: </strong>{email}</p>
            <button className="update-button" onClick={() => toggleForm('email')}>Actualizar correo</button>
            {activeForm === 'email' && (
              <form className="update-form" onSubmit={handleUpdateEmail}>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Nuevo correo"
                  required
                />
                <button type="submit" className="submit-button">Guardar</button>
                <button type="button" className="discard-button" onClick={discardChanges}>Descartar</button>
              </form>
            )}
          </div>
          <div className="profile-detail">
            <p><strong>Contraseña: </strong>*********</p>
            <button className="update-button" onClick={() => toggleForm('password')}>Actualizar contraseña</button>
            {activeForm === 'password' && (
              <form className="update-form" onSubmit={handleUpdatePassword}>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <button type="submit" className="submit-button">Guardar</button>
                <button type="button" className="discard-button" onClick={discardChanges}>Descartar</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
