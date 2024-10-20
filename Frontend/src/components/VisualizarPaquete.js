// src/components/PackageCard.js
import React, { useState, useEffect } from 'react';
import '../Css/VisualizarPaquete.css';

const PackageCard = () => {
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamada a la API para obtener datos del paquete
    fetch('http://mitversa.christianferrer.me/api/paquetes/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((data) => {
        setPackageData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del paquete:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras esperas la respuesta
  }

  if (error) {
    return <div>Error: {error}</div>; // Manejo de errores
  }

  if (packageData.length === 0) {
    return <div>No hay paquetes disponibles</div>; // Manejo de caso sin paquetes
  }

  return (
    <div className="package-list">
      {packageData.map((paquete) => (
        <div className="package-card" key={paquete.id_paquete}>
          <div className="package-header">Última fecha de actualización</div>
          <div className="package-content">
            <div className="package-id">Paquete ID: {paquete.id_paquete}</div>
            <div className="package-description">{paquete.descripcion}</div>
            <div className="package-details">
              <p>
                <strong>Peso:</strong> {paquete.peso} kg
              </p>
              <p>
                <strong>Dimensiones:</strong> {paquete.largo}x{paquete.ancho}x
                {paquete.alto} cm
              </p>
            </div>
            <button className="status-button">Visualizar estado</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageCard;
