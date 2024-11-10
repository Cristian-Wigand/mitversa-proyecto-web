import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { filter, throttle } from 'lodash';
import Conexiones from './conexiones';
import '../App.css';
const conexiones = Conexiones();

const GestionVeh = () => {
  const [searchType, setSearchType] = useState('Vehiculo'); // Estado para el tipo de búsqueda
  const [selectedOption, setSelectedOption] = useState(''); // Almacena solo el criterio seleccionado
  const [selectedOption2, setSelectedOption2] = useState(''); // Almacena solo el criterio seleccionado
  const [searchListV, setsearchListV] = useState([]);
  const [searchListA, setsearchListA] = useState([]);
  const [createVehicle, setCreateVehicle] = useState({
    matricula: '',
    marca: '',
    modelo: '',
    estado: 'disponible', // Valor por defecto
    vehiculo_creado_el: '',
    vehiculo_actualizado_el: null,
  });

  const [assignmentVehicle, setAssignmentVehicle] = useState({
    id_repartidor: '',
    id_vehiculo: '',
    fecha_asignacion: '',
    fecha_devolucion: null,
    kilometraje_inicial: '',
    kilometraje_final: null,
    motivo: '',
  });

  const [searchassignmentR, setSearchassignmentR] = useState({
    id_repartidor: '',
    id_vehiculo: '',
    fecha_asignacion: '',
    fecha_devolucion: '',
    kilometraje_inicial: '',
    kilometraje_final: '',
    motivo: '',
  });

  const [searchVehicle, setSearchVehicle] = useState({
    matricula: '',
    marca: '',
    modelo: '',
    estado: 'disponible',
    vehiculo_creado_el: '',
  });

  const [menuTop, setMenuTop] = useState(150);
  const navigate = useNavigate();

  const Scroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', Scroll);
    return () => window.removeEventListener('scroll', Scroll);
  }, []);

  useEffect(() => {
    // Descomentar si necesitas validar el rol del usuario
    const tipoUsuario = sessionStorage.getItem('tipoUsuario');
    if (tipoUsuario !== 'gerente') {
      navigate('/');
    }
  }, [navigate]);

  const SearchTypeChange = (e) => {
    setsearchListV('');
    setsearchListA('');
    setSelectedOption('');
    setSelectedOption2('');
    setSearchType(e.target.value);
  };

  const SubmitSearch = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    if (searchType == 'Vehiculo') {
      const resultado = await conexiones.fetchSearch('Vehiculo', {
        [selectedOption2]: searchVehicle[selectedOption2],
      });
      if (resultado[0]) {
        setsearchListV(resultado[1]);
      }
      setSearchVehicle({
        matricula: '',
        marca: '',
        modelo: '',
        estado: 'disponible',
        vehiculo_creado_el: '',
      });
      setSearchassignmentR({
        id_repartidor: '',
        id_vehiculo: '',
        fecha_asignacion: '',
        fecha_devolucion: '',
        kilometraje_inicial: '',
        kilometraje_final: '',
        motivo: '',
      });
    } else if (searchType == 'Asignacion') {
      const resultado2 = await conexiones.fetchSearch('Asignacion', {
        [selectedOption]: searchassignmentR[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListA(resultado2[1]);
      }
      setSearchVehicle({
        matricula: '',
        marca: '',
        modelo: '',
        estado: 'disponible',
        vehiculo_creado_el: '',
      });
      setSearchassignmentR({
        id_repartidor: '',
        id_vehiculo: '',
        fecha_asignacion: '',
        fecha_devolucion: '',
        kilometraje_inicial: '',
        kilometraje_final: '',
        motivo: '',
      });
    } else {
      alert('Problemas con searchType');
    }
  };

  const CreateVehicle = (e) =>
    setCreateVehicle({ ...createVehicle, [e.target.name]: e.target.value });

  const AssignmentVehicle = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (name === 'id_repartidor' || name === 'id_vehiculo') {
      if (value === '' || Number(value) > 0) {
        setAssignmentVehicle((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else if (name === 'kilometraje_inicial') {
      if (value === '' || Number(value) >= 0) {
        setAssignmentVehicle((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setAssignmentVehicle((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const SubmitCreateVehicle = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    const resultado = await conexiones.SubmitCreate('Vehiculo', createVehicle);
    console.log('resultado', resultado);
    if (resultado[0]) {
      setCreateVehicle({
        matricula: '',
        marca: '',
        modelo: '',
        estado: 'disponible', // Valor por defecto
        vehiculo_creado_el: '',
        vehiculo_actualizado_el: null,
      });
    }
  };

  const SubmitAssignmentVehicle = async (e) => {
    e.preventDefault();

    // Esperar a que se complete conexiones.fetchSearch
    const existeRepartidor = await conexiones.fetchSearch('Usuario', {
      id_usuario: assignmentVehicle['id_repartidor'],
      tipo_usuario: 'repartidor',
    });
    const existeVehiculo = await conexiones.fetchSearch('Vehiculo', {
      id_vehiculo: assignmentVehicle['id_vehiculo'],
      estado: 'disponible',
    });
    console.log('existeRepartidor:', existeRepartidor);
    console.log('Usuario', {
      id_usuario: assignmentVehicle['id_repartidor'],
      tipo_usuario: 'repartidor',
    });
    // Verifica si el repartidor existe antes de continuar
    if (!existeRepartidor[0]) {
      alert('El repartidor no existe');
      return; // Detener la ejecución si no existe
    }
    // Verifica si el vehiculo existe antes de continuar
    if (!existeVehiculo[0]) {
      alert('El vehiculo no existe o no esta disponible');
      return; // Detener la ejecución si no existe
    }

    const resultado = await conexiones.SubmitCreate(
      'Asignacion',
      assignmentVehicle,
    );
    // Verificar si la respuesta fue exitosa
    if (resultado[0]) {
      // Solo se ejecuta si la respuesta fue exitosa
      setAssignmentVehicle({
        id_repartidor: '',
        id_vehiculo: '',
        fecha_asignacion: '',
        fecha_devolucion: null,
        kilometraje_inicial: '',
        kilometraje_final: null,
        motivo: '',
      });
    }
    // Actualizar el estado del vehículo
    const cambio = { estado: 'no_disponible', vehiculo_actualizado_el: '' };
    await conexiones.updateObject(
      'Vehiculo',
      assignmentVehicle.id_vehiculo,
      cambio,
    );
  };

  const SelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const Select2Change = (e) => {
    setSelectedOption2(e.target.value);
  };

  const SearchVehicle = (e) => {
    setSearchVehicle({ ...searchVehicle, [e.target.name]: e.target.value });
  };

  const SearchassignmentR = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (name === 'id_repartidor' || name === 'id_vehiculo') {
      if (value === '' || Number(value) > 0) {
        setSearchassignmentR((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else if (name === 'kilometraje_inicial' || name === 'kilometraje_final') {
      if (value === '' || Number(value) >= 0) {
        setSearchassignmentR((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setSearchassignmentR({
        ...searchassignmentR,
        [e.target.name]: e.target.value,
      });
    }
  };

  const DeleteAssignment = async (userId) => {
    const resultado = conexiones.Delete('Asignacion', userId);
    if (resultado) {
      const resultado2 = await conexiones.fetchSearch('Asignacion', {
        [selectedOption]: searchassignmentR[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListA(resultado2[1]);
      }
    }
  };

  const DeleteVehicle = async (userId) => {
    const resultado = conexiones.Delete('Vehiculo', userId);
    if (resultado) {
      const resultado2 = await conexiones.fetchSearch('Vehiculo', {
        [selectedOption2]: searchVehicle[selectedOption2],
      });
      if (resultado2[0]) {
        setsearchListV(resultado2[1]);
      }
    }
  };

  return (
    <div>
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#crear_vehiculo">Crear vehículo</a>
          </li>
          <li>
            <a href="#Asignar_vehiculo">Asignar vehículo</a>
          </li>
          <li>
            <a href="#Buscador">Buscador</a>
          </li>
        </ul>
      </div>
      <div className="user-management-page">
        <h1>Gestión de Vehículos</h1>

        {/* Crear Vehículo */}
        <form
          className="form"
          onSubmit={SubmitCreateVehicle}
          id="crear_vehiculo"
        >
          <h2>Crear Vehículo</h2>
          <input
            type="text"
            name="matricula"
            placeholder="Matrícula"
            value={createVehicle.matricula}
            onChange={CreateVehicle}
            required
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={createVehicle.marca}
            onChange={CreateVehicle}
            required
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={createVehicle.modelo}
            onChange={CreateVehicle}
            required
          />
          <button type="submit">Crear Vehículo</button>
        </form>

        {/* Asignación de Vehículo */}
        <form
          className="form"
          onSubmit={SubmitAssignmentVehicle}
          id="Asignar_vehiculo"
        >
          <h2>Asignar Vehículo</h2>
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={assignmentVehicle.id_repartidor}
            onChange={AssignmentVehicle}
            required
            min="1"
            step="1"
          />
          <input
            type="number"
            name="id_vehiculo"
            placeholder="ID vehículo"
            value={assignmentVehicle.id_vehiculo}
            onChange={AssignmentVehicle}
            required
            min="1"
            step="1"
          />
          <input
            type="number"
            name="kilometraje_inicial"
            placeholder="Kilometraje inicial"
            value={assignmentVehicle.kilometraje_inicial}
            onChange={AssignmentVehicle}
            required
            min="0"
            step="0.01"
          />
          <input
            type="text"
            name="motivo"
            placeholder="Motivo"
            value={assignmentVehicle.motivo}
            onChange={AssignmentVehicle}
            required
          />
          <button type="submit">Asignar Vehículo</button>
        </form>

        {/* Buscar */}
        <form className="form" onSubmit={SubmitSearch} id="Buscador">
          <h2>Buscador</h2>
          <select value={searchType} onChange={SearchTypeChange}>
            <option value="Vehiculo">Vehiculo</option>
            <option value="Asignacion">Asignacion</option>
          </select>

          {searchType === 'Vehiculo' ? (
            <>
              <select
                name="criterioBusqueda"
                onChange={Select2Change}
                value={selectedOption2}
              >
                <option value="">Selecciona un criterio</option>
                <option value="matricula">Matrícula</option>
                <option value="marca">Marca</option>
                <option value="modelo">Modelo</option>
                <option value="estado">Estado</option>
                <option value="vehiculo_creado_el">Vehiculo creado el</option>
              </select>
              {selectedOption2 === 'estado' ? (
                <select
                  value={searchVehicle[selectedOption2] || ''}
                  onChange={SearchVehicle}
                  disabled={!selectedOption2}
                  name={selectedOption2}
                >
                  <option value="disponible">Disponible</option>
                  <option value="no_disponible">No Disponible</option>
                </select>
              ) : (
                <input
                  type={
                    selectedOption2 === 'vehiculo_creado_el' ? 'date' : 'text'
                  }
                  name={selectedOption2}
                  placeholder={`Ingresa ${selectedOption2}`}
                  value={searchVehicle[selectedOption2] || ''}
                  onChange={SearchVehicle}
                  disabled={!selectedOption2}
                />
              )}
            </>
          ) : (
            <>
              <select
                name="criterioBusqueda"
                onChange={SelectChange}
                value={selectedOption}
              >
                <option value="">Selecciona un criterio</option>
                <option value="id_repartidor">Id Repartidor</option>
                <option value="id_vehiculo">Id Vehiculo</option>
                <option value="fecha_asignacion">Fecha asignacion</option>
                <option value="fecha_devolucion">Fecha devolucion</option>
                <option value="kilometraje_inicial">Kilometraje Inicial</option>
                <option value="kilometraje_final">Kilometraje Final</option>
                <option value="motivo">Motivo</option>
              </select>
              <input
                type={
                  selectedOption === 'fecha_asignacion' ||
                  selectedOption === 'fecha_devolucion'
                    ? 'date'
                    : selectedOption === 'motivo'
                      ? 'text'
                      : 'number'
                }
                min={
                  selectedOption === 'motivo'
                    ? undefined
                    : selectedOption === 'id_repartidor' ||
                        selectedOption === 'id_vehiculo'
                      ? '1'
                      : '0'
                } // Permite solo números positivos
                step={
                  selectedOption === 'kilometraje_inicial' ||
                  selectedOption === 'kilometraje_final'
                    ? '0.01'
                    : selectedOption === 'id_repartidor' ||
                        selectedOption === 'id_vehiculo'
                      ? '1'
                      : undefined
                } // Permite decimales si es kilometraje
                name={selectedOption}
                placeholder={`Ingresa ${selectedOption}`}
                value={searchassignmentR[selectedOption] || ''}
                onChange={SearchassignmentR}
                disabled={!selectedOption}
              />
            </>
          )}
          <button type="submit">Buscar</button>
        </form>

        {/* Resultados de búsqueda */}
        <div>
          {searchType === 'Vehiculo' ? (
            <>
              {searchListV.length > 0 ? (
                searchListV.map((asignacion, index) => (
                  <div key={index} className="search-result">
                    <h2>Resultados de la Búsqueda de Vehículos:</h2>
                    <p>
                      <strong>ID Vehiculo:</strong> {asignacion.id_vehiculo}
                    </p>
                    <p>
                      <strong>Matricula:</strong> {asignacion.matricula}
                    </p>
                    <p>
                      <strong>Marca:</strong> {asignacion.marca}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {asignacion.modelo}
                    </p>
                    <p>
                      <strong>Estado:</strong> {asignacion.estado}
                    </p>
                    <p>
                      <strong>Vehiculo creado el:</strong>{' '}
                      {new Date(
                        asignacion.vehiculo_creado_el,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Vehiculo actualizado el:</strong>{' '}
                      {asignacion.vehiculo_actualizado_el
                        ? new Date(
                            asignacion.vehiculo_actualizado_el,
                          ).toLocaleDateString()
                        : 'null'}
                    </p>
                    <button
                      onClick={() => DeleteVehicle(asignacion.id_vehiculo)}
                    >
                      Eliminar Vehiculo
                    </button>
                  </div>
                ))
              ) : (
                <div className="search-result">
                  <p>No se encontraron vehiculos.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {searchListA.length > 0 ? (
                searchListA.map((asignacion, index) => (
                  <div key={index} className="search-result">
                    <h2>Resultados de la Búsqueda de Asignacion:</h2>
                    <p>
                      <strong>ID Historial:</strong> {asignacion.id_historial}
                    </p>
                    <p>
                      <strong>ID Repartidor:</strong> {asignacion.id_repartidor}
                    </p>
                    <p>
                      <strong>ID Vehículo:</strong> {asignacion.id_vehiculo}
                    </p>
                    <p>
                      <strong>Fecha de Asignación:</strong>{' '}
                      {asignacion.fecha_asignacion
                        ? new Date(
                            asignacion.fecha_asignacion,
                          ).toLocaleDateString()
                        : 'null'}
                    </p>
                    <p>
                      <strong>Fecha de Devolucion:</strong>{' '}
                      {asignacion.fecha_devolucion
                        ? new Date(
                            asignacion.fecha_devolucion,
                          ).toLocaleDateString()
                        : 'null'}
                    </p>
                    <p>
                      <strong>kilometraje inicial:</strong>{' '}
                      {asignacion.kilometraje_inicial}
                    </p>
                    <p>
                      <strong>kilometraje final:</strong>{' '}
                      {asignacion.kilometraje_final
                        ? asignacion.kilometraje_final
                        : 'null'}
                    </p>
                    <p>
                      <strong>Motivo:</strong>{' '}
                      {asignacion.motivo ? asignacion.motivo : 'null'}
                    </p>
                    <button
                      onClick={() => DeleteAssignment(asignacion.id_historial)}
                    >
                      Eliminar Asignacion
                    </button>
                  </div>
                ))
              ) : (
                <div className="search-result">
                  <p>No se encontraron asignaciones.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionVeh;
