// src/components/EstadoPaquete.js
import React from 'react';
import '../App.css';

const EstadoPaquete = () => {
  return (
    <div className="estado-paquete-container">
      <div className="estado-ruta">
        pendiente &gt; en tránsito &gt; entregado &gt; cancelado
      </div>
      <div className="contenido-paquete">
        <h2>Contenido del paquete:</h2>
        <p>
          Contenido, Contenido, Contenido, Contenido, Contenido, Contenido,
          Contenido, Contenido, Contenido, Contenido, Contenido, Contenido
        </p>
      </div>
      <div className="estado-envio">
        <h2>Estado del envío</h2>
        <p>Descripción del estado en el que esté.</p>
      </div>
    </div>
  );
};

export default EstadoPaquete;
