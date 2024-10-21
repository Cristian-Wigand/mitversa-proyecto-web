import React, { useState, useEffect } from 'react';
import '../Css/UserManagementPage.css';
import '../App.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [createUserData, setCreateUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmpassword: '', // Añadir confirmación de contraseña
  });
  const [tipoUsuario, setTipoUsuario] = useState('cliente'); // Estado para el tipo de usuario
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers(); // Cargar la lista de usuarios al iniciar la página
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        'https://mitversa.christianferrer.me/api/usuarios/',
      );
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

    // Validar que las contraseñas coinciden
    if (createUserData.password !== createUserData.confirmpassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre: createUserData.nombre,
      apellido: createUserData.apellido,
      email: createUserData.email,
      password: createUserData.password,
      tipo_usuario: tipoUsuario,
      usuario_creado_el: new Date().toISOString(),
      usuario_actualizado_el: null, // Establecer como null al crear el usuario
    };

    try {
      const response = await fetch(
        'https://mitversa.christianferrer.me/api/usuarios/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      if (response.ok) {
        alert('Usuario creado exitosamente');
        fetchUsers(); // Volver a cargar la lista de usuarios
        setCreateUserData({
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          confirmpassword: '',
        }); // Limpiar campos
        setTipoUsuario('cliente'); // Restablecer el tipo de usuario
      } else {
        const data = await response.json();
        console.error(data); // Imprimir detalles del error
        setErrorMessage(data.message || 'Error al crear el usuario.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  const token = localStorage.getItem('token'); // O la forma que uses para almacenar tu token

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await fetch(
          `https://mitversa.christianferrer.me/api/usuarios/${userId}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Si estás usando autenticación
            },
          },
        );

        if (response.ok) {
          alert('Usuario eliminado exitosamente.');
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id_usuario !== userId),
          ); // Actualiza la lista de usuarios
          setSearchResult(null); // Limpiar el resultado de búsqueda
        } else {
          const errorData = await response.json();
          alert(
            `Error: ${errorData.detail || 'No se pudo eliminar el usuario.'}`,
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
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
          <p>
            <strong>Nombre:</strong> {searchResult.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {searchResult.apellido}
          </p>
          <p>
            <strong>Email:</strong> {searchResult.email}
          </p>
          <p>
            <strong>Tipo de usuario:</strong> {searchResult.tipo_usuario}
          </p>
          <button onClick={() => handleDeleteUser(searchResult.id_usuario)}>
            Eliminar Usuario
          </button>
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
          name="password"
          placeholder="Contraseña"
          value={createUserData.password}
          onChange={handleCreateUserChange}
          required
        />
        <input
          type="password"
          name="confirmpassword"
          placeholder="Confirmar Contraseña"
          value={createUserData.confirmpassword}
          onChange={handleCreateUserChange}
          required
        />
        <div>
          <label>Tipo de Usuario:</label>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="gerente">Gerente</option>
            <option value="repartidor">Repartidor</option>
          </select>
        </div>
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default UserManagementPage;
