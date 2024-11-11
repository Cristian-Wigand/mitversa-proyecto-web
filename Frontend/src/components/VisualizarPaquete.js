import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/VisualizarPaquete.css';
import Conexiones from './conexiones';
const conexiones = Conexiones();

const PackageCard = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoEnvioData, setEstadoEnvioData] = useState([]);
  const [usuarioData, setUsuarioData] = useState([]);
  const [selectedOption2, setSelectedOption2] = useState('');

  const [searchEnvio, setSearchEnvio] = useState({
    id_envio: '',
    id_estado_envio: '1',
    id_repartidor: '',
    id_cliente: '',
    fecha_pedido_inicio: '',
    fecha_pedido_fin: '',
    direccion_origen: '',
    direccion_destino: '',
    costo_total: '',
  });

  useEffect(() => {
    const tipoUsuario = sessionStorage.getItem('tipoUsuario');
    if (tipoUsuario !== 'repartidor') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const id_usuario_r = sessionStorage.getItem('userId');
      console.log('id_usuario_r', id_usuario_r);

      try {
        const resultado = await conexiones.fetchSearch('Envio', {
          id_repartidor: `${id_usuario_r}`,
        });

        console.log('resultado[0]', resultado[0]);

        if (resultado[0]) {
          setPackageData(resultado[1]);
          console.log('resultado[1]', resultado[1]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (fecha) => {
    const date = new Date(fecha); // Convierte la fecha a un objeto Date
    const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día y lo formatea
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (con +1 porque los meses empiezan en 0)
    const year = date.getFullYear(); // Obtiene el año

    return `${day}-${month}-${year}`; // Devuelve la fecha en formato "DD-MM-YYYY"
  };

  const Select2Change = (e) => {
    setSelectedOption2(e.target.value);
  };

  const SearchEnvio = (e) => {
    setSearchEnvio({ ...searchEnvio, [e.target.name]: e.target.value });
  };

  const SubmitSearch = async (e) => {
    e.preventDefault();
    const resultado = await conexiones.fetchSearch('Envio', {
      [selectedOption2]: searchEnvio[selectedOption2],
    });
    if (resultado[0]) {
      setPackageData(resultado[1]);
    } else {
      setPackageData([]);
    }
    setSearchEnvio({
      id_envio: '',
      id_estado_envio: '1',
      id_repartidor: '',
      id_cliente: '',
      fecha_pedido_inicio: '',
      fecha_pedido_fin: '',
      direccion_origen: '',
      direccion_destino: '',
      costo_total: '',
    });
  };

  // Manejo de estado de envío (Estado_envio)
  useEffect(() => {
    const fetchEstadoEnvio = async () => {
      const data = await Promise.all(
        packageData.map(async (envio) => {
          const estado = await Search('Estado_envio', {
            id_estado_envio: envio.id_estado_envio,
          });
          return estado.length > 0 ? estado[0] : null;
        })
      );
      setEstadoEnvioData(data);
    };

    if (packageData.length > 0) {
      fetchEstadoEnvio();
    }
  }, [packageData]);

  // Manejo de datos de Usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      const data = await Promise.all(
        packageData.map(async (envio) => {
          const usuario = await Search('Usuario', {
            id_usuario: envio.id_cliente,
          });
          return usuario.length > 0 ? usuario[0] : null;
        })
      );
      setUsuarioData(data);
    };

    if (packageData.length > 0) {
      fetchUsuario();
    }
  }, [packageData]);

  // Función asincrónica para hacer la búsqueda
  const Search = async (nombre, filter) => {
    try {
      const resultado = await conexiones.fetchSearch(nombre, filter);
      if (resultado[0]) {
        return resultado[1];
      } else {
        alert(`Problemas con ${nombre} y ${filter}`);
      }
    } catch (error) {
      console.error('Error en Search:', error);
    }
  };

  // Mostrar la pantalla de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {/* Buscar */}
      <form className="form" onSubmit={SubmitSearch} id="Buscador">
        <h2>Filtrar</h2>
        <select
          name="criterioBusqueda"
          onChange={Select2Change}
          value={selectedOption2}
        >
          <option value="">Selecciona un criterio</option>
          <option value="id_envio">Id Envio</option>
          <option value="id_estado_envio">Estado</option>
          <option value="fecha_pedido_inicio">Fecha pedido inicio</option>
          <option value="fecha_pedido_fin">Fecha pedido fin</option>
          <option value="costo_total">Costo total</option>
        </select>

        {selectedOption2 === 'id_estado_envio' ? (
          <select
            value={searchEnvio[selectedOption2] || ''}
            onChange={SearchEnvio}
            name={selectedOption2}
            disabled={!selectedOption2}
          >
            <option value="1">Pendiente</option>
            <option value="2">En transito</option>
            <option value="3">Entregado</option>
            <option value="4">Cancelado</option>
          </select>
        ) : (
          <input
            type={
              selectedOption2 === 'fecha_pedido_inicio' ||
              selectedOption2 === 'fecha_pedido_fin'
                ? 'date'
                : 'text'
            }
            name={selectedOption2}
            placeholder={`Ingresa ${selectedOption2}`}
            value={searchEnvio[selectedOption2] || ''}
            onChange={SearchEnvio}
            disabled={!selectedOption2}
          />
        )}
        <button type="submit">Buscar</button>
      </form>

      {/* Resultados de búsqueda */}
      <div className="package-list">
        {packageData.length === 0 ? (
          <div>No hay envíos pendientes</div>
        ) : (
          packageData.map((envio, index) => (
            <div className="package-card" key={envio.id_envio}>
              <div className="package-header">
                Ordenado el: {formatDate(envio.fecha_pedido_inicio)} Llega el:{' '}
                {formatDate(envio.fecha_pedido_fin)}
              </div>
              <div className="package-content">
                <div className="package-id">ID: {envio.id_envio}</div>
                <div className="package-details">
                  <p>
                    <strong>Cliente:</strong>{' '}
                    {usuarioData[index]
                      ? usuarioData[index].nombre
                      : 'Cargando cliente...'}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    {estadoEnvioData[index]
                      ? estadoEnvioData[index].nombre
                      : 'Cargando estado...'}
                  </p>
                </div>
                <button className="status-button">Visualizar estado</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PackageCard;
