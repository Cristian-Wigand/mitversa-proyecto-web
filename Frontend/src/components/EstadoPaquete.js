import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import '../App.css';
import Conexiones from './conexiones';
import 'leaflet/dist/leaflet.css';
import '../Css/MapWithRoute.css'; 
import MapWithRoute from './MapWithRoute';
const conexiones = Conexiones();

const EstadoPaquete = () => {
  const [direccionOrigen, setDireccionOrigen] = useState(null);
  const [direccionDestino, setDireccionDestino] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Aquí se obtiene la función navigate
  const { paquete, envio, estadoEnvio, cliente } = location.state || {};
  const [envio_ultimo, setEnvio_ultimo] = useState(envio);
  const [estadoEnvio_ultimo, setEstadoEnvioUltimo] = useState(estadoEnvio);
  const [listHistorialEnvio, setListHistorialEnvio] = useState([]);
  const [ultimoEstado, setUltimoEstado] = useState({ detalles: '' });
  const [ultimaDireccion, setUltimaDireccion] = useState();
  const [textoExpandido, setTextoExpandido] = useState(false);
  const [comunas, setComunas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [estadosEnvio, setEstadosEnvio] = useState([]);
  const [allComunas, setAllComunas] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [createDireccion, setCreateDireccion] = useState({
    id_ciudad: '',
    nombre: '',
    calle: '',
    numero: '',
  });
  const [createHistorial, setCreateHistorial] = useState({
    id_envio: envio.id_envio,
    fecha: '',
    detalles: '',
    direccion: '',
  });
  const [actualizarEnv, setActualizarEnv] = useState({
    id_estado_envio: '',
    id_repartidor: '',
    id_cliente: '',
    fecha_pedido_inicio: '',
    fecha_pedido_fin: '',
    direccion_origen: '',
    direccion_destino: '',
    costo_total: '',
  });

  // Estado para controlar si el formulario está activo
  const [activeForm, setActiveForm] = useState(null);
  const [estadoGeneral, setEstadoGeneral] = useState();

  const CreateHistorial = (e) => {
    setCreateHistorial({ ...createHistorial, [e.target.name]: e.target.value });
  };
  const ActualizarEnv = (e) => {
    setActualizarEnv({ ...actualizarEnv, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultado = await conexiones.fetchSearch('Historial_envio', {
          id_envio: envio.id_envio,
        });
        console.log('resultado actualizar env', resultado);
        if (resultado[0]) {
          const historial = resultado[1];
          setListHistorialEnvio(historial);

          if (historial.length > 0) {
            const reciente = historial.reduce((masReciente, actual) => {
              return new Date(actual.fecha) > new Date(masReciente.fecha)
                ? actual
                : masReciente;
            });
            const ultimadirec = await buscar_direccion(reciente.direccion);
            setUltimaDireccion(ultimadirec);
            console.log('ultimaDireccion después de setUltimaDireccion', ultimadirec); 
            setUltimoEstado(reciente);
          } else {
            setUltimoEstado({ detalles: '' });
            setUltimaDireccion('Null');
          }
        } else {
          setUltimoEstado({ detalles: '' });
        }
      } catch (error) {
        console.error('Error al obtener los datos del historial:', error);
      }
    };

    const envio_y_estado = async () => {
      try {
        const resultado = await conexiones.fetchSearch('Envio', {
          id_envio: envio.id_envio,
        });
        if (resultado[0]) {
          const envioData = resultado[1];
          setEnvio_ultimo(envioData);

          const resultado2 = await conexiones.fetchSearch('Estado_envio', {
            id_estado_envio: envioData[0].id_estado_envio,
          });
          if (resultado2[0]) {
            setEstadoEnvioUltimo(resultado2[1][0]);
            console.log(
              'setEstadoEnvioUltimo(resultado2[1][0])',
              resultado2[1][0],
            );
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos de envío o estado:', error);
      }
    };

    if (envio.id_envio) {
      fetchData();
      envio_y_estado();
    }
  }, [envio.id_envio]);

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

  // Usar useEffect para cargar las direcciones cuando el componente se monta
  useEffect(() => {
    const cargarDirecciones = async () => {
      if (envio?.direccion_origen) {
        const direccionOrigen = await buscar_direccion(envio.direccion_origen);
        console.log("Direccion Origen:", direccionOrigen[1]);
        setDireccionOrigen(direccionOrigen);
      }
      if (envio?.direccion_destino) {
        const direccionDestino = await buscar_direccion(
          envio.direccion_destino,
        );
        console.log("Direccion Destino:", direccionDestino);
        setDireccionDestino(direccionDestino);
      }
    };

    cargarDirecciones();
  }, [envio]); // Ejecutar cuando el objeto 'envio' cambie

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
    setCreateDireccion({
      ...createDireccion,
      nombre: selectedNombreComuna,
    });
  };

  const CiudadChange = (e, num) => {
    const selectedValue = e.target.value;

    if (num === 0) {
      setCreateDireccion({
        ...createDireccion,
        id_ciudad: selectedValue,
      });
    }
  };
  const CreateDireccion = (e) => {
    setCreateDireccion({
      ...createDireccion,
      [e.target.name]: e.target.value,
    });
  };

  const toggleForm = (form) => {
    setActiveForm(activeForm === form ? null : form);
  };
  const buscar_direccion = async (id) => {
    const resultado = await conexiones.fetchSearch('Direccion', {
      id_direccion: id,
    });
    if (!resultado[0]) {
      return 'Null';
    }
    let calle = resultado[1][0].calle;
    let numero = resultado[1][0].numero;
    const comuna = resultado[1][0].id_comuna;
    const resultado2 = await conexiones.fetchSearch('Comuna', {
      id_comuna: comuna,
    });
    if (!resultado2[0]) {
      return 'Null';
    }
    const ciudad = resultado2[1][0].id_ciudad;
    const comuna_nombre = resultado2[1][0].nombre;
    const resultado3 = await conexiones.fetchSearch('Ciudad', {
      id_ciudad: ciudad,
    });
    const ciudad_nombre = resultado3[1][0].nombre;

    if (numero === 'null') {
      numero = '';
    }
    const direccion_list = [comuna_nombre, ciudad_nombre, calle, numero];
    return direccion_list;
  };

  const actualizarEstado = async (e) => {
    e.preventDefault();
    const id_comuna_origen = await conexiones.fetchSearch('Comuna', {
      nombre: createDireccion.nombre,
      id_ciudad: createDireccion.id_ciudad,
    });
    if (!id_comuna_origen[0]) {
      console.log('Error en comuna origen');
      return alert('Error en comuna origen');
    }
    const direc_origen = {
      id_comuna: id_comuna_origen[1][0].id_comuna,
      calle: createDireccion.calle,
      numero: createDireccion.numero,
    };
    let direccion_origen_id; // Declarar fuera del bloque
    let direccion_origen;

    direccion_origen = await conexiones.SubmitCreate('Direccion', direc_origen);

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
    createHistorial.direccion = direccion_origen_id;

    if (estadoGeneral !== estadoEnvio.id_estado_envio) {
      const resultado = await conexiones.updateObject('Envio', envio.id_envio, {
        id_estado_envio: actualizarEnv.id_estado_envio,
      });
      if (!resultado) {
        alert('Error en actualizar envio');
        return;
      }
    }
    if (createHistorial.detalles !== (ultimoEstado.detalles || null)) {
      const resultado2 = await conexiones.SubmitCreate(
        'Historial_envio',
        createHistorial,
      );
      if (!resultado2[0]) {
        alert('Error en Crear Historial_envio');
        return;
      }
      window.location.reload();
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

    return fecha_string;
  };

  // Texto completo y versión abreviada
  // Ordenar de más reciente a más antiguo
  // Ordenar de más reciente a más antiguo
  listHistorialEnvio.sort((a, b) => b.fecha - a.fecha);

  // Invertir el orden de los detalles para que el más reciente aparezca primero
  // Generar el texto completo, con los detalles y la fecha
  const textoCompleto = [...listHistorialEnvio]
    .reverse()
    .map((obj) => {
      // Determinamos las clases según la condición
      const name1 =
        ultimoEstado.detalles === obj.detalles ? 'ver1_especial' : 'ver1';
      const name2 =
        ultimoEstado.detalles === obj.detalles ? 'ver2_especial' : 'ver2';
      console.log('ultimoEstado', ultimoEstado, ultimoEstado.detalles);

      // Retornamos la plantilla HTML con las clases correspondientes
      return `
      <div class="historial-item">
        <span class="${name1}">${obj.detalles}</span>
        <span class="${name2}">${convertir_fecha(obj.fecha)}</span>
      </div>
    `;
    })
    .join('');

  const textoCorto = textoCompleto.slice(0, 50) + '...';
  console.log('listHistorialEnvio', listHistorialEnvio);

  // Función que determina el color según el estado actual
  const getColor = (estado) =>
    estado === estadoEnvio_ultimo.nombre ? 'orange' : 'gray';

  // Los estados posibles
  const estados = ['pendiente', 'en_transito', 'entregado', 'cancelado'];

  const back = () => {
    // Redirigir a la página "Visualizar paquete"
    navigate('/VisualizarPaquete');
  };

  console.log(ultimaDireccion)


  
  return (
    <div>
      <button className="status-back" onClick={() => back()}>
        Back
      </button>
      <div className="estado-paquete-container">
        <div className="estado-ruta">
          <span>
            {estados.map((estado, index) => (
              <span
                key={index}
                style={{
                  color: getColor(estado), // Aplica el color dinámicamente
                  fontWeight:
                    estado === estadoEnvio_ultimo.nombre ? 'bold' : 'normal', // Resalta el estado seleccionado
                }}
              >
                {estado}
                {index < estados.length - 1 && ' > '}{' '}
                {/* Añade el separador si no es el último */}
              </span>
            ))}
          </span>
          <button
            className="actualizar-estado-boton"
            onClick={() => toggleForm('estado')}
          >
            Actualizar estado
          </button>
        </div>

        {/* Formulario para actualizar estado */}
        {activeForm === 'estado' && (
          <form className="update-form" onSubmit={actualizarEstado}>
            {/* Select de estado */}
            <select
              className="select-margin"
              name="id_estado_envio"
              value={actualizarEnv.id_estado_envio}
              onChange={ActualizarEnv}
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
              type="text"
              name="detalles"
              value={createHistorial.detalles}
              onChange={CreateHistorial}
              placeholder="Actualizar estado actual"
              required
            />
            {/*Direccion*/}
            <select
              className="select-margin"
              name="comuna"
              onChange={ComunaChange}
              value={createDireccion.nombre}
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
              className="select-margin"
              name="ciudad"
              onChange={(e) => CiudadChange(e, 0)} // Cambiar según la lógica
              value={createDireccion.id_ciudad}
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
              value={createDireccion.calle}
              onChange={CreateDireccion}
              required
            />
            <input
              type="number"
              name="numero"
              placeholder="Número"
              value={createDireccion.numero}
              onChange={CreateDireccion}
              min="1"
              step="1"
              required
            />
            <button type="submit" className="submit-button">
              Guardar
            </button>
            <button
              type="button"
              className="discard-button"
              onClick={() => setActiveForm(null)} // Cierra el formulario
            >
              Descartar
            </button>
          </form>
        )}

        <div className="contenido-paquete">
          <h2 className="h2-color">Detalles del paquete:</h2>
          <p className="h2-color">
            Descripción: {paquete.descripcion}
            <br />
            direccionOrigen: {direccionOrigen ? `${direccionOrigen[2]} ${direccionOrigen[3]}, ${direccionOrigen[1]}` : "Cargando..."}
            <br />
            direccionDestino: {direccionDestino ? `${direccionDestino[2]} ${direccionDestino[3]}, ${direccionDestino[1]}` : "Cargando..."}
            <br />
            Ultima Direccion: {ultimaDireccion ? `${ultimaDireccion[2]} ${ultimaDireccion[3]}, ${ultimaDireccion[1]}` : "Cargando..."}
            <br /> Dimensiones: {paquete.largo}x{paquete.ancho}x{paquete.alto}
            <br /> Peso: {paquete.peso}
          </p>
        </div>
        <div className="estado-envio">
          <h2 className="h2-color">Estado del envío</h2>
          <p
            className="h2-color"
            dangerouslySetInnerHTML={{
              __html: textoExpandido ? textoCompleto : textoCorto,
            }}
          />
          <button
            className="toggle-texto-boton"
            onClick={() => setTextoExpandido(!textoExpandido)}
          >
            {textoExpandido ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        </div>
        <div>
          <h1>Estado del Paquete</h1>
          {direccionOrigen && direccionDestino && ultimaDireccion && direccionOrigen[1] && direccionDestino[1] && ultimaDireccion[1] ? (
  <MapWithRoute address1={`${direccionOrigen[2]} ${direccionOrigen[3]}, ${direccionOrigen[1]}`} address2={`${direccionDestino[2]} ${direccionDestino[3]}, ${direccionDestino[1]}`} address3={`${ultimaDireccion[2]} ${ultimaDireccion[3]}, ${ultimaDireccion[1]}`} />
) : (
  <p>Cargando el mapa...</p>
)}
        </div>

      </div>
    </div>
  );
};

export default EstadoPaquete;