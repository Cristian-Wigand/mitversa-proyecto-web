import React, { useState } from 'react';
import '../Css/UserManagementPage.css';
import '../Css/App.css';

const UserManagementPage = () => {
  const [createUserData, setCreateUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    tipoUsuario: '',
  });

  const [searchUserData, setSearchUserData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
  });

  const [deleteUserData, setDeleteUserData] = useState({
    id: '',
  });

  const handleCreateUserChange = (e) => {
    setCreateUserData({ ...createUserData, [e.target.name]: e.target.value });
  };

  const handleSearchUserChange = (e) => {
    setSearchUserData({ ...searchUserData, [e.target.name]: e.target.value });
  };

  const handleDeleteUserChange = (e) => {
    setDeleteUserData({ ...deleteUserData, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateUser = (e) => {
    e.preventDefault();
    console.log('Crear Usuario:', createUserData);
    // Aquí va la lógica para crear el usuario
  };

  const handleSubmitSearchUser = (e) => {
    e.preventDefault();
    console.log('Buscar Usuario:', searchUserData);
    // Aquí va la lógica para buscar el usuario
  };

  const handleSubmitDeleteUser = (e) => {
    e.preventDefault();
    console.log('Eliminar Usuario:', deleteUserData);
    // Aquí va la lógica para eliminar el usuario
  };

  return (
    <div className="user-management-page">
      <h1>Gestión de Usuarios</h1>

      {/* Crear Usuario */}
      <form className="form" onSubmit={handleSubmitCreateUser}>
        <h2>Crear Usuario</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={createUserData.nombre}
          onChange={handleCreateUserChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={createUserData.apellido}
          onChange={handleCreateUserChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={createUserData.email}
          onChange={handleCreateUserChange}
        />
        <input
          type="text"
          name="tipoUsuario"
          placeholder="Tipo de Usuario"
          value={createUserData.tipoUsuario}
          onChange={handleCreateUserChange}
        />
        <button type="submit">Crear Usuario</button>
      </form>

      {/* Buscar Usuario */}
      <form className="form" onSubmit={handleSubmitSearchUser}>
        <h2>Buscar Usuario</h2>
        <input
          type="text"
          name="id"
          placeholder="ID Usuario"
          value={searchUserData.id}
          onChange={handleSearchUserChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={searchUserData.nombre}
          onChange={handleSearchUserChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={searchUserData.apellido}
          onChange={handleSearchUserChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={searchUserData.email}
          onChange={handleSearchUserChange}
        />
        <button type="submit">Buscar Usuario</button>
      </form>

      {/* Eliminar Usuario */}
      <form className="form" onSubmit={handleSubmitDeleteUser}>
        <h2>Eliminar Usuario</h2>
        <input
          type="text"
          name="id"
          placeholder="ID Usuario"
          value={deleteUserData.id}
          onChange={handleDeleteUserChange}
        />
        <button type="submit">Eliminar Usuario</button>
      </form>
    </div>
  );
};

export default UserManagementPage;
