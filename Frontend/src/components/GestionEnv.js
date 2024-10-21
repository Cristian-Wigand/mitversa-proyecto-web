import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import '../App.css';

const GestionEnv = () => {
  const [createDireccion, setCreateDireccion] = useState({
    id_comuna: '',
    id_ciudad: '',
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

  const [comunas, setComunas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [estadosEnvio, setEstadosEnvio] = useState([]); // Nuevo estado para almacenar los estados de envío
  const [selectedComuna, setSelectedComuna] = useState('');
  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [menuTop, setMenuTop] = useState(150);
  const [allComunas, setAllComunas] = useState([]);

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch comunas y ciudades desde la API
    fetch('https://mitversa.christianferrer.me/api/comunas/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const uniqueComunas = Array.from(
          new Set(data.map((comuna) => comuna.nombre)),
        ).map((nombre) => data.find((comuna) => comuna.nombre === nombre));
        setComunas(uniqueComunas);
        setAllComunas(data);
      })
      .catch((error) => console.error('Error al obtener comunas:', error));

    fetch('https://mitversa.christianferrer.me/api/ciudades/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCiudades(data);
      })
      .catch((error) => console.error('Error al obtener ciudades:', error));

    // Fetch estados de envío desde la API
    fetch('https://mitversa.christianferrer.me/api/estados-envio/', {
      // Cambia esta URL a la correcta para obtener los estados de envío
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEstadosEnvio(data); // Guardar los estados de envío en el nuevo estado
        console.log(data);
      })
      .catch((error) =>
        console.error('Error al obtener estados de envío:', error),
      );
  }, []);

  const handleComunaChange = (e) => {
    const selectedNombreComuna = e.target.value;
    setSelectedComuna(selectedNombreComuna);

    const filteredComunas = allComunas.filter(
      (comuna) => comuna.nombre === selectedNombreComuna,
    );
    const idsCiudades = filteredComunas.map((comuna) => comuna.id_ciudad);

    const ciudadesFiltradas = ciudades.filter((ciudad) =>
      idsCiudades.includes(ciudad.id_ciudad),
    );

    setFilteredCiudades(ciudadesFiltradas);

    setCreateDireccion({
      ...createDireccion,
      id_comuna: filteredComunas.length > 0 ? filteredComunas[0].id_comuna : '',
    });
  };

  const handleCiudadChange = (e) => {
    setCreateDireccion({
      ...createDireccion,
      id_ciudad: e.target.value,
    });
  };

  const handleCreateDireccion = (e) => {
    setCreateDireccion({ ...createDireccion, [e.target.name]: e.target.value });
  };

  const handleCreateEnvio = (e) => {
    setCreateEnvio({ ...createEnvio, [e.target.name]: e.target.value });
  };

  const handleCreatePaquete = (e) => {
    setCreatePaquete({ ...createPaquete, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateDireccion = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/direcciones/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createDireccion),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Dirección creada:', data);
        alert('Dirección creada exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear la dirección:', error);
        alert('Error al crear la dirección');
      });
  };

  const handleSubmitCreateEnvio = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/envios/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createEnvio),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Envío creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el envío:', error);
        alert('Error al crear el envío');
      });
  };

  const handleSubmitCreatePaquete = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/paquetes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createPaquete),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Paquete creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el paquete:', error);
        alert('Error al crear el paquete');
      });
  };

  return (
    <div>
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#direccion">Crear Dirección</a>
          </li>
          <li>
            <a href="#envio">Crear Envío</a>
          </li>
          <li>
            <a href="#paquete">Crear Paquete</a>
          </li>
        </ul>
      </div>

      <div className="user-management-page">
        <h1>Gestionar Envío</h1>

        {/* Formulario para crear dirección */}
        <form
          className="form"
          onSubmit={handleSubmitCreateDireccion}
          id="direccion"
        >
          <h2>Crear Dirección</h2>
          <select name="comuna" onChange={handleComunaChange}>
            <option value="">Seleccione una comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna.id_comuna} value={comuna.nombre}>
                {comuna.nombre}
              </option>
            ))}
          </select>
          {/* Mostrar la ciudad asociada */}
          <select
            name="ciudad"
            onChange={handleCiudadChange}
            value={createDireccion.id_ciudad}
          >
            <option value="">Seleccione una ciudad</option>
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
            onChange={handleCreateDireccion}
          />
          <input
            type="number"
            name="numero"
            placeholder="Número"
            value={createDireccion.numero}
            onChange={handleCreateDireccion}
            min="1"
            step="1"
          />
          <button type="submit">Crear Dirección</button>
        </form>

        {/* Formulario para crear envío */}
        <form className="form" onSubmit={handleSubmitCreateEnvio} id="envio">
          <h2>Crear Envío</h2>
          <select
            name="id_estado_envio"
            onChange={handleCreateEnvio}
            value={createEnvio.id_estado_envio}
          >
            <option value="">Seleccione un estado de envío</option>
            {estadosEnvio.map((estado) => (
              <option
                key={estado.id_estado_envio}
                value={estado.id_estado_envio}
              >
                {estado.nombre}{' '}
                {/* Asegúrate de que la propiedad que quieres mostrar es 'descripcion' */}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={createEnvio.id_repartidor}
            onChange={handleCreateEnvio}
            min="1"
          />
          <input
            type="number"
            name="id_cliente"
            placeholder="ID Cliente"
            value={createEnvio.id_cliente}
            onChange={handleCreateEnvio}
            min="1"
          />
          <input
            type="datetime-local"
            name="fecha_pedido_inicio"
            value={createEnvio.fecha_pedido_inicio}
            onChange={handleCreateEnvio}
          />
          <input
            type="datetime-local"
            name="fecha_pedido_fin"
            value={createEnvio.fecha_pedido_fin}
            onChange={handleCreateEnvio}
          />
          <input
            type="text"
            name="direccion_origen"
            placeholder="Dirección Origen"
            value={createEnvio.direccion_origen}
            onChange={handleCreateEnvio}
          />
          <input
            type="text"
            name="direccion_destino"
            placeholder="Dirección Destino"
            value={createEnvio.direccion_destino}
            onChange={handleCreateEnvio}
          />
          <input
            type="number"
            name="costo_total"
            placeholder="Costo Total"
            value={createEnvio.costo_total}
            onChange={handleCreateEnvio}
            min="0"
          />
          <button type="submit">Crear Envío</button>
        </form>

        {/* Formulario para crear paquete */}
        <form
          className="form"
          onSubmit={handleSubmitCreatePaquete}
          id="paquete"
        >
          <h2>Crear Paquete</h2>
          <input
            type="number"
            name="id_envio"
            placeholder="ID Envío"
            value={createPaquete.id_envio}
            onChange={handleCreatePaquete}
            min="1"
          />
          <input
            type="number"
            name="peso"
            placeholder="Peso"
            value={createPaquete.peso}
            onChange={handleCreatePaquete}
            min="0"
          />
          <input
            type="number"
            name="largo"
            placeholder="Largo"
            value={createPaquete.largo}
            onChange={handleCreatePaquete}
            min="0"
          />
          <input
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={createPaquete.ancho}
            onChange={handleCreatePaquete}
            min="0"
          />
          <input
            type="number"
            name="alto"
            placeholder="Alto"
            value={createPaquete.alto}
            onChange={handleCreatePaquete}
            min="0"
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={createPaquete.descripcion}
            onChange={handleCreatePaquete}
          />
          <button type="submit">Crear Paquete</button>
        </form>
      </div>
    </div>
  );
};

export default GestionEnv;
