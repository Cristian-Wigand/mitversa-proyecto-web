import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { filter, throttle } from 'lodash';
import '../App.css';

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
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
  const navigate = useNavigate();

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Descomentar si necesitas validar el rol del usuario
    /*
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'gerente') {
      navigate('/');
    }
    */
  }, [navigate]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    if (searchType == 'Vehiculo') {
      await fetchSearch({ [selectedOption2]: searchVehicle[selectedOption2] }, 0);
      setSearchVehicle({matricula: '',
        marca: '',
        modelo: '',
        estado: 'disponible',
        vehiculo_creado_el: '',})
      setSearchassignmentR({
          id_repartidor: '',
          id_vehiculo: '',
          fecha_asignacion: '',
          fecha_devolucion: '',
          kilometraje_inicial: '',
          kilometraje_final: '',
          motivo: '',
          })
    } else {
      await fetchSearch({ [selectedOption]: searchassignmentR[selectedOption] }, 1);
      setSearchVehicle({matricula: '',
        marca: '',
        modelo: '',
        estado: 'disponible',
        vehiculo_creado_el: '',})
      setSearchassignmentR({
          id_repartidor: '',
          id_vehiculo: '',
          fecha_asignacion: '',
          fecha_devolucion: '',
          kilometraje_inicial: '',
          kilometraje_final: '',
          motivo: '',
          })
  };}

  const handleCreateVehicle = (e) =>
    setCreateVehicle({ ...createVehicle, [e.target.name]: e.target.value });

  const handleAssignmentVehicle = (e) => {
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

  const handleResponse = (response, successMessage, errorMessage) => {
    if (!response.ok) {
      return Promise.reject('Error en la solicitud: ' + response.status);
    }
    return response.json().then((data) => {
      console.log(successMessage, data);
      alert(successMessage);
      return { success: true, data };
    });
  };

  const fetchSearch = async (filters, verificador) => {
    try {
      let response;
      let data;

      if (verificador == 0 || verificador == 3) {
        response = await fetch(
          `https://mitversa.christianferrer.me/api/vehiculos/`,
        );
      } else if (verificador == 1) {
        response = await fetch(
          `https://mitversa.christianferrer.me/api/historiales-asignacion/`,
        );
      } else if (verificador == 2) {
        response = await fetch(
          `https://mitversa.christianferrer.me/api/usuarios/`,
        );
      }

      // Verifica si la respuesta es exitosa antes de intentar obtener los datos
      if (response.ok) {
        data = await response.json();
        console.log('data', data); // Verifica la estructura de los datos
        // Filtrar los objetos según los filtros proporcionados
        const filtrados = data.filter((objeto) => {
          return Object.keys(filters).every((key) => {
            if (
              key === 'fecha_asignacion' ||
              key === 'fecha_devolucion' ||
              key === 'vehiculo_creado_el'
            ) {
              console.log('BD:', objeto[key]);
              const [datePart, timePart] = objeto[key].split('T');
              const [yearO, monthO, dayO] = datePart.split('-').map(Number);
              const objetoFecha = new Date(yearO, monthO - 1, dayO);

              const [year, month, day] = filters[key].split('-').map(Number);
              const filtroFecha = new Date(year, month - 1, day);
              console.log('Filtro:', filtroFecha);
              console.log('BD:', objetoFecha);
              return (
                objetoFecha.getFullYear() === filtroFecha.getFullYear() &&
                objetoFecha.getMonth() === filtroFecha.getMonth() &&
                objetoFecha.getDate() === filtroFecha.getDate()
              );
            } else {
              // Comparación estándar para otros valores
              return objeto[key].toString() === filters[key];
            }
          });
        });
        console.log('filtrados', filtrados); // Verifica qué datos han sido filtrados
        if (verificador == 0) {
          setsearchListV(filtrados);
        }else if (verificador == 1){
          setsearchListA(filtrados);
        } else if (verificador == 2) {
          return filtrados;
        } else if (verificador == 3) {
          return filtrados;
        }
      } else {
        if (verificador == 0 || verificador == 1) {
          setErrorMessage('Error al cargar el Buscador.');
          alert('Error al cargar el Buscador.');
        } else {
          setErrorMessage('Error al cargar repartidores(Asignar vehiculo).');
          alert('Error al cargar repartidores(Asignar vehiculo).');
        }
      }
    } catch (error) {
      if (verificador == 0 || verificador == 1) {
        setErrorMessage('Error de conexión con el servidor.(Buscador)');
        alert('Error de conexión con el servidor, (Buscador)');
      } else {
        setErrorMessage('Error de conexión con el servidor.(Asignar vehiculo)');
        alert('Error de conexión con el servidor, (Asignar vehiculo)');
      }
    }
  };

  const handleSubmitCreateVehicle = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    // Obtén la fecha de creación
    const fechaCreacion = new Date().toLocaleString('sv-SE').slice(0, 16);

    // Cambia el valor de createVehicle directamente
    createVehicle.vehiculo_creado_el = fechaCreacion;

    // Realiza la solicitud con el objeto actualizado
    fetch('https://mitversa.christianferrer.me/api/vehiculos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createVehicle), // Usa el objeto actualizado aquí
    })
      .then((response) =>
        handleResponse(
          response,
          'Vehículo creado exitosamente',
          'Hubo un error al crear el vehículo',
        ),
      )
      .then(({ success }) => {
        if (success) {
          // Solo se ejecuta si la respuesta fue exitosa
          setCreateVehicle({
            matricula: '',
            marca: '',
            modelo: '',
            estado: 'disponible', // Valor por defecto
            vehiculo_creado_el: '',
            vehiculo_actualizado_el: null,
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el vehículo: ' + error);
      });
  };
  const updateVehicleStatus = async (idVehiculo, nuevoEstado) => {
    try {
      console.log('id vehiculo', idVehiculo);
      const response = await fetch(
        `https://mitversa.christianferrer.me/api/vehiculos/${idVehiculo}/`,
        {
          method: 'PATCH', // Usualmente PATCH o PUT para actualizaciones
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
          },
          body: JSON.stringify({ estado: nuevoEstado }), // Cambia el estado del vehículo
        },
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del vehículo');
      }

      const data = await response.json();
      console.log('Estado del vehículo actualizado:', data);
    } catch (error) {
      console.error('Error al actualizar el estado del vehículo:', error);
    }
  };

  const handleSubmitAssignmentVehicle = async (e) => {
    e.preventDefault();

    // Esperar a que se complete fetchSearch
    const repartidores = await fetchSearch({ tipo_usuario: 'repartidor' }, 2);
    const vehiculos = await fetchSearch({ estado: 'disponible' }, 3);

    const idBuscadoR = assignmentVehicle['id_repartidor'];
    const existeRepartidor = repartidores.some(
      (usuario) => usuario.id_usuario.toString() === idBuscadoR,
    );

    const idBuscadoV = assignmentVehicle['id_vehiculo'];
    const existeVehiculo = vehiculos.some(
      (vehiculo) => vehiculo.id_vehiculo.toString() === idBuscadoV,
    );

    // Verifica si el repartidor existe antes de continuar
    if (!existeRepartidor) {
      alert('El repartidor no existe.');
      return; // Detener la ejecución si no existe
    }
    // Verifica si el vehiculo existe antes de continuar
    if (!existeVehiculo) {
      alert('El vehiculo no existe o no esta disponible');
      return; // Detener la ejecución si no existe
    }

    // Obtén la fecha de creación
    const fechaCreacion = new Date().toLocaleString('sv-SE').slice(0, 16);

    // Cambia el valor de createVehicle directamente
    assignmentVehicle.fecha_asignacion = fechaCreacion;

    // Realizar la solicitud para crear la asignación
    try {
      const response = await fetch(
        'https://mitversa.christianferrer.me/api/historiales-asignacion/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
          },
          body: JSON.stringify(assignmentVehicle),
        },
      );
      const result = await handleResponse(
        response,
        'Asignación creada exitosamente',
        'Hubo un error en la asignación',
      );
  
      // Verificar si la respuesta fue exitosa
      if (result.success) {
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
      await updateVehicleStatus(assignmentVehicle.id_vehiculo, 'no_disponible');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error en la asignación: ' + error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSelect2Change = (e) => {
    setSelectedOption2(e.target.value);
  };

  const handleSearchVehicle = (e) => {
    setSearchVehicle({ ...searchVehicle, [e.target.name]: e.target.value });
  };

  const handleSearchassignmentR = (e) => {
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

  const handleDeleteAssignment = async (userId) => {
    if (
      window.confirm('¿Estás seguro de que deseas eliminar esta asignacion?')
    ) {
      try {
        const response = await fetch(
          `https://mitversa.christianferrer.me/api/historiales-asignacion/${userId}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
            },
          },
        );

        if (response.ok) {
          alert('Asignacion eliminado exitosamente.');
          fetchSearch(
            { [selectedOption]: searchassignmentR[selectedOption] },
            1,
          );
        } else {
          const errorData = await response.json();
          alert(
            `Error: ${errorData.detail || 'No se pudo eliminar la asignacion.'}`,
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDeleteVehicle = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehiculo?')) {
      try {
        const response = await fetch(
          `https://mitversa.christianferrer.me/api/vehiculos/${userId}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
            },
          },
        );

        if (response.ok) {
          alert('Vehiculo eliminado exitosamente.');
          fetchSearch({ [selectedOption2]: searchVehicle[selectedOption2] }, 1);
        } else {
          const errorData = await response.json();
          alert(
            `Error: ${errorData.detail || 'No se pudo eliminar el Vehiculo.'}`,
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
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
          onSubmit={handleSubmitCreateVehicle}
          id="crear_vehiculo"
        >
          <h2>Crear Vehículo</h2>
          <input
            type="text"
            name="matricula"
            placeholder="Matrícula"
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
          <button type="submit">Crear Vehículo</button>
        </form>

        {/* Asignación de Vehículo */}
        <form
          className="form"
          onSubmit={handleSubmitAssignmentVehicle}
          id="Asignar_vehiculo"
        >
          <h2>Asignar Vehículo</h2>
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={assignmentVehicle.id_repartidor}
            onChange={handleAssignmentVehicle}
            required
            min="1"
            step="1"
          />
          <input
            type="number"
            name="id_vehiculo"
            placeholder="ID vehículo"
            value={assignmentVehicle.id_vehiculo}
            onChange={handleAssignmentVehicle}
            required
            min="1"
            step="1"
          />
          <input
            type="number"
            name="kilometraje_inicial"
            placeholder="Kilometraje inicial"
            value={assignmentVehicle.kilometraje_inicial}
            onChange={handleAssignmentVehicle}
            required
            min="0"
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
          <button type="submit">Asignar Vehículo</button>
        </form>

        {/* Buscar */}
        <form className="form" onSubmit={handleSubmitSearch} id="Buscador">
          <h2>Buscador</h2>
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="Vehiculo">Vehiculo</option>
            <option value="Asignacion">Asignacion</option>
          </select>

          {searchType === 'Vehiculo' ? (
            <>
              <select
                name="criterioBusqueda"
                onChange={handleSelect2Change}
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
                  onChange={handleSearchVehicle}
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
                  onChange={handleSearchVehicle}
                  disabled={!selectedOption2}
                />
              )}
            </>
          ) : (
            <>
              <select
                name="criterioBusqueda"
                onChange={handleSelectChange}
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
                min={selectedOption === 'motivo' ? undefined : (selectedOption === 'id_repartidor' || selectedOption === 'id_vehiculo' ? '1' : '0')} // Permite solo números positivos
                step={(selectedOption === 'kilometraje_inicial' || selectedOption === 'kilometraje_final')? '0.01' : (selectedOption === 'id_repartidor' || selectedOption === 'id_vehiculo' ? '1' : undefined)
                } // Permite decimales si es kilometraje
                name={selectedOption}
                placeholder={`Ingresa ${selectedOption}`}
                value={searchassignmentR[selectedOption] || ''}
                onChange={handleSearchassignmentR}
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
                      onClick={() =>
                        handleDeleteVehicle(asignacion.id_vehiculo)
                      }
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
                      onClick={() =>
                        handleDeleteAssignment(asignacion.id_historial)
                      }
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
