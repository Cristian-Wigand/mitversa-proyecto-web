import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import '../Css/Login.css';
import '../App.css';

const GestionEnv = () => {
  const [createComuna, setCreateComuna] = useState({ nombre: '', id_ciudad: '' });
  const [createCiudad, setCreateCiudad] = useState({ nombre: '' });
  const [createDireccion, setCreateDireccion] = useState({
    id_comuna: '',
    calle: '',
    numero: '',
  });
  const [createEnvio, setCreateEnvio] = useState({
    id_envio: '',
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
    id_paquete: '',
    id_envio: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    descripcion: '',
  });

  const [menuTop, setMenuTop] = useState(150);

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    setMenuTop(scrollY <= 150 ? 150 : scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreateComuna = (e) => {
    setCreateComuna({ ...createComuna, [e.target.name]: e.target.value });
  };

  const handleCreateCiudad = (e) => {
    setCreateCiudad({ ...createCiudad, [e.target.name]: e.target.value });
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

  const handleSubmitCreateCiudad = (e) => {
    e.preventDefault();
    if (!createCiudad.nombre) {
      alert('El nombre de la ciudad es obligatorio');
      return;
    }

    fetch('https://mitversa.christianferrer.me/api/ciudades/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createCiudad),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Ciudad creada:', data);
        alert('Ciudad creada exitosamente');
        setCreateCiudad({ nombre: '' }); // Reset form
      })
      .catch((error) => {
        console.error('Error al crear la ciudad:', error);
        alert(error.message || 'Error al crear la ciudad');
      });
  };

  const handleSubmitCreateComuna = (e) => {
    e.preventDefault();
    if (!createComuna.id_ciudad) {
      alert('El ID de ciudad es obligatorio');
      return;
    }

    fetch(`https://mitversa.christianferrer.me/api/ciudades/${createComuna.id_ciudad}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ciudad no existe');
        }
        return response.json();
      })
      .then(() => {
        return fetch('https://mitversa.christianferrer.me/api/comunas/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
          },
          body: JSON.stringify(createComuna),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Comuna creada:', data);
        alert('Comuna creada exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear la comuna:', error);
        alert(error.message || 'Error al crear la comuna');
      });
  };

  const handleSubmitCreateDireccion = (e) => {
    e.preventDefault();
    fetch('https://mitversa.christianferrer.me/api/direcciones/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
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
    console.log('Datos del envío:', createEnvio); // Debugging
    fetch('https://mitversa.christianferrer.me/api/envios/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createEnvio),
    })
      .then((response) => {
        console.log('Código de respuesta:', response.status); // Debugging
        return response.json().then(data => ({ data, status: response.status }));
      })
      .then(({ data, status }) => {
        console.log('Datos del envío creado:', data);
        if (status === 200 || status === 201) {
          alert('Envío creado exitosamente');
        } else {
          alert('Error al crear el envío: ' + (data.message || 'Error desconocido'));
        }
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
        'Authorization': 'Basic ' + btoa('TI2:R1yJJtW9X31rxY'),
      },
      body: JSON.stringify(createPaquete),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Paquete creado:', data);
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
          <li><a href="#comuna">Comuna</a></li>
          <li><a href="#direccion">Dirección</a></li>
          <li><a href="#envio">Envío</a></li>
          <li><a href="#paquete">Paquete</a></li>
          <li><a href="#ciudad">Ciudad</a></li>
        </ul>
      </div>

      <div className="user-management-page">
        <h1>Gestionar Envío</h1>

        {/* Formulario para crear ciudad */}
        <form className="form" onSubmit={handleSubmitCreateCiudad} id="ciudad">
          <h2>Crear Ciudad</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre Ciudad"
            value={createCiudad.nombre}
            onChange={handleCreateCiudad}
            required
          />
          <button type="submit">Crear Ciudad</button>
        </form>

        {/* Formulario para crear comuna */}
        <form className="form" onSubmit={handleSubmitCreateComuna} id="comuna">
          <h2>Crear Comuna</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre Comuna"
            value={createComuna.nombre}
            onChange={handleCreateComuna}
          />
          <input
            type="number"
            name="id_ciudad"
            placeholder="ID Ciudad"
            value={createComuna.id_ciudad}
            onChange={handleCreateComuna}
            min="1"
            step="1"
            required
          />
          <button type="submit">Crear Comuna</button>
        </form>

        {/* Formulario para crear dirección */}
        <form className="form" onSubmit={handleSubmitCreateDireccion} id="direccion">
          <h2>Crear Dirección</h2>
          <input
            type="number"
            name="id_comuna"
            placeholder="ID Comuna"
            value={createDireccion.id_comuna}
            onChange={handleCreateDireccion}
            min="1"
            step="1"
          />
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
          <input
            type="number"
            name="id_envio"
            placeholder="ID Envío"
            value={createEnvio.id_envio}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
          />
          <input
            type="text"
            name="id_estado_envio"
            placeholder="ID Estado Envío"
            value={createEnvio.id_estado_envio}
            onChange={handleCreateEnvio}
          />
          <input
            type="number"
            name="id_repartidor"
            placeholder="ID Repartidor"
            value={createEnvio.id_repartidor}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="id_cliente"
            placeholder="ID Cliente"
            value={createEnvio.id_cliente}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
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
            min="1"
            step="0.01"
          />
          <button type="submit">Crear Envío</button>
        </form>

        {/* Formulario para crear paquete */}
        <form className="form" onSubmit={handleSubmitCreatePaquete} id="paquete">
          <h2>Crear Paquete</h2>
          <input
            type="number"
            name="id_paquete"
            placeholder="ID Paquete"
            value={createPaquete.id_paquete}
            onChange={handleCreatePaquete}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="id_envio"
            placeholder="ID Envío"
            value={createPaquete.id_envio}
            onChange={handleCreatePaquete}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="peso"
            placeholder="Peso (kg)"
            value={createPaquete.peso}
            onChange={handleCreatePaquete}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="largo"
            placeholder="Largo (cm)"
            value={createPaquete.largo}
            onChange={handleCreatePaquete}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="ancho"
            placeholder="Ancho (cm)"
            value={createPaquete.ancho}
            onChange={handleCreatePaquete}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="alto"
            placeholder="Alto (cm)"
            value={createPaquete.alto}
            onChange={handleCreatePaquete}
            min="0"
            step="0.01"
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
