import React, { useState, useEffect, act } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { throttle } from 'lodash';
import '../App.css';
import Conexiones from './conexiones';
const conexiones = Conexiones();

const GestionEnv = () => {
  const [searchType, setSearchType] = useState('envio'); // Estado para el tipo de búsqueda
  const [selectedOption, setSelectedOption] = useState(''); // Direccion Almacena solo el criterio seleccionado
  const [selectedOption2, setSelectedOption2] = useState(''); // Envio Almacena solo el criterio seleccionado
  const [searchListE, setsearchListE] = useState([]);
  const [searchListP, setsearchListP] = useState([]);
  const [searchListD, setsearchListD] = useState([]);
  const navigate = useNavigate();

  const [createDireccion_origen, setCreateDireccionOrigen] = useState({
    id_ciudad: '',
    nombre: '',
    calle: '',
    numero: '',
  });
  const [createDireccion_destino, setCreateDireccion_destino] = useState({
    id_ciudad: '',
    nombre: '',
    calle: '',
    numero: '',
  });
  const [createEnvio, setCreateEnvio] = useState({
    id_estado_envio: '',
    id_repartidor: '',
    id_cliente: '',
    fecha_pedido_inicio: '',
    fecha_pedido_fin: '',
    direccion_origen: '',
    direccion_destino: '',
    costo_total: '',
  });
  const [createPaquete, setCreatePaquete] = useState({
    id_envio: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    descripcion: '',
  });
  const [searchEnvio, setSearchEnvio] = useState({
    id_estado_envio: '',
    id_repartidor: '',
    id_cliente: '',
    fecha_pedido_inicio: '',
    fecha_pedido_fin: '',
    direccion_origen: '',
    direccion_destino: '',
    costo_total: '',
  });
  const [searchPaquete, setSearchPaquete] = useState({
    id_envio: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    descripcion: '',
  });
  const [searchDireccion, setSearchDireccion] = useState({
    id_comuna: '',
    calle: '',
    numero: '',
  });

  const [comunas, setComunas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [estadosEnvio, setEstadosEnvio] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [selectedComuna2, setSelectedComuna2] = useState('');
  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [filteredCiudades2, setFilteredCiudades2] = useState([]);
  const [menuTop, setMenuTop] = useState(150);
  const [allComunas, setAllComunas] = useState([]);

  const Scroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', Scroll);
    return () => window.removeEventListener('scroll', Scroll);
  }, []);

  const SearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  useEffect(() => {
    const tipoUsuario = sessionStorage.getItem('tipoUsuario');
    if (tipoUsuario !== 'gerente') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch comunas, ciudades y estados de envío
    const fetchComunas = async () => {
      let data;
      const resultado = await conexiones.traer_todo('Comuna');
      if (resultado[0]) {
        data = resultado[1];
      } else {
        console.log('Error en fetchCiudades ');
      }
      const uniqueComunas = Array.from(
        new Set(data.map((comuna) => comuna.nombre)),
      ).map((nombre) => data.find((comuna) => comuna.nombre === nombre));
      setComunas(uniqueComunas);
      setAllComunas(data);
    };
    const fetchCiudades = async (nombre) => {
      const resultado = await conexiones.traer_todo('Ciudad');
      if (resultado[0]) {
        setCiudades(resultado[1]);
      } else {
        console.log('Error en fetchCiudades ');
      }
    };

    const fetchEstadosEnvio = async () => {
      const resultado = await conexiones.traer_todo('Estado_envio');
      if (resultado[0]) {
        setEstadosEnvio(resultado[1]);
      } else {
        console.log('Error en fetchEstadosEnvio ');
      }
    };
    fetchComunas();
    fetchCiudades();
    fetchEstadosEnvio();
  }, []);

  const obtenerNombreEstadoPorId = (id) => {
    const estado = estadosEnvio.find((estado) => estado.id_estado_envio === id);
    return estado ? estado.nombre : null;  // Si no encuentra el estado, retorna null
  };

  const ComunaChange = (e) => {
    const selectedNombreComuna = e.target.value;
    const filteredComunas = allComunas.filter(
      (comuna) => comuna.nombre === selectedNombreComuna,
    );
    const idsCiudades = filteredComunas.map((comuna) => comuna.id_ciudad);

    const ciudadesFiltradas = ciudades.filter((ciudad) =>
      idsCiudades.includes(ciudad.id_ciudad),
    );
    console.log('selectedNombreComuna',selectedNombreComuna,'ciudadesFiltradas',ciudadesFiltradas)
    setSelectedComuna(selectedNombreComuna);
    setFilteredCiudades(ciudadesFiltradas);
    setCreateDireccionOrigen({
      ...createDireccion_origen,
      nombre: selectedNombreComuna,
    });
  };

  const ComunaChange2 = (e) => {
    const selectedNombreComuna = e.target.value;
    const filteredComunas = allComunas.filter(
      (comuna) => comuna.nombre === selectedNombreComuna,
    );
    const idsCiudades = filteredComunas.map((comuna) => comuna.id_ciudad);

    const ciudadesFiltradas = ciudades.filter((ciudad) =>
      idsCiudades.includes(ciudad.id_ciudad),
    );
    setSelectedComuna2(selectedNombreComuna);
    setFilteredCiudades2(ciudadesFiltradas);
    setCreateDireccion_destino({
      ...createDireccion_destino,
      nombre: selectedNombreComuna,
    });
  };

  const CiudadChange = (e, num) => {
    const selectedValue = e.target.value;

    if (num === 0) {
      setCreateDireccionOrigen({
        ...createDireccion_origen,
        id_ciudad: selectedValue,
      });
    } else {
      setCreateDireccion_destino({
        ...createDireccion_destino,
        id_ciudad: selectedValue,
      });
    }
  };

  const CreateDireccion_origen = (e) => {
    setCreateDireccionOrigen({
      ...createDireccion_origen,
      [e.target.name]: e.target.value,
    });
  };

  const CreateDireccion_destino = (e) => {
    setCreateDireccion_destino({
      ...createDireccion_destino,
      [e.target.name]: e.target.value,
    });
  };

  const CreateEnvio = (e) => {
    setCreateEnvio({ ...createEnvio, [e.target.name]: e.target.value });
  };

  const CreatePaquete = (e) => {
    setCreatePaquete({ ...createPaquete, [e.target.name]: e.target.value });
  };

  const SelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const Select2Change = (e) => {
    setSelectedOption2(e.target.value);
  };

  const SearchEnvio = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (
      name === 'id_repartidor' ||
      name === 'id_cliente' ||
      name === 'costo_total'
    ) {
      if (value === '' || Number(value) > 0) {
        setSearchEnvio((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setSearchEnvio({
        ...searchEnvio,
        [e.target.name]: e.target.value,
      });
    }
  };
  const SearchPaquete = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (
      name === 'peso' ||
      name === 'largo' ||
      name === 'ancho' ||
      name === 'alto'
    ) {
      if (value === '' || Number(value) > 0) {
        setSearchPaquete((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setSearchPaquete({
        ...searchPaquete,
        [e.target.name]: e.target.value,
      });
    }
  };
  const SearchDireccion = (e) => {
    const { name, value } = e.target;

    // Permite un valor vacío para el campo
    if (name === 'numero') {
      if (value === '' || Number(value) > 0) {
        setSearchDireccion((prevState) => ({
          ...prevState,
          [name]: value, // Guarda el valor directamente
        }));
      }
    } else {
      // Actualiza otros campos normalmente
      setSearchDireccion({
        ...searchDireccion,
        [e.target.name]: e.target.value,
      });
    }
  };

  const SubmitSearch = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    if (searchType == 'envio') {
      const resultado = await conexiones.fetchSearch('Envio', {
        [selectedOption2]: searchEnvio[selectedOption2],
      });
      if (resultado[0]) {
        setsearchListE(resultado[1]);
      }
    } else if (searchType == 'paquete') {
      const resultado2 = await conexiones.fetchSearch('Paquete', {
        [selectedOption]: searchPaquete[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListP(resultado2[1]);
      }
    } 
    setSelectedOption('')
    setSelectedOption2('')
    setSearchEnvio({
      id_estado_envio: '',
      id_repartidor: '',
      id_cliente: '',
      fecha_pedido_inicio: '',
      fecha_pedido_fin: '',
      direccion_origen: '',
      direccion_destino: '',
      costo_total: '',
    });
    setSearchPaquete({
      id_envio: '',
      peso: '',
      largo: '',
      ancho: '',
      alto: '',
      descripcion: '',
    });
  };

  const SubmitCreateEnvio = async (e) => {
    e.preventDefault();
    const id_comuna_origen = await conexiones.fetchSearch('Comuna', {
      nombre: createDireccion_origen.nombre,
      id_ciudad: createDireccion_origen.id_ciudad,
    });
    const id_comuna_destino = await conexiones.fetchSearch('Comuna', {
      nombre: createDireccion_destino.nombre,
      id_ciudad: createDireccion_destino.id_ciudad,
    });
    if (!id_comuna_origen[0]) {
      console.log('Error en comuna origen');
      return alert('Error en comuna origen');
    }
    if (!id_comuna_destino[0]) {
      console.log('Error en comuna destino');
      return alert('Error en comuna destino');
    }
    console.log('id_comuna_origen',id_comuna_origen[1][0])
    console.log('id_comuna_destino',id_comuna_destino)
    const direc_origen = {
      id_comuna: id_comuna_origen[1][0].id_comuna,
      calle: createDireccion_origen.calle,
      numero: createDireccion_origen.numero,
    };
    const direc_destino = {
      id_comuna: id_comuna_destino[1][0].id_comuna,
      calle: createDireccion_destino.calle,
      numero: createDireccion_destino.numero,
    };
    let direccion_origen_id; // Declarar fuera del bloque
    let direccion_destino_id; // Declarar fuera del bloque
    let direccion_origen;
    let direccion_destino;

    direccion_origen = await conexiones.SubmitCreate(
      'Direccion',
      direc_origen,
    );
    direccion_destino = await conexiones.SubmitCreate(
      'Direccion',
      direc_destino,
    );
    if (direccion_origen[0]) {
      console.log('direccion_origen[1].id_direccion;')
      console.log(direccion_origen[1])
      direccion_origen_id = direccion_origen[1].id_direccion;
    }else{
      direccion_origen = await conexiones.fetchSearch(
        'Direccion',
        direc_origen,
      );
      if (!direccion_origen[0]) {
        return alert('Error en direccion_origen');
      }
      console.log('direccion_origen[1]',direccion_origen[1])
      direccion_origen_id = direccion_origen[1][0].id_direccion; // Asignar sin 'const'
    }
    if (direccion_destino[0]) {
      direccion_destino_id = direccion_destino[1].id_direccion; // Asignar sin 'const'
    }else{
      direccion_destino = await conexiones.fetchSearch(
        'Direccion',
        direc_destino,
      );
      if (!direccion_destino[0]) {
        return alert('Error en direccion_destino');
      }
      direccion_destino_id = direccion_destino[1][0].id_direccion; // Asignar sin 'const'
    }    
    createEnvio.direccion_origen = direccion_origen_id;
    createEnvio.direccion_destino = direccion_destino_id;

    const resultado = await conexiones.SubmitCreate('Envio', createEnvio);
    if (resultado[0]) {
      setSelectedComuna("");
      setFilteredCiudades([""]);
      setSelectedComuna2("");
      setFilteredCiudades2([""]);
      setCreateDireccionOrigen({
        id_ciudad: '',
        nombre: '',
        calle: '',
        numero: '',
      });
      setCreateDireccion_destino({
        id_ciudad: '',
        nombre: '',
        calle: '',
        numero: '',
      });
      setCreateEnvio({
        id_estado_envio: '',
        id_repartidor: '',
        id_cliente: '',
        fecha_pedido_inicio: '',
        fecha_pedido_fin: '',
        direccion_origen: '',
        direccion_destino: '',
        costo_total: '',
      });
    }
  };

  const DeleteEnvio = async (userId) => {
    const resultado = conexiones.Delete('Envio', userId);
    if (resultado[0]) {
      const resultado2 = await conexiones.fetchSearch('Envio', {
        [selectedOption2]: searchEnvio[selectedOption2],
      });
      if (resultado2[0]) {
        setsearchListE(resultado2[1]);
      }
    }
  };

  const DeletePaquete = async (userId) => {
    const resultado = conexiones.Delete('Paquete', userId);
    if (resultado) {
      const resultado2 = await conexiones.fetchSearch('Paquete', {
        [selectedOption]: searchPaquete[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListP(resultado2[1]);
      }
    }
  };

  const SubmitCreatePaquete = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    const resultado = await conexiones.SubmitCreate('Paquete', createPaquete);
    console.log('resultado', resultado);
    if (resultado[0]) {
      setCreatePaquete({
        id_envio: '',
        peso: '',
        largo: '',
        ancho: '',
        alto: '',
        descripcion: '',
      });
    }
  };

  return (
    <div>
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#envio">Crear Envío</a>
          </li>
          <li>
            <a href="#paquete">Crear Paquete</a>
          </li>
          <li>
            <a href="#buscador">Buscador</a>
          </li>
        </ul>
      </div>

      <div className="user-management-page">
        <h1>Gestionar Envío</h1>

        {/* Formulario para crear envío */}
        <form className="form" onSubmit={SubmitCreateEnvio} id="envio">
          <h2>Crear Envío</h2>
          <select
            name="id_estado_envio"
            onChange={CreateEnvio}
            value={createEnvio.id_estado_envio}
          >
            <option value="">Seleccione un estado de envío</option>
            {estadosEnvio.map((estado) => (
              <option
                key={estado.id_estado_envio}
                value={estado.id_estado_envio}
              >
                {estado.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={createEnvio.id_repartidor}
            onChange={CreateEnvio}
            min="1"
            required
          />
          <input
            type="number"
            name="id_cliente"
            placeholder="ID Cliente"
            value={createEnvio.id_cliente}
            onChange={CreateEnvio}
            min="1"
            required
          />
          <input
            type="datetime-local"
            name="fecha_pedido_inicio"
            value={createEnvio.fecha_pedido_inicio}
            onChange={CreateEnvio}
            required
          />
          <input
            type="datetime-local"
            name="fecha_pedido_fin"
            value={createEnvio.fecha_pedido_fin}
            onChange={CreateEnvio}
            required
          />
          <h3>Direccion Origen</h3>
          <select
            name="comuna"
            onChange={ComunaChange}
            value={createDireccion_origen.nombre}
          >
            <option value="">Seleccione una Region</option>
            {comunas.map((comuna) => (
              <option key={comuna.id_comuna} value={comuna.nombre}>
                {comuna.nombre}
              </option>
            ))}
          </select>
          {/* Mostrar la ciudad asociada */}
          <select
            name="ciudad"
            onChange={(e) => CiudadChange(e, 0)} // Cambiar según la lógica
            value={createDireccion_origen.id_ciudad}
          >
            <option value="">Seleccione una comuna</option>
            {filteredCiudades.map((ciudad) => (
              <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="calle"
            placeholder="Calle"
            value={createDireccion_origen.calle}
            onChange={CreateDireccion_origen}
            required
          />
          <input
            type="number"
            name="numero"
            placeholder="Número"
            value={createDireccion_origen.numero}
            onChange={CreateDireccion_origen}
            min="1"
            step="1"
            required
          />
          <h3>Direccion Destino</h3>
          <select
            name="comuna"
            onChange={ComunaChange2}
            value={createDireccion_destino.nombre}
          >
            <option value="">Seleccione una Region</option>
            {comunas.map((comuna) => (
              <option key={comuna.id_comuna} value={comuna.nombre}>
                {comuna.nombre}
              </option>
            ))}
          </select>
          {/* Mostrar la ciudad asociada */}
          <select
            name="ciudad"
            onChange={(e) => CiudadChange(e, 1)} // Cambiar según la lógica
            value={createDireccion_destino.id_ciudad}
          >
            <option value="">Seleccione una comuna</option>
            {filteredCiudades2.map((ciudad) => (
              <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="calle"
            placeholder="Calle"
            value={createDireccion_destino.calle}
            onChange={CreateDireccion_destino}
            required
          />
          <input
            type="number"
            name="numero"
            placeholder="Número"
            value={createDireccion_destino.numero}
            onChange={CreateDireccion_destino}
            min="1"
            step="1"
            required
          />
          <input
            type="number"
            name="costo_total"
            placeholder="Costo Total"
            value={createEnvio.costo_total}
            onChange={CreateEnvio}
            min="0"
            required
          />
          <button type="submit">Crear Envío</button>
        </form>

        {/* Formulario para crear paquete */}
        <form className="form" onSubmit={SubmitCreatePaquete} id="paquete">
          <h2>Crear Paquete</h2>
          <input
            type="number"
            name="id_envio"
            placeholder="ID Envío"
            value={createPaquete.id_envio}
            onChange={CreatePaquete}
            min="1"
            required
          />
          <input
            type="number"
            name="peso"
            placeholder="Peso"
            value={createPaquete.peso}
            onChange={CreatePaquete}
            min="0"
            required
          />
          <input
            type="number"
            name="largo"
            placeholder="Largo"
            value={createPaquete.largo}
            onChange={CreatePaquete}
            min="0"
            required
          />
          <input
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={createPaquete.ancho}
            onChange={CreatePaquete}
            min="0"
            required
          />
          <input
            type="number"
            name="alto"
            placeholder="Alto"
            value={createPaquete.alto}
            onChange={CreatePaquete}
            min="0"
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={createPaquete.descripcion}
            onChange={CreatePaquete}
            required
          />
          <button type="submit">Crear Paquete</button>
        </form>
        {/* Buscar */}
        <form className="form" onSubmit={SubmitSearch} id="Buscador">
          <h2>Buscador</h2>
          <select value={searchType} onChange={SearchTypeChange}>
            <option value="envio">Envio</option>
            <option value="paquete">Paquete</option>
          </select>

          {searchType === 'envio' ? (
            <>
              <select
                name="criterioBusqueda"
                onChange={Select2Change}
                value={selectedOption2}
              >
                <option value="">Selecciona un criterio</option>
                <option value="id_estado_envio">Estado Envio</option>
                <option value="id_repartidor">ID Repartidor</option>
                <option value="id_cliente">ID Cliente</option>
                <option value="fecha_pedido_inicio">Fecha Inicio</option>
                <option value="fecha_pedido_fin">Fecha Fin</option>
                <option value="direccion_origen">Direccion Origen ID</option>
                <option value="direccion_destino">Direccion Destino ID</option>
                <option value="costo_total">Costo Total</option>
              </select>
              {selectedOption2 === 'id_estado_envio' ? (
                <select
                  onChange={SearchEnvio}
                  value={searchEnvio[selectedOption2] || ''}
                  disabled={!selectedOption2}
                  name={selectedOption2}
                >
                  <option value="">Seleccione un estado de envío</option>
                  {estadosEnvio.map((estado) => (
                    <option key={estado.id_estado_envio} value={estado.id_estado_envio}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    selectedOption2 === 'fecha_pedido_inicio' ||
                    selectedOption2 === 'fecha_pedido_fin'
                      ? 'date'
                      : 'number'
                  }
                  min={'1'} // Permite solo números positivos
                  step={'1'}
                  name={selectedOption2}
                  placeholder={`Ingresa ${selectedOption2}`}
                  value={searchEnvio[selectedOption2] || ''}
                  onChange={SearchEnvio}
                  disabled={!selectedOption2}
                  required
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
                <option value="id_envio">ID Envio</option>
                <option value="peso">Peso</option>
                <option value="largo">Largo</option>
                <option value="ancho">Ancho</option>
                <option value="alto">Alto</option>
                <option value="descripcion">Descripcion</option>
              </select>
              <input
                type={selectedOption === 'descripcion' ? 'text' : 'number'}
                min={selectedOption === 'descripcion' ? undefined : '1'} // Permite solo números positivos
                step={selectedOption === 'descripcion' ? undefined : '1'} // Permite decimales si es kilometraje
                name={selectedOption}
                placeholder={`Ingresa ${selectedOption}`}
                value={searchPaquete[selectedOption] || ''}
                onChange={SearchPaquete}
                disabled={!selectedOption}
                required
              />
            </>
          )}
          <button type="submit">Buscar</button>
        </form>
        {/* Resultados de búsqueda */}
        <div>
          {searchType === 'envio' ? (
            <>
              {searchListE.length > 0 ? (
                searchListE.map((asignacion, index) => (
                  <div key={index} className="search-result">
                    <h2>Resultados de la Búsqueda de Envios:</h2>
                    <p>
                      <strong>Estado:</strong> {
                      obtenerNombreEstadoPorId(asignacion.id_estado_envio)
                      }
                    </p>
                    <p>
                      <strong>ID Repartidor:</strong> {asignacion.id_repartidor}
                    </p>
                    <p>
                      <strong>ID Cliente:</strong> {asignacion.id_cliente}
                    </p>
                    <p>
                      <strong>Fecha pedido inicio:</strong>{' '}
                      {asignacion.fecha_pedido_inicio
                        ? new Date(
                            asignacion.fecha_pedido_inicio,
                          ).toLocaleDateString()
                        : 'null'}
                    </p>
                    <p>
                      <strong>Fecha pedido fin:</strong>{' '}
                      {asignacion.fecha_pedido_fin
                        ? new Date(
                            asignacion.fecha_pedido_fin,
                          ).toLocaleDateString()
                        : 'null'}
                    </p>
                    <p>
                      <strong>ID Direccion Origen:</strong>{' '}
                      {asignacion.direccion_origen}
                    </p>
                    <p>
                      <strong>ID Direccion Destino:</strong>{' '}
                      {asignacion.direccion_destino}
                    </p>
                    <p>
                      <strong>Costo Total:</strong> {asignacion.costo_total}
                    </p>
                    <button onClick={() => DeleteEnvio(asignacion.id_envio)}>
                      Eliminar Asignacion
                    </button>
                  </div>
                ))
              ) : (
                <div className="search-result">
                  <p>No se encontraron Envios.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {searchListP.length > 0 ? (
                searchListP.map((asignacion, index) => (
                  <div key={index} className="search-result">
                    <h2>Resultados de la Búsqueda de Paquetes:</h2>
                    <p>
                      <strong>ID Envio:</strong> {asignacion.id_envio}
                    </p>
                    <p>
                      <strong>Peso:</strong> {asignacion.peso}
                    </p>
                    <p>
                      <strong>Largo:</strong> {asignacion.largo}
                    </p>
                    <p>
                      <strong>Ancho:</strong> {asignacion.ancho}
                    </p>
                    <p>
                      <strong>Alto:</strong> {asignacion.alto}
                    </p>
                    <p>
                      <strong>Descripcion:</strong> {asignacion.descripcion}
                    </p>
                    <button
                      onClick={() => DeletePaquete(asignacion.id_paquete)}
                    >
                      Eliminar Paquete
                    </button>
                  </div>
                ))
              ) : (
                <div className="search-result">
                  <p>No se encontraron Paquetes.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionEnv;
