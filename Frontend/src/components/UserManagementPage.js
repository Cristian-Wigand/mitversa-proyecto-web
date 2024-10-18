import React, { useState, useEffect } from 'react';
import '../Css/UserManagementPage.css';
import '../Css/App.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [createUserData, setCreateUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers(); // Cargar la lista de usuarios al iniciar la página
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://mit.christianferrer.me/api/usuarios/');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setErrorMessage('Error al cargar los usuarios.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const user = users.find((user) => user.email === searchEmail);
    if (user) {
      setSearchResult(user);
      setErrorMessage(''); // Limpiar mensaje de error si se encuentra el usuario
    } else {
      setSearchResult(null);
      setErrorMessage('Usuario no encontrado.');
    }
  };

  const handleCreateUserChange = (e) => {
    setCreateUserData({ ...createUserData, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateUser = async (e) => {
    e.preventDefault();
    const userData = {
      nombre: createUserData.nombre,
      apellido: createUserData.apellido,
      email: createUserData.email,
    };

    try {
      const response = await fetch('https://mit.christianferrer.me/api/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        fetchUsers(); // Volver a cargar la lista de usuarios
        setCreateUserData({
          nombre: '',
          apellido: '',
          email: '',
          contraseña: '',
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Error al crear el usuario.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="user-management-page">
      <h1>Gestión de Usuarios</h1>

      {/* Buscador de usuario */}
      <form className="form" onSubmit={handleSearchSubmit}>
        <h2>Buscar Usuario por Email</h2>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={searchEmail}
          onChange={handleSearchChange}
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {searchResult && (
        <div className="search-result">
          <h2>Resultados de la Búsqueda:</h2>
          <p><strong>Nombre:</strong> {searchResult.nombre}</p>
          <p><strong>Apellido:</strong> {searchResult.apellido}</p>
          <p><strong>Email:</strong> {searchResult.email}</p>
        </div>
      )}

      {/* Crear Usuario */}
      <form className="form" onSubmit={handleSubmitCreateUser}>
        <h2>Crear Usuario</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={createUserData.nombre}
          onChange={handleCreateUserChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={createUserData.apellido}
          onChange={handleCreateUserChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={createUserData.email}
          onChange={handleCreateUserChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={createUserData.contraseña}
          onChange={handleCreateUserChange}
          required
        />
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default UserManagementPage;
