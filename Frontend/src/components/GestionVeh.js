import React, { useState } from 'react';
import '../Css/GestionarVehiculos.css';
import '../Css/App.css';

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
    Motivo: '',
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
    <div className="user-management-page">
      <h1>Gestión de Vehiculos</h1>

      {/* Crear Vehiculo */}
      <form className="form" onSubmit={handleSubmitCreateVehicle}>
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
      <form className="form" onSubmit={handleSubmitAssignmentVehicle}>
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
          name="Motivo"
          placeholder="Motivo"
          value={assignmentVehicle.Motivo}
          onChange={handleAssignmentVehicle}
        />
        <button type="submit">Asignar Vehiculo</button>
      </form>

      {/* Buscar Historial */}
      <form className="form" onSubmit={handleSubmitSearchHistory}>
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
      <form className="form" onSubmit={handleSubmitSearchVehicle}>
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
      <form className="form" onSubmit={handleSubmitDeleteVehicle}>
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
  );
};

export default GestionVeh;
