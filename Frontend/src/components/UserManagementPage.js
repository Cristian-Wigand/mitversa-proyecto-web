import React, { useState, useEffect } from 'react';
import '../Css/UserManagementPage.css';
import '../App.css';
import { throttle } from 'lodash';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conexiones from './conexiones';
const conexiones = Conexiones();

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); // Direccion Almacena solo el criterio seleccionado
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
  const [searchListU, setsearchListU] = useState([]);
  const [menuTop, setMenuTop] = useState(150);

  const [searchUsuario, setSearchUsuario] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    tipo_usuario: '',
    usuario_creado_el: '',
    usuario_actualizado_el: '',
  });
  const [searchUsuario2, setSearchUsuario2] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    tipo_usuario: '',
    usuario_creado_el: '',
    usuario_actualizado_el: '',
  });

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      setMenuTop(scrollY <= 150 ? 150 : scrollY);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const SearchUsuario = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (name === 'id_usuario') {
      if (value === '' || Number(value) > 0) {
        setSearchUsuario((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setSearchUsuario({
        ...searchUsuario,
        [e.target.name]: e.target.value,
      });
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
      usuario_creado_el: '',
      usuario_actualizado_el: null,
    };
    const resultado = conexiones.SubmitCreate('Usuario', userData);
    if (resultado) {
      setCreateUserData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmpassword: '',
      }); // Limpiar campos
      setTipoUsuario('cliente'); // Restablecer el tipo de usuario
    }
  };
  const SelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const SubmitSearch = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    const resultado = await conexiones.fetchSearch('Usuario', {
      [selectedOption]: searchUsuario[selectedOption],
    });
    if (resultado[0]) {
      setsearchListU(resultado[1]);
      setSearchUsuario2({
        id_usuario: searchUsuario.id_usuario,
        nombre: searchUsuario.nombre,
        apellido: searchUsuario.apellido,
        email: searchUsuario.email,
        tipo_usuario: searchUsuario.tipo_usuario,
        usuario_creado_el: searchUsuario.usuario_creado_el,
        usuario_actualizado_el: searchUsuario.usuario_actualizado_el,
      });
      setSearchUsuario({
        id_usuario: '',
        nombre: '',
        apellido: '',
        email: '',
        tipo_usuario: '',
        usuario_creado_el: '',
        usuario_actualizado_el: '',
      });
    } else {
      setsearchListU([]);
    }
  };

  const handleDeleteUser = async (userId) => {
    const resultado = conexiones.Delete('Usuario', userId);
    if (resultado) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id_usuario !== userId),
      ); // Actualiza la lista de usuarios
      setSearchResult(null); // Limpiar el resultado de búsqueda
    }
  };
  const handleUpdateUser = async (usuario) => {
    const nombre =
      prompt('Ingrese el nuevo nombre:', usuario.nombre) || usuario.nombre;
    const apellido =
      prompt('Ingrese el nuevo apellido:', usuario.apellido) ||
      usuario.apellido;
    const email =
      prompt('Ingrese el nuevo correo:', usuario.email) || usuario.email;

    if (
      nombre === usuario.nombre &&
      apellido === usuario.apellido &&
      email === usuario.email
    ) {
      return false;
    }
    const cambio = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      usuario_actualizado_el: '',
    };
    const resultado = await conexiones.updateObject(
      'Usuario',
      usuario.id_usuario,
      cambio,
    );
    if (resultado) {
      const resultado2 = await conexiones.fetchSearch('Usuario', {
        [selectedOption]: searchUsuario2[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListU(resultado2[1]);
      } else {
        setsearchListU([]);
      }
    }
  };

  const convertir_fecha = (fechaUTC) => {
    const date = new Date(fechaUTC);

    // Ajustar manualmente a UTC-3 para Chile (sumando 3 horas)
    const offsetChile = 3; // UTC-3 para horario de Chile
    date.setHours(date.getHours() + offsetChile);

    // Formatear la fecha
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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
      {/* Buscar */}
      <>
        <form className="form" onSubmit={SubmitSearch} id="buscar_usuario">
          <h2>Buscador</h2>
          <>
            <select
              className="select-margin"
              name="criterioBusqueda"
              onChange={SelectChange}
              value={selectedOption}
            >
              <option value="">Selecciona un criterio</option>
              <option value="id_usuario">ID Usuario</option>
              <option value="nombre">Nombre</option>
              <option value="apellido">Apellido</option>
              <option value="email">Email</option>
              <option value="tipo_usuario">Tipo de usuario</option>
              <option value="usuario_creado_el">
                Fecha de creación de Usuario
              </option>
              <option value="usuario_actualizado_el">
                Última fecha de actualización de Usuario
              </option>
            </select>
            {selectedOption === 'tipo_usuario' ? (
              <select
                className="select-margin"
                value={searchUsuario[selectedOption] || ''}
                onChange={SearchUsuario}
                name={selectedOption}
              >
                <option value="cliente">Cliente</option>
                <option value="gerente">Gerente</option>
                <option value="repartidor">Repartidor</option>
              </select>
            ) : (
              <input
                type={
                  selectedOption === 'usuario_creado_el' ||
                  selectedOption === 'usuario_actualizado_el'
                    ? 'date'
                    : selectedOption === 'id_usuario'
                      ? 'number'
                      : 'string'
                }
                min={selectedOption === 'id_usuario' ? '1' : undefined}
                step={selectedOption === 'id_usuario' ? '1' : undefined}
                name={selectedOption}
                placeholder={`Ingresa ${selectedOption}`}
                value={searchUsuario[selectedOption] || ''}
                onChange={SearchUsuario}
                disabled={!selectedOption}
                required
              />
            )}
          </>
          <button type="submit">Buscar</button>
        </form>
        <>
          {searchListU.length > 0 ? (
            <>
              <h2>Resultados de la Búsqueda de Usuarios:</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID Usuario</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Tipo de usuario</th>
                    <th>Usuario creado el</th>
                    <th>Usuario actualizado el</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {searchListU.map((usuario, index) => (
                    <tr key={index}>
                      <td>{usuario.id_usuario}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellido}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.tipo_usuario}</td>
                      <td>
                        {usuario.usuario_creado_el
                          ? convertir_fecha(usuario.usuario_creado_el)
                          : 'null'}
                      </td>
                      <td>
                        {usuario.usuario_actualizado_el
                          ? convertir_fecha(usuario.usuario_actualizado_el)
                          : 'null'}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                '¿Estás seguro de que deseas eliminar este usuario?',
                              )
                            ) {
                              handleDeleteUser(usuario.id_usuario);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdateUser(usuario)}
                        >
                          Actualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <p>No se encontraron usuarios.</p>
          )}
        </>
      </>

      {/* Crear Usuario */}
      <form
        className="form"
        onSubmit={handleSubmitCreateUser}
        id="crear_usuario"
      >
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
