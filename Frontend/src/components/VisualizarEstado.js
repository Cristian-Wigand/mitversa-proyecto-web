import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Conexiones from './conexiones';
const conexiones = Conexiones();

const EstadoEnvio = () => {
  const location = useLocation();
  const { paquete, envio, estadoEnvio, usuario } = location.state || {};

  // Estado para almacenar las direcciones
  const [direccionOrigen, setDireccionOrigen] = useState(null);
  const [direccionDestino, setDireccionDestino] = useState(null);

  // Función para buscar dirección
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

  // Usar useEffect para cargar las direcciones cuando el componente se monta
  useEffect(() => {
    const cargarDirecciones = async () => {
      if (envio?.direccion_origen) {
        const direccionOrigen = await buscar_direccion(envio.direccion_origen);
        setDireccionOrigen(direccionOrigen);
      }
      if (envio?.direccion_destino) {
        const direccionDestino = await buscar_direccion(
          envio.direccion_destino,
        );
        setDireccionDestino(direccionDestino);
      }
    };

    cargarDirecciones();
  }, [envio]); // Ejecutar cuando el objeto 'envio' cambie

  return (
    <div className="estado-envio">
      <h2>Detalles del Estado del Envío</h2>
      <div>
        <strong>ID Envío:</strong> {envio?.id_envio}
      </div>
      <div>
        <strong>ID Paquete:</strong> {paquete?.id_paquete}
      </div>
      <div>
        <strong>Estado:</strong>{' '}
        {estadoEnvio ? estadoEnvio.nombre : 'Cargando estado...'}
      </div>
      <div>
        <strong>Cliente:</strong>{' '}
        {usuario
          ? `${usuario.nombre} ${usuario.apellido}`
          : 'Cargando cliente...'}
      </div>
      <div>
        <strong>Dirección Origen:</strong>{' '}
        {direccionOrigen
          ? `${direccionOrigen.join(' ')}`
          : 'Cargando dirección origen...'}
      </div>
      <div>
        <strong>Dirección Destino:</strong>{' '}
        {direccionDestino
          ? `${direccionDestino.join(' ')}`
          : 'Cargando dirección destino...'}
      </div>
    </div>
  );
};

export default EstadoEnvio;
