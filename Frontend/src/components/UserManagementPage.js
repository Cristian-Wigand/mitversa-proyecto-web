import React, { useState, useEffect } from 'react';
import '../Css/UserManagementPage.css';
import '../App.css';
import { throttle } from 'lodash';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [createUserData, setCreateUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [errorMessage, setErrorMessage] = useState('');
  const [menuTop, setMenuTop] = useState(150);

  useEffect(() => {
    fetchUsers();
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      setMenuTop(scrollY <= 150 ? 150 : scrollY);
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://mitversa.christianferrer.me/api/usuarios/');
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
      setErrorMessage('');
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
      usuario_actualizado_el: null,
    };

    try {
      const response = await fetch('https://mitversa.christianferrer.me/api/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        fetchUsers();
        setCreateUserData({
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          confirmpassword: '',
        });
        setTipoUsuario('cliente');
      } else {
        const data = await response.json();
        console.error(data);
        setErrorMessage(data.message || 'Error al crear el usuario.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await fetch(`https://mitversa.christianferrer.me/api/usuarios/${userId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Usuario eliminado exitosamente.');
          setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== userId));
          setSearchResult(null);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || 'No se pudo eliminar el usuario.'}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="user-management-page">
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#buscar_usuario">Buscar Usuario</a>
          </li>
          <li>
            <a href="#crear_usuario">Crear Usuario</a>
          </li>
        </ul>
      </div>
      <h1>Gestión de Usuarios</h1>

      {/* Buscador de usuario */}
      <form className="form" onSubmit={handleSearchSubmit} id="buscar_usuario">
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
      <form className="form" onSubmit={handleSubmitCreateUser} id="crear_usuario">
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
