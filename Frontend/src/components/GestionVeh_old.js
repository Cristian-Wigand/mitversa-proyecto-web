import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { throttle } from 'lodash';
import '../App.css';

const GestionVeh = () => {
  const [createVehicle, setCreateVehicle] = useState({
    matricula: '',
    marca: '',
    modelo: '',
  });

  const [assignmentVehicle, setAssignmentVehicle] = useState({
    idRepartidor: '',
    idVehicle: '',
    kilometrajeInicial: '',
    motivo: '',
  });

  const [searchHistory, setSearchHistory] = useState({
    idVehicle: '',
    idRepartidor: '',
  });

  const [searchVehicle, setSearchVehicle] = useState({
    idVehicle: '',
    matricula: '',
    marca: '',
    modelo: '',
    fecha: '',
  });

  const [deleteVehicle, setDeleteVehicle] = useState({
    idVehicle: '',
  });

  const [menuTop, setMenuTop] = useState(150);
  const navigate = useNavigate();

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificación del tipo de usuario al cargar el componente
  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');

    // Si el rol no es gerente, redirigimos al usuario fuera de esta página
    if (userRole !== 'gerente') {
      navigate('/'); // Redirige a la página de inicio u otra página
    }
  }, [navigate]);

  const handleCreateVehicle = (e) => {
    setCreateVehicle({ ...createVehicle, [e.target.name]: e.target.value });
  };

  const handleAssignmentVehicle = (e) => {
    setAssignmentVehicle({
      ...assignmentVehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchHistory = (e) => {
    setSearchHistory({ ...searchHistory, [e.target.name]: e.target.value });
  };

  const handleSearchVehicle = (e) => {
    setSearchVehicle({ ...searchVehicle, [e.target.name]: e.target.value });
  };

  const handleDeleteVehicle = (e) => {
    setDeleteVehicle({ ...deleteVehicle, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateVehicle = (e) => {
    e.preventDefault();
    if (
      !createVehicle.matricula ||
      !createVehicle.marca ||
      !createVehicle.modelo
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    console.log('Create Vehicle:', createVehicle);
    // Aquí va la lógica para Create Vehicle
  };

  const handleSubmitAssignmentVehicle = (e) => {
    e.preventDefault();
    console.log('Assignment Vehicle: ', assignmentVehicle);
    // Aquí va la lógica para Assignment Vehicle
  };

  const handleSubmitSearchHistory = (e) => {
    e.preventDefault();
    console.log('Search History:', searchHistory);
    // Aquí va la lógica para Search History
  };

  const handleSubmitSearchVehicle = (e) => {
    e.preventDefault();
    console.log('Search Vehicle:', searchVehicle);
    // Aquí va la lógica para buscar Search Vehicle
  };

  const handleSubmitDeleteVehicle = (e) => {
    e.preventDefault();
    console.log('Delete Vehicle:', deleteVehicle);
    // Aquí va la lógica para Delete Vehicle
  };

  return (
    <div>
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#crear_vehiculo">Crear vehiculo</a>
          </li>
          <li>
            <a href="#Asignar_vehiculo">Asignar vehiculo</a>
          </li>
          <li>
            <a href="#Buscar_historial">Buscar historial</a>
          </li>
          <li>
            <a href="#Buscar_vehiculo">Buscar vehiculo</a>
          </li>
          <li>
            <a href="#Eliminar_vehiculo">Eliminar vehiculo </a>
          </li>
        </ul>
      </div>
      <div className="user-management-page">
        <h1>Gestión de Vehiculos</h1>

        {/* Crear Vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitCreateVehicle}
          id="crear_vehiculo"
        >
          <h2>Crear Vehiculo</h2>
          <input
            type="text"
            name="matricula"
            placeholder="matricula"
            value={createVehicle.matricula}
            onChange={handleCreateVehicle}
          />
          <input
            type="text"
            name="marca"
            placeholder="marca"
            value={createVehicle.marca}
            onChange={handleCreateVehicle}
          />
          <input
            type="text"
            name="modelo"
            placeholder="modelo"
            value={createVehicle.modelo}
            onChange={handleCreateVehicle}
          />
          <button type="submit">Crear Vehiculo</button>
        </form>

        {/* Asignacion de vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitAssignmentVehicle}
          id="Asignar_vehiculo"
        >
          <h2>Asignacion de vehiculo</h2>
          <input
            type="text"
            name="idRepartidor"
            placeholder="id Repartidor"
            value={assignmentVehicle.idRepartidor}
            onChange={handleAssignmentVehicle}
          />
          <input
            type="text"
            name="idVehicle"
            placeholder="id Vehicle"
            value={assignmentVehicle.idVehicle}
            onChange={handleAssignmentVehicle}
          />
          <input
            type="text"
            name="kilometrajeInicial"
            placeholder="kilometraje Inicial"
            value={assignmentVehicle.kilometrajeInicial}
            onChange={handleAssignmentVehicle}
          />
          <input
            type="text"
            name="motivo"
            placeholder="Motivo"
            value={assignmentVehicle.motivo}
            onChange={handleAssignmentVehicle}
          />
          <button type="submit">Asignar Vehiculo</button>
        </form>

        {/* Buscar Historial */}
        <form
          className="form"
          onSubmit={handleSubmitSearchHistory}
          id="Buscar_historial"
        >
          <h2>Buscar Historial </h2>
          <input
            type="text"
            name="idVehicle"
            placeholder="id Vehicle"
            value={searchHistory.idVehicle}
            onChange={handleSearchHistory}
          />
          <input
            type="text"
            name="idRepartidor"
            placeholder="id Repartidor"
            value={searchHistory.idRepartidor}
            onChange={handleSearchHistory}
          />
          <button type="submit">Buscar Historial</button>
        </form>

        {/* Buscar Vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitSearchVehicle}
          id="Buscar_vehiculo"
        >
          <h2>Buscar Vehiculo </h2>
          <input
            type="text"
            name="idVehicle"
            placeholder="id Vehiculo"
            value={searchVehicle.idVehicle}
            onChange={handleSearchVehicle}
          />
          <input
            type="text"
            name="matricula"
            placeholder="matricula"
            value={searchVehicle.matricula}
            onChange={handleSearchVehicle}
          />
          <input
            type="text"
            name="marca"
            placeholder="marca"
            value={searchVehicle.marca}
            onChange={handleSearchVehicle}
          />
          <input
            type="text"
            name="modelo"
            placeholder="modelo"
            value={searchVehicle.modelo}
            onChange={handleSearchVehicle}
          />
          <input
            type="datetime-local"
            name="fecha"
            placeholder="fecha"
            value={searchVehicle.fecha}
            onChange={handleSearchVehicle}
          />
          <button type="submit">Buscar Vehiculo</button>
        </form>

        {/* Eliminar Vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitDeleteVehicle}
          id="Eliminar_vehiculo"
        >
          <h2>Eliminar Vehiculo </h2>
          <input
            type="text"
            name="idVehicle"
            placeholder="id Vehiculo"
            value={deleteVehicle.idVehicle}
            onChange={handleDeleteVehicle}
          />
          <button type="submit">Eliminar Vehiculo</button>
        </form>
      </div>
    </div>
  );
};

export default GestionVeh;
