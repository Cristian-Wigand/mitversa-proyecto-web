import React, { useState, useEffect, act } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario si no es gerente
import { throttle } from 'lodash';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  const [direcciones, setDirecciones] = useState({});
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
  useEffect(() => {
    const cargarDirecciones = async () => {
      const nuevasDirecciones = {};
      for (const asignacion of searchListE) {
        if (asignacion.direccion_origen) {
          nuevasDirecciones[asignacion.direccion_origen] = await buscar_direccion(asignacion.direccion_origen);
        }
        if (asignacion.direccion_destino) {
          nuevasDirecciones[asignacion.direccion_destino] = await buscar_direccion(asignacion.direccion_destino);
        }
      }
      setDirecciones(nuevasDirecciones);
    };

    if (searchListE.length > 0) {
      cargarDirecciones();
    }
  }, [searchListE]);

  const obtenerNombreEstadoPorId = (id) => {
    const estado = estadosEnvio.find((estado) => estado.id_estado_envio === id);
    return estado ? estado.nombre : null; // Si no encuentra el estado, retorna null
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
    console.log(
      'selectedNombreComuna',
      selectedNombreComuna,
      'ciudadesFiltradas',
      ciudadesFiltradas,
    );
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
      const resultado = await conexiones.fetchSearch2('Envio', {
        [selectedOption2]: searchEnvio[selectedOption2],
      });
      if (resultado[0]) {
        setsearchListE(resultado[1]);
        setSelectedOption2('');
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
      } else {
        setsearchListE([]);
      }
    } else if (searchType == 'paquete') {
      const resultado2 = await conexiones.fetchSearch('Paquete', {
        [selectedOption]: searchPaquete[selectedOption],
      });
      if (resultado2[0]) {
        setsearchListP(resultado2[1]);
        setSelectedOption('');
        setSearchPaquete({
          id_envio: '',
          peso: '',
          largo: '',
          ancho: '',
          alto: '',
          descripcion: '',
        });
      } else {
        setsearchListP([]);
      }
    }
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
    console.log('id_comuna_origen', id_comuna_origen[1][0]);
    console.log('id_comuna_destino', id_comuna_destino);
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

    direccion_origen = await conexiones.SubmitCreate('Direccion', direc_origen);
    direccion_destino = await conexiones.SubmitCreate(
      'Direccion',
      direc_destino,
    );
    if (direccion_origen[0]) {
      console.log('direccion_origen[1].id_direccion;');
      console.log(direccion_origen[1]);
      direccion_origen_id = direccion_origen[1].id_direccion;
    } else {
      direccion_origen = await conexiones.fetchSearch(
        'Direccion',
        direc_origen,
      );
      if (!direccion_origen[0]) {
        return alert('Error en direccion_origen');
      }
      console.log('direccion_origen[1]', direccion_origen[1]);
      direccion_origen_id = direccion_origen[1][0].id_direccion; // Asignar sin 'const'
    }
    if (direccion_destino[0]) {
      direccion_destino_id = direccion_destino[1].id_direccion; // Asignar sin 'const'
    } else {
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
      setSelectedComuna('');
      setFilteredCiudades(['']);
      setSelectedComuna2('');
      setFilteredCiudades2(['']);
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
    console.log('fetchSearch')
    await conexiones.fetchSearch('Envio',createEnvio)
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

  const convertir_fecha = (fecha) => {

    const date = new Date(fecha);

    // Obtener el día, mes, año, hora, minuto y segundo
    const day = String(date.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0, por eso sumamos 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Construir la cadena con el formato deseado
    const fecha_string = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    
    console.log(fecha_string);
    return fecha_string
  };

  const buscar_direccion = async (id) => {
    const resultado = await conexiones.fetchSearch("Direccion",{id_direccion:id})
    if (!resultado[0]){
      return 'Null'
    }
    const calle=resultado[1][0].calle
    const numero=resultado[1][0].numero
    const comuna=resultado[1][0].id_comuna
    const resultado2 = await conexiones.fetchSearch("Comuna",{id_comuna:comuna})
    if (!resultado2[0]){
      return 'Null'
    }
    const ciudad=resultado2[1][0].id_ciudad
    const comuna_nombre=resultado2[1][0].nombre
    const resultado3 = await conexiones.fetchSearch("Ciudad",{id_ciudad:ciudad})
    const ciudad_nombre=resultado3[1][0].nombre
    if (numero === 'null'){
      numero = ''
    }
    const direccion_string = `${comuna_nombre}, ${ciudad_nombre}, ${calle} ${numero}`
    return direccion_string
    }

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
          <select className='select-margin'
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
          <select className='select-margin'
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
          <select className='select-margin'
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
          <select className='select-margin'
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
          <select className='select-margin'
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
          <select value={searchType} onChange={SearchTypeChange} className='select-margin'>
            <option value="envio">Envio</option>
            <option value="paquete">Paquete</option>
          </select>

          {searchType === 'envio' ? (
            <>
              <select className='select-margin'
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
                <select className='select-margin'
                  onChange={SearchEnvio}
                  value={searchEnvio[selectedOption2] || ''}
                  disabled={!selectedOption2}
                  name={selectedOption2}
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
              <select className='select-margin'
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
        <div>
  {searchType === "envio" ? (
    <>
    {searchListE.length > 0 ? (
      <>
        <h2>Resultados de la Búsqueda de Envíos:</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Estado</th>
              <th>ID Repartidor</th>
              <th>ID Cliente</th>
              <th>Fecha Pedido Inicio</th>
              <th>Fecha Pedido Fin</th>
              <th>Dirección Origen</th>
              <th>Dirección Destino</th>
              <th>Costo Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {searchListE.map((asignacion, index) => (
              <tr key={index}>
                <td>{obtenerNombreEstadoPorId(asignacion.id_estado_envio)}</td>
                <td>{asignacion.id_repartidor}</td>
                <td>{asignacion.id_cliente}</td>
                <td>
                  {asignacion.fecha_pedido_inicio
                    ? convertir_fecha(asignacion.fecha_pedido_inicio)
                    : "null"}
                </td>
                <td>
                  {asignacion.fecha_pedido_fin
                    ? convertir_fecha(asignacion.fecha_pedido_fin)
                    : "null"}
                </td>
                <td>{direcciones[asignacion.direccion_origen] || "Cargando..."}</td>
                <td>{direcciones[asignacion.direccion_destino] || "Cargando..."}</td>
                <td>{asignacion.costo_total}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que deseas eliminar este envío?"
                        )
                      ) {
                        DeleteEnvio(asignacion.id_envio);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    ) : (
      <p>No se encontraron Envíos.</p>
    )}
  </>
  ) : (
    <>
      <h2>Resultados de la Búsqueda de Paquetes:</h2>
      {searchListP.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Envío</th>
              <th>Peso</th>
              <th>Largo</th>
              <th>Ancho</th>
              <th>Alto</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {searchListP.map((asignacion) => (
              <tr key={asignacion.id_paquete}>
                <td>{asignacion.id_envio}</td>
                <td>{asignacion.peso}</td>
                <td>{asignacion.largo}</td>
                <td>{asignacion.ancho}</td>
                <td>{asignacion.alto}</td>
                <td>{asignacion.descripcion}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm("¿Estás seguro de que deseas eliminar este paquete?")) {
                        DeletePaquete(asignacion.id_paquete);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No se encontraron Paquetes.</p>
      )}
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default GestionEnv;
