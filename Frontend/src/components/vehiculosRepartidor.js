import React, { useState, useEffect } from 'react';
import '../Css/UserManagementPage.css';
import '../App.css';
import { throttle } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conexiones from './conexiones';

const conexiones = Conexiones();

const VehiculosRepartidor = () => {
  const [searchType, setSearchType] = useState('vehiculo'); // Tipo de búsqueda
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [vehiculosDatos, setVehiculos] = useState([]);
  const [vehiculoss, setVehiculo] = useState([]);
  const [asignacionn, setAsignacionn] = useState([]);
  const [historialAsignacion, setHistorialAsignacion] = useState([]);
  const [searchListU, setSearchListU] = useState([]);
  const [searchListA, setSearchListA] = useState([]);
  const [menuTop, setMenuTop] = useState(150);
  const [idUsuario, setIdUsuario] = useState('');
  const navigate = useNavigate();

  const [searchVehiculo, setSearchVehiculo] = useState({
    id_vehiculo: '',
    matricula: '',
    marca: '',
    modelo: '',
    estado: '',
    vehiculo_creado_el: '',
    vehiculo_actualizado_el: '',
  });

  const [searchAsignacion, setSearchAsignacion] = useState({
    id_historial: '',
    id_vehiculo: '',
    fecha_asignacion: '',
    fecha_devolucion: '',
    kilometraje_inicial: '',
    kilometraje_final: '',
  });

  // Validación inicial del tipo de usuario
  useEffect(() => {
    const tipoUsuario = sessionStorage.getItem('tipoUsuario');
    if (tipoUsuario !== 'repartidor') {
      navigate('/');
    }
    setIdUsuario(sessionStorage.getItem('userId'));
  }, [navigate]);

  // Manejo del menú flotante al desplazarse
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      setMenuTop(scrollY <= 150 ? 150 : scrollY);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiculoRespuesta = await conexiones.traer_todo('Vehiculo');
        const asignacionRespuesta = await conexiones.traer_todo('Asignacion');

        if (!vehiculoRespuesta[0] || !asignacionRespuesta[0]) {
          return alert('Error al cargar los datos');
        }

        setVehiculos(vehiculoRespuesta[1]);
        setHistorialAsignacion(asignacionRespuesta[1]);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, []);

  // Actualizar el tipo de búsqueda
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSelectedOption('');
    setSelectedOption2('');
  };

  // Manejar cambios en los inputs de búsqueda
  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;

    // Validar campos numéricos o permitir vacío
    if (['id_vehiculo', 'id_historial'].includes(name) && value !== '') {
      if (!Number(value)) return; // Permitir solo números
    }

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Procesar búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();

    // Filtrar asignaciones únicas por repartidor
    const vehiculosIds = [
      ...new Set(
        historialAsignacion
          .filter((item) => Number(item.id_repartidor) === Number(idUsuario))
          .map((item) => item.id_vehiculo)
      ),
    ];

    const objetosFiltrados = vehiculosDatos.filter((obj) =>
      vehiculosIds.includes(obj.id_vehiculo)
    );

    setVehiculo(objetosFiltrados);

    if (selectedOption === 'todos' || selectedOption2==='todos') {
      if (searchType === 'vehiculo') {
        setSearchListU(objetosFiltrados);
        resetSearchVehiculo();
      } else {
        setSearchListA(historialAsignacion);
        resetSearchAsignacion();
      }
      return;
    }
    const vehiculosUnicos = new Set();
    const asignacionesFiltradas = historialAsignacion.filter(asignacion => {
        if (
          asignacion.id_repartidor === idUsuario &&
          !vehiculosUnicos.has(asignacion.id_vehiculo)
        ) {
          vehiculosUnicos.add(asignacion.id_vehiculo);
          return true;
        }
        return false;
      });
    setAsignacionn(asignacionesFiltradas)

    // Filtrar resultados según tipo y criterio seleccionado
    const searchParams = searchType === 'vehiculo' ? searchVehiculo : searchAsignacion;
    const resultado = await conexiones.fetchSearch3(
      searchType === 'vehiculo' ? 'Vehiculo' : 'Asignacion',
      { [selectedOption || selectedOption2]: searchParams[selectedOption || selectedOption2] },
      searchType === 'vehiculo' ? vehiculosDatos : historialAsignacion,searchType === 'vehiculo' ? vehiculoss : asignacionn
    );

    if (resultado[0]) {
      searchType === 'vehiculo'
        ? setSearchListU(resultado[1])
        : setSearchListA(resultado[1]);
    } else {
      searchType === 'vehiculo'
        ? setSearchListU([])
        : setSearchListA([]);
    }
  };

  // Reset de campos de búsqueda
  const resetSearchVehiculo = () =>
    setSearchVehiculo({
      id_vehiculo: '',
      matricula: '',
      marca: '',
      modelo: '',
      estado: '',
      vehiculo_creado_el: '',
      vehiculo_actualizado_el: '',
    });

  const resetSearchAsignacion = () =>
    setSearchAsignacion({
      id_historial: '',
      id_vehiculo: '',
      fecha_asignacion: '',
      fecha_devolucion: '',
      kilometraje_inicial: '',
      kilometraje_final: '',
    });

  // Convertir fecha UTC a formato local
  const convertirFecha = (fechaUTC) => {
    const date = new Date(fechaUTC);
    const offsetChile = 3;
    date.setHours(date.getHours() + offsetChile);

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

      {/* Formulario de búsqueda */}
      <form className="form" onSubmit={handleSearch} id="buscar_usuario">
        <h2>Buscador</h2>
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="select-margin"
        >
          <option value="vehiculo">Vehiculo</option>
          <option value="asignacion">Asignacion</option>
        </select>

        {searchType === 'vehiculo' ? (
          <>
            <select
              className="select-margin"
              onChange={(e) => setSelectedOption(e.target.value)}
              value={selectedOption}
            >
              <option value="">Selecciona un criterio</option>
              <option value="todos">Todos</option>
              <option value="id_vehiculo">ID Vehiculo</option>
              <option value="matricula">Matricula</option>
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
            </select>
            {selectedOption !== 'todos' && (
              <input
                type={selectedOption === 'id_vehiculo' ? 'number' : 'text'}
                name={selectedOption}
                value={searchVehiculo[selectedOption] || ''}
                onChange={(e) => handleInputChange(e, setSearchVehiculo)}
              />
            )}
          </>
        ) : (
          <>
            <select
              className="select-margin"
              onChange={(e) => setSelectedOption2(e.target.value)}
              value={selectedOption2}
            >
              <option value="">Selecciona un criterio</option>
              <option value="todos">Todos</option>
              <option value="id_historial">ID Historial</option>
              <option value="id_vehiculo">ID Vehiculo</option>
            </select>
            {selectedOption2 !== 'todos' && (
              <input
                type={selectedOption2 === 'id_historial' ? 'number' : 'text'}
                name={selectedOption2}
                value={searchAsignacion[selectedOption2] || ''}
                onChange={(e) => handleInputChange(e, setSearchAsignacion)}
              />
            )}
          </>
        )}
        <button type="submit">Buscar</button>
      </form>

     {/* Resultados */}
<Table striped bordered hover>
  <thead>
    {searchType === 'vehiculo' ? (
      <tr>
        <th>ID</th>
        <th>Matrícula</th>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Estado</th>
        <th>Fecha Creación</th>
        <th>Última Actualización</th>
        <th>Acciones</th> {/* Columna de Acciones */}
      </tr>
    ) : (
      <tr>
        <th>ID Historial</th>
        <th>ID Vehículo</th>
        <th>Fecha Asignación</th>
        <th>Fecha Devolución</th>
        <th>Kilometraje Inicial</th>
        <th>Kilometraje Final</th>
        <th>Acciones</th> {/* Columna de Acciones */}
      </tr>
    )}
  </thead>
  <tbody>
    {searchType === 'vehiculo'
      ? searchListU.map((item) => (
          <tr key={item.id_vehiculo}>
            <td>{item.id_vehiculo}</td>
            <td>{item.matricula}</td>
            <td>{item.marca}</td>
            <td>{item.modelo}</td>
            <td>{item.estado}</td>
            <td>{convertirFecha(item.vehiculo_creado_el)}</td>
            <td>{convertirFecha(item.vehiculo_actualizado_el)}</td>
            <td>
              <button onClick={() => handleUpdateVehiculo(item.id_vehiculo)}>
                Actualizar
              </button>
            </td>
          </tr>
        ))
      : searchListA.map((item) => (
          <tr key={item.id_historial}>
            <td>{item.id_historial}</td>
            <td>{item.id_vehiculo}</td>
            <td>{convertirFecha(item.fecha_asignacion)}</td>
            <td>{convertirFecha(item.fecha_devolucion)}</td>
            <td>{item.kilometraje_inicial}</td>
            <td>{item.kilometraje_final}</td>
            <td>
              <button onClick={() => handleUpdateAsignacion(item.id_historial)}>
                Actualizar
              </button>
            </td>
          </tr>
        ))}
  </tbody>
</Table>


    </div>
  );
};

export default VehiculosRepartidor;
