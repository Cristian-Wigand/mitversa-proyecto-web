import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { throttle } from 'lodash';
import '../App.css';

const GestionVeh = () => {
  const [createVehicle, setCreateVehicle] = useState({
    matricula: '',
    marca: '',
    modelo: '',
    estado: 'disponible', // Valor por defecto
    vehiculo_creado_el: new Date().toISOString(), // Fecha y hora automática del dispositivo
    vehiculo_actualizado_el: '', // Inicialmente vacío
  });

  const [assignmentVehicle, setAssignmentVehicle] = useState({
    id_repartidor: '',
    id_vehiculo: '',
    fecha_asignacion: new Date().toISOString(),
    fecha_devolucion: '',
    kilometraje_inicial: '',
    kilometraje_final: '',
    motivo: '',
  });

  const [searchHistory, setSearchHistory] = useState({
    idRepartidor: '',
  });

  const [searchVehicle, setSearchVehicle] = useState({
    matricula: '',
    marca: '',
    modelo: '',
    fecha: '',
  });

  const [deleteVehicle, setDeleteVehicle] = useState({
    // Eliminado el idVehiculo
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
    /*
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'gerente') {
      navigate('/');
    }
    */
  }, [navigate]);

  // Funciones para manejar los cambios en los formularios
  const handleCreateVehicle = (e) =>
    setCreateVehicle({ ...createVehicle, [e.target.name]: e.target.value });
  const handleAssignmentVehicle = (e) =>
    setAssignmentVehicle({
      ...assignmentVehicle,
      [e.target.name]: e.target.value,
    });
  const handleSearchHistory = (e) =>
    setSearchHistory({ ...searchHistory, [e.target.name]: e.target.value });
  const handleSearchVehicle = (e) =>
    setSearchVehicle({ ...searchVehicle, [e.target.name]: e.target.value });
  const handleDeleteVehicle = (e) =>
    setDeleteVehicle({ ...deleteVehicle, [e.target.name]: e.target.value });

  // Funciones para enviar formularios
  const handleSubmitCreateVehicle = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/vehiculos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createVehicle),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Vehiculo creado:', data);
        alert('Vehiculo creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el vehiculo:', error);
        alert('Error al crear el vehiculo');
      });
  };

  const handleSubmitAssignmentVehicle = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/historiales-asignacion/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(assignmentVehicle),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Asignacion creada correctamente:', data);
        alert('Asignacion creada correctamente');
      })
      .catch((error) => {
        console.error('Error al crear asignacion', error);
        alert('Error al crear asignacion');
      });
  };

  const handleSubmitSearchHistory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://mitversa.christianferrer.me/api/history/?idRepartidor=${searchHistory.idRepartidor}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log('Search History:', data);
      alert('Historial encontrado.');
    } catch (error) {
      console.error('Error al buscar historial:', error);
      alert('Error al buscar historial.');
    }
  };

  const handleSubmitSearchVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://mitversa.christianferrer.me/api/vehicles/?matricula=${searchVehicle.matricula}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log('Search Vehicle:', data);
      alert('Vehículo encontrado.');
    } catch (error) {
      console.error('Error al buscar vehículo:', error);
      alert('Error al buscar vehículo.');
    }
  };

  const handleSubmitDeleteVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://mitversa.christianferrer.me/api/vehicles/${deleteVehicle.idVehicle}/`,
        {
          method: 'DELETE',
        },
      );
      if (response.ok) {
        console.log('Vehículo eliminado.');
        alert('Vehículo eliminado con éxito.');
      }
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      alert('Error al eliminar el vehículo.');
    }
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
            <a href="#Eliminar_vehiculo">Eliminar vehiculo</a>
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
            placeholder="Matricula"
            value={createVehicle.matricula}
            onChange={handleCreateVehicle}
            required
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={createVehicle.marca}
            onChange={handleCreateVehicle}
            required
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={createVehicle.modelo}
            onChange={handleCreateVehicle}
            required
          />
          <select
            name="estado"
            value={createVehicle.estado}
            onChange={handleCreateVehicle}
          >
            <option value="disponible">Disponible</option>
            <option value="no_disponible">No Disponible</option>
          </select>
          <button type="submit">Crear Vehiculo</button>
        </form>

        {/* Asignacion de vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitAssignmentVehicle}
          id="Asignar_vehiculo"
        >
          <h2>Asignar Vehiculo</h2>
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={assignmentVehicle.id_repartidor}
            onChange={handleAssignmentVehicle}
            required
          />
          <input
            type="number"
            name="id_vehiculo"
            placeholder="ID vehiculo"
            value={assignmentVehicle.id_vehiculo}
            onChange={handleAssignmentVehicle}
            required
          />
          <input
            type="number"
            name="kilometraje_inicial"
            placeholder="Kilometraje inicial"
            value={assignmentVehicle.kilometraje_inicial}
            onChange={handleAssignmentVehicle}
            required
            step="0.01"
          />
          <input
            type="text"
            name="motivo"
            placeholder="Motivo"
            value={assignmentVehicle.motivo}
            onChange={handleAssignmentVehicle}
            required
          />
          <button type="submit">Asignar Vehiculo</button>
        </form>

        {/* Buscar Historial */}
        <form
          className="form"
          onSubmit={handleSubmitSearchHistory}
          id="Buscar_historial"
        >
          <h2>Buscar Historial</h2>
          <input
            type="text"
            name="idRepartidor"
            placeholder="ID Repartidor"
            value={searchHistory.idRepartidor}
            onChange={handleSearchHistory}
            required
          />
          <button type="submit">Buscar Historial</button>
        </form>
        {/* Buscar Vehiculo */}
        <form
          className="form"
          onSubmit={handleSubmitSearchVehicle}
          id="Buscar_vehiculo"
        >
          <h2>Buscar Vehiculo</h2>
          <input
            type="text"
            name="matricula"
            placeholder="Matricula"
            value={searchVehicle.matricula}
            onChange={handleSearchVehicle}
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={searchVehicle.marca}
            onChange={handleSearchVehicle}
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={searchVehicle.modelo}
            onChange={handleSearchVehicle}
          />
          <input
            type="date"
            name="fecha"
            placeholder="Fecha"
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
          <h2>Eliminar Vehiculo</h2>
          <input
            type="text"
            name="idVehicle"
            placeholder="ID Vehiculo"
            value={deleteVehicle.idVehicle}
            onChange={handleDeleteVehicle}
            required
          />
          <button type="submit">Eliminar Vehiculo</button>
        </form>
      </div>
    </div>
  );
};

export default GestionVeh;
