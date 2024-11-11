import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate para la navegación
import '../Css/TestEnvios.css';

const TestEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  // Cargar los envíos cuando el componente se monte
  useEffect(() => {
    axios.get('https://mitversa.christianferrer.me/api/envios/')
      .then(response => {
        setEnvios(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los envíos:', error);
      });

    // Cargar las direcciones, comunas y ciudades
    axios.get('https://mitversa.christianferrer.me/api/direcciones/')
      .then(response => {
        setDirecciones(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las direcciones:', error);
      });

    axios.get('https://mitversa.christianferrer.me/api/comunas/')
      .then(response => {
        setComunas(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las comunas:', error);
      });

    axios.get('https://mitversa.christianferrer.me/api/ciudades/')
      .then(response => {
        setCiudades(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las ciudades:', error);
      });
  }, []);

  // Función para obtener el nombre de la ciudad de una dirección
  const obtenerCiudad = (idComuna) => {
    const comuna = comunas.find(c => c.id_comuna === idComuna);
    if (comuna) {
      const ciudad = ciudades.find(c => c.id_ciudad === comuna.id_ciudad);
      return ciudad ? ciudad.nombre : 'Ciudad no encontrada';
    }
    return 'Comuna no encontrada';
  };

  // Función para obtener la ciudad de origen y destino
  const obtenerCiudadEnvio = (direccionId) => {
    const direccion = direcciones.find(d => d.id_direccion === direccionId);
    if (direccion) {
      const ciudad = obtenerCiudad(direccion.id_comuna);
      return `${ciudad}, Chile`; // Agregar "Chile" al final de la ciudad 

    }
    return 'Dirección no encontrada';
  };

  // Función para navegar al mapa con la ruta de un envío
  const verMapa = (envio) => {
    // Redirigir a la página del mapa con el id_envio como parámetro
    const ciudadOrigen = obtenerCiudadEnvio(envio.direccion_origen);
    const ciudadDestino = obtenerCiudadEnvio(envio.direccion_destino);
  // Redirigir a la página del mapa con los parámetros correspondientes
    navigate(`/ruta/${envio.id_envio}?origen=${ciudadOrigen}&destino=${ciudadDestino}`);
  };

  return (
    <div className="envios-container">
      {envios.map((envio, index) => (
        <div key={envio.id_envio} className="envio-card">
          <h3>Envío {index + 1}</h3>
          <p><strong>Origen:</strong> Ciudad: {obtenerCiudadEnvio(envio.direccion_origen)}</p>
          <p><strong>Destino:</strong> Ciudad: {obtenerCiudadEnvio(envio.direccion_destino)}</p>
          <p><strong>Costo:</strong> ${envio.costo_total}</p>
          <p><strong>Fecha de Inicio:</strong> {new Date(envio.fecha_pedido_inicio).toLocaleString()}</p>
          <p><strong>Fecha de Fin:</strong> {new Date(envio.fecha_pedido_fin).toLocaleString()}</p>
          <button onClick={() => verMapa(envio)}>Ver mapa</button>
        </div>
      ))}
    </div>
  );
};

export default TestEnvios;
